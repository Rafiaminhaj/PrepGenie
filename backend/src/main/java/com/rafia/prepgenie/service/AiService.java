package com.rafia.prepgenie.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AiService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final String OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

    private final RestTemplate restTemplate;

    public AiService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String generateResponse(String prompt) {
        if (geminiApiKey == null || geminiApiKey.contains("YOUR_GEMINI_API_KEY_HERE")) {
            return "Note from Backend: API key is not configured. Please add your API Key in application.properties.";
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + geminiApiKey);

            Map<String, String> message = new HashMap<>();
            message.put("role", "user");
            message.put("content", prompt);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", "google/gemini-2.5-flash");
            requestBody.put("messages", Collections.singletonList(message));
            requestBody.put("max_tokens", 1500); // Prevent 402 Insufficient Credits

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(OPENROUTER_URL, entity, Map.class);

            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");
                if (choices != null && !choices.isEmpty()) {
                    Map<String, Object> messageResp = (Map<String, Object>) choices.get(0).get("message");
                    return (String) messageResp.get("content");
                }
            }

            return "Sorry, I couldn't generate a response at this time.";

        } catch (Exception e) {
            e.printStackTrace();
            return "Error calling AI Service: " + e.getMessage();
        }
    }
}
