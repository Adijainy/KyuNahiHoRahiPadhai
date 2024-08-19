/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */

const {GoogleGenerativeAI} = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/files");
  
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);
  
  /**
   * Uploads the given file to Gemini.
   *
   * See https://ai.google.dev/gemini-api/docs/prompting_with_media
   */
  async function uploadToGemini(path, mimeType) {
    const uploadResult = await fileManager.uploadFile(path, {
      mimeType,
      displayName: path,
    });
    const file = uploadResult.file;
    console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
    return file;
  }
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "You are an AI assistant designed to help students stay focused on their study topics by analyzing web content. When given a URL, tab heading, and the user's specified study topics, you will determine whether the content of the web page is relevant to those topics. You should not block general websites like google.com, leetcode.com, or youtube.com unless the specific content on those sites is unrelated to the user's study topics (e.g., watching unrelated videos on YouTube).\n\nInstructions:\n1. Input Details:\nURL: The web address of the current tab.\nTab Heading: The title of the web page.\nUser Study Topics: A list of topics the user wants to focus on.\n\n2. Output Requirements:\nRelevance: A simple \"True\" or \"False\" indicating whether the content is relevant to the user's study topics.",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  async function run() {
    // TODO Make these files available on the local file system
    // You may need to update the file paths
    const files = [
      await uploadToGemini("Unknown File", "application/octet-stream"),
    ];
  
    const chatSession = model.startChat({
      generationConfig,
    });
  
    const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
    console.log(result.response.text());
  }
  
  run();