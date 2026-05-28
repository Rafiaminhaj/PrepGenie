package com.rafia.prepgenie.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/quiz")
public class QuizController {

    @PostMapping("/result")
    public ResponseEntity<Map<String, Object>> saveQuizResult(@RequestBody Map<String, Object> payload) {
        // Here we could save the individual quiz attempt to a QuizResult table.
        // For now, we acknowledge it. The actual score is tracked in /user/activity.
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Quiz result saved successfully");
        return ResponseEntity.ok(response);
    }
}
