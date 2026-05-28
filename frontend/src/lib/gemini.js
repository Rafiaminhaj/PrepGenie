import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  console.warn("VITE_GEMINI_API_KEY is not set in .env.local");
}

const genAI = new GoogleGenerativeAI(apiKey || "dummy_key");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

/**
 * Analyzes code and returns a structured JSON response.
 * @param {string} code 
 * @param {string} language 
 * @param {string} reviewType 
 * @returns {Promise<Object>}
 */
export const analyzeCode = async (code, language, reviewType) => {
  if (!apiKey) {
    throw new Error("Gemini API Key is missing. Please check your .env.local file.");
  }

  const prompt = `
    You are an expert Principal Software Engineer. 
    Analyze the following ${language} code based on a "${reviewType}" focus.
    
    Code:
    \`\`\`${language.toLowerCase()}
    ${code}
    \`\`\`

    Respond STRICTLY with a valid JSON object matching this exact structure:
    {
      "overallScore": <number 0-100>,
      "summary": "<string 2-3 sentences>",
      "security": {
        "score": <number 0-100>,
        "issues": ["<string issue>", ...],
        "suggestions": ["<string suggestion>", ...]
      },
      "performance": {
        "score": <number 0-100>,
        "issues": ["<string issue>", ...],
        "suggestions": ["<string suggestion>", ...]
      },
      "bestPractices": {
        "score": <number 0-100>,
        "issues": ["<string issue>", ...],
        "suggestions": ["<string suggestion>", ...]
      }
    }
    
    Do not include any markdown formatting like \`\`\`json outside the object. Return only the raw JSON.
  `;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    // Strip markdown code blocks if the model accidentally includes them
    if (text.startsWith('\`\`\`json')) text = text.substring(7);
    else if (text.startsWith('\`\`\`')) text = text.substring(3);
    if (text.endsWith('\`\`\`')) text = text.substring(0, text.length - 3);
    
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Gemini Code Analysis Error:", error);
    throw new Error("Failed to analyze code. Please try again.");
  }
};

/**
 * Gets a helpful hint without giving away the direct answer.
 */
