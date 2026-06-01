import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";

// This file defines the conversational AI Tutor Agent using LangChain.js
// It can maintain conversation state and provide detailed coding help.

let llm;

try {
  // Initialize the LangChain Google GenAI wrapper
  llm = new ChatGoogleGenerativeAI({
    modelName: "gemini-2.5-flash",
    maxOutputTokens: 2048,
    apiKey: import.meta.env.VITE_GEMINI_API_KEY || "dummy_key", 
  });
} catch (error) {
  console.warn("Failed to initialize LangChain LLM. Ensure API key is set.", error);
}

// In a real application, we would use LangGraph to build a tool-calling agent.
// For simplicity in this integration, we provide a structured chat interface.
export const runTutorAgent = async (userQuery, codeContext, conversationHistory = []) => {
  if (!llm) throw new Error("LLM not initialized");

  const systemMessage = new SystemMessage(
    `You are an expert AI Coding Tutor for the PrepGenie platform. 
    You are patient, encouraging, and highly technical.
    
    The user is currently working on this code:
    \`\`\`
    ${codeContext || "// No code provided yet"}
    \`\`\`
    
    Do not just give the direct answer. Provide hints, explain concepts, and guide the user to the solution.`
  );

  const messages = [
    systemMessage,
    ...conversationHistory,
    new HumanMessage(userQuery)
  ];

  try {
    const response = await llm.invoke(messages);
    return response.content;
  } catch (error) {
    console.error("Agent Error:", error);
    return "Sorry, I am having trouble thinking right now. Please try again later.";
  }
};
