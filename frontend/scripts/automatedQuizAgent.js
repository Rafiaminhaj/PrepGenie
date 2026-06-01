import { GoogleGenerativeAI } from '@google/generative-ai';
import cron from 'node-cron';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const apiKey = process.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  console.error("❌ VITE_GEMINI_API_KEY not found in .env.local");
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

const categories = ['Java', 'Spring Boot', 'JavaScript', 'System Design', 'DSA', 'Python'];
const difficulties = ['Easy', 'Medium', 'Hard'];

const DATA_FILE_PATH = path.resolve(__dirname, '../src/data/quizQuestions.js');

async function generateQuestions(category, difficulty, count = 3) {
  const prompt = `
    You are an expert technical interviewer. Generate exactly ${count} multiple-choice questions for the topic "${category}" at a "${difficulty}" difficulty level.
    
    Return the response STRICTLY as a raw JSON array (no markdown code blocks) matching this format:
    [
      {
        "q": "The question text?",
        "a": ["Option 1", "Option 2", "Option 3", "Option 4"],
        "c": 0, // index of the correct option
        "exp": "Detailed explanation of why this is correct."
      }
    ]
  `;

  let retries = 3;
  while (retries > 0) {
    try {
      const result = await model.generateContent(prompt);
      let text = result.response.text().trim();
      if (text.startsWith('\`\`\`json')) text = text.substring(7);
      else if (text.startsWith('\`\`\`')) text = text.substring(3);
      if (text.endsWith('\`\`\`')) text = text.substring(0, text.length - 3);
      
      return JSON.parse(text.trim());
    } catch (error) {
      console.error(`Failed to generate questions via AI (Retries left: ${retries - 1}):`, error.message);
      retries--;
      if (retries === 0) return [];
      // wait 2 seconds before retrying
      await new Promise(res => setTimeout(res, 2000));
    }
  }
}

async function runAutomation() {
  console.log("🤖 [AI Agent] Waking up to generate new quiz questions...");
  
  // Pick random category and difficulty
  const category = categories[Math.floor(Math.random() * categories.length)];
  const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
  
  console.log(`🤖 [AI Agent] Selected Topic: ${category} | Difficulty: ${difficulty}`);
  
  const newQs = await generateQuestions(category, difficulty, 3);
  if (newQs.length === 0) {
    console.log("🤖 [AI Agent] Failed to generate valid questions. Sleeping.");
    return;
  }
  
  console.log(`🤖 [AI Agent] Successfully generated ${newQs.length} new questions!`);
  
  // Since quizQuestions.js exports a JS object, we'll do a simple append log here for demonstration,
  // or you could replace the file parsing logic here if using JSON.
  // For safety, we will append them to an AI_Generated_Questions.json log file.
  
  const logPath = path.resolve(__dirname, '../src/data/AI_Generated_Questions.json');
  let existingData = [];
  if (fs.existsSync(logPath)) {
    existingData = JSON.parse(fs.readFileSync(logPath, 'utf-8'));
  }
  
  existingData.push({
    timestamp: new Date().toISOString(),
    category,
    difficulty,
    questions: newQs
  });
  
  fs.writeFileSync(logPath, JSON.stringify(existingData, null, 2));
  console.log(`🤖 [AI Agent] Saved new questions to ${logPath}`);
  console.log("🤖 [AI Agent] Task complete. Going back to sleep.");
}

// Run immediately for testing, then schedule
runAutomation().then(() => {
    // Schedule to run every hour at minute 0
    console.log("⏳ [Automation] Scheduling AI Agent to run every hour...");
    cron.schedule('0 * * * *', () => {
      runAutomation();
    });
});
