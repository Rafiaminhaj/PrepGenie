package com.rafia.prepgenie.service;

import dev.langchain4j.service.MemoryId;
import dev.langchain4j.service.SystemMessage;
import dev.langchain4j.service.UserMessage;
import dev.langchain4j.service.spring.AiService;

@AiService
public interface InterviewAiService {

    @SystemMessage({
        "You are an expert technical interviewer for a Java Backend Developer role.",
        "Your goal is to conduct a mock interview with the user.",
        "Rules:",
        "1. Ask ONE question at a time.",
        "2. Wait for the user's answer.",
        "3. Provide constructive, brief feedback on their answer.",
        "4. Then, ask the next question.",
        "5. Keep the conversation professional and engaging.",
        "6. Do not provide the answer before they attempt it."
    })
    String chat(@MemoryId String sessionId, @UserMessage String userMessage);
}
