package com.rafia.prepgenie.controller;

import com.rafia.prepgenie.service.InterviewAiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/interview")
@CrossOrigin(origins = "*")
public class InterviewController {

    private final InterviewAiService interviewAiService;

    public InterviewController(InterviewAiService interviewAiService) {
        this.interviewAiService = interviewAiService;
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, String>> chat(@RequestBody Map<String, String> request) {
        String sessionId = request.get("sessionId");
        String message = request.get("message");

        if (sessionId == null || message == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "sessionId and message are required"));
        }

        try {
            String response = interviewAiService.chat(sessionId, message);
            return ResponseEntity.ok(Map.of("response", response));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "AI Service Error: " + e.getMessage()));
        }
    }
}
