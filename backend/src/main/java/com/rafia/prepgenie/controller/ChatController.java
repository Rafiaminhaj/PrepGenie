package com.rafia.prepgenie.controller;

import com.rafia.prepgenie.dto.ChatRequest;
import com.rafia.prepgenie.dto.ChatResponse;
import com.rafia.prepgenie.service.AiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
public class ChatController {

    private final AiService aiService;
    
    // System prompt gives the AI its persona
    private final String SYSTEM_PROMPT = "You are PrepGenie, an expert Software Engineering Tutor and Interviewer. Keep your answers concise, engaging, and highly technical yet easy to understand. Format with Markdown where helpful. The user says: ";

    public ChatController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/message")
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        String fullPrompt = SYSTEM_PROMPT + request.getMessage();
        String aiResponse = aiService.generateResponse(fullPrompt);
        return ResponseEntity.ok(new ChatResponse(aiResponse));
    }
}