export const getHint = async (code, problemDescription) => {
  if (!apiKey) throw new Error("Gemini API Key is missing.");

  const prompt = `
    You are an AI coding tutor. The user is trying to solve the following problem:
    
    Problem:
    ${problemDescription}
    
    User's Current Code:
    \`\`\`
    ${code}
    \`\`\`
    
    Provide a brief, encouraging hint to help them get unstuck. DO NOT provide the complete solution. Point out any syntax errors or logic flaws. Keep it under 4 sentences.
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Gemini Hint Error:", error);
    throw new Error("Failed to get hint from AI.");
  }
};

/**
 * Analyzes spoken transcript for interview evaluation.
 */
export const analyzeSpeech = async (transcript) => {
  if (!apiKey) throw new Error("Gemini API Key is missing.");

  const prompt = `
    You are an expert HR and Technical Interviewer assessing a candidate's spoken answer.
    
    Transcript:
    "${transcript}"
    
    Evaluate the candidate on a scale of 0-100 for the following 4 categories:
    1. grammar (Grammar and Vocabulary)
    2. fluency (Flow and absence of filler words)
    3. clarity (Structure and coherency)
    4. tech (Technical accuracy and use of relevant terms)
    
    Also provide 2-3 actionable tips based on their specific transcript.
    
    Respond STRICTLY with a valid JSON object matching this exact structure:
    {
      "scores": {
        "grammar": <number 0-100>,
        "fluency": <number 0-100>,
        "clarity": <number 0-100>,
        "tech": <number 0-100>
      },
      "tips": [
        {
          "title": "<string brief title>",
          "color": "<string hex color e.g. #10b981 or #ef4444 or #f59e0b>",
          "desc": "<string 1-2 sentence tip>"
        }
      ]
    }
    
    Do not include markdown blocks. Only output raw JSON.
  `;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    if (text.startsWith('\`\`\`json')) text = text.substring(7);
    else if (text.startsWith('\`\`\`')) text = text.substring(3);
    if (text.endsWith('\`\`\`')) text = text.substring(0, text.length - 3);
    
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Gemini Speech Analysis Error:", error);
    throw new Error("Failed to analyze speech.");
  }
};

/**
 * Analyzes an HR interview Q&A transcript.
 */
export const analyzeHrInterview = async (qaArray) => {
  if (!apiKey) throw new Error("Gemini API Key is missing.");

  const formattedQA = qaArray.map((qa, i) => `Q${i + 1}: ${qa.q}\nA: ${qa.a}`).join("\n\n");

  const prompt = `
    You are a Senior HR Manager evaluating a candidate based on the following interview transcript.
    
    Transcript:
    ${formattedQA}
    
    Evaluate the candidate on a scale of 0-100 for the following categories:
    1. commSkill (Communication and articulation)
    2. leadership (Leadership, accountability, and handling pressure)
    3. techAlign (Alignment with technical role requirements and logical reasoning)
    
    Provide an overall feedback paragraph (summary) and an array of 2-3 specific improvements.
    
    Respond STRICTLY with a valid JSON object matching this exact structure:
    {
      "scores": {
        "commSkill": <number 0-100>,
        "leadership": <number 0-100>,
        "techAlign": <number 0-100>
      },
      "feedback": "<string summary paragraph>",
      "improvements": [
        "<string improvement tip 1>",
        "<string improvement tip 2>"
      ]
    }
    
    Do not include markdown blocks. Only output raw JSON.
  `;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    if (text.startsWith('\`\`\`json')) text = text.substring(7);
    else if (text.startsWith('\`\`\`')) text = text.substring(3);
    if (text.endsWith('\`\`\`')) text = text.substring(0, text.length - 3);
    
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Gemini HR Analysis Error:", error);
    throw new Error("Failed to analyze HR interview.");
  }
};

/**
 * Analyzes a system design architecture layout.
 */
export const analyzeSystemDesign = async (nodes, connections) => {
  if (!apiKey) throw new Error("Gemini API Key is missing.");

  // Build a textual representation of the graph
  const nodeMap = {};
  nodes.forEach((n, idx) => {
    nodeMap[n.id] = `${n.type} (Node ${idx + 1})`;
  });

  const edgeDescriptions = connections.map(c => {
    const fromName = nodeMap[c.from] || "Unknown Node";
    const toName = nodeMap[c.to] || "Unknown Node";
    return `${fromName} connects to ${toName}`;
  });

  const graphDescription = `
    Nodes Present:
    ${Object.values(nodeMap).join(', ')}
    
    Connections:
    ${edgeDescriptions.length > 0 ? edgeDescriptions.join('\n') : "No connections made."}
  `;

  const prompt = `
    You are a Principal Staff Software Engineer evaluating a candidate's System Design architecture.
    
    Here is the architecture layout:
    ${graphDescription}
    
    Evaluate the architecture for scalability, reliability, single points of failure (SPOFs), and best practices.
    Provide a list of 3 to 5 feedback points. Each point MUST have a "type" which is exactly one of: "success", "warning", or "error".
    
    Respond STRICTLY with a valid JSON array of objects matching this exact structure:
    [
      { "type": "success", "text": "Good job using a Load Balancer to distribute traffic." },
      { "type": "error", "text": "Your Database has no backups or replication, making it a SPOF." }
    ]
    
    Do not include markdown blocks. Only output raw JSON array.
  `;

  try {
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    if (text.startsWith('\`\`\`json')) text = text.substring(7);
    else if (text.startsWith('\`\`\`')) text = text.substring(3);
    if (text.endsWith('\`\`\`')) text = text.substring(0, text.length - 3);
    
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Gemini System Design Analysis Error:", error);
    throw new Error("Failed to analyze system design.");
  }
};

/**
 * Analyzes a resume using inline PDF data.
 */
export const analyzeResume = async (base64Pdf) => {
  if (!apiKey) throw new Error("Gemini API Key is missing.");

  const prompt = `
    You are a brutal, hilarious tech recruiter known for roasting resumes, but you also give solid advice.
    Read the provided PDF resume.
    
    Calculate the following scores (0-100):
    - score (Overall Survival Score)
    - atsScore (ATS Compatibility)
    - impactScore (Impact & Metrics)
    - readabilityScore (Readability & Formatting)
    
    Generate 3-4 funny "roasts" based on what is ACTUALLY in the resume. 
    Then, provide arrays of practical suggestions under "add", "remove", and "rewrite".
    
    Return ONLY a valid JSON object matching this structure exactly:
    {
      "score": 42,
      "atsScore": 35,
      "impactScore": 40,
      "readabilityScore": 50,
      "roasts": ["roast 1", "roast 2", "roast 3"],
      "suggestions": {
        "add": ["suggestion to add"],
        "remove": ["suggestion to remove"],
        "rewrite": ["suggestion to rewrite"]
      }
    }
  `;

  const pdfPart = {
    inlineData: {
      data: base64Pdf,
      mimeType: "application/pdf"
    }
  };

  try {
    const result = await model.generateContent([prompt, pdfPart]);
    let text = result.response.text().trim();
    if (text.startsWith('\`\`\`json')) text = text.substring(7);
    else if (text.startsWith('\`\`\`')) text = text.substring(3);
    if (text.endsWith('\`\`\`')) text = text.substring(0, text.length - 3);
    
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Gemini Resume Roast Error:", error);
    throw new Error("Failed to analyze resume.");
  }
};

/**
 * Summarizes voice notes into a markdown study guide.
 */
export const summarizeNotes = async (transcript) => {
  if (!apiKey) throw new Error("Gemini API Key is missing.");

  const prompt = `
    You are an expert tutor and note-taking assistant. I am speaking my raw thoughts on a topic.
    Turn my spoken notes into a clean, structured study guide formatted in Markdown.
    
    My notes:
    "${transcript}"
    
    Use headings (##), bullet points, bold text for key terms, and add a short "Summary" section at the end.
    Make it easy to read and highly educational.
    Do not return JSON, just return raw Markdown text.
  `;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error("Gemini Note Summarization Error:", error);
    throw new Error("Failed to summarize notes.");
  }
};
