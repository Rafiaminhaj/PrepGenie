package com.rafia.prepgenie.controller;

import com.rafia.prepgenie.entity.User;
import com.rafia.prepgenie.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/track-time")
    public ResponseEntity<Map<String, Object>> trackStudyTime() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        user.setStudyTimeMinutes(user.getStudyTimeMinutes() + 1);
        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("studyTimeMinutes", user.getStudyTimeMinutes());
        
        return ResponseEntity.ok(response);
    }

    @org.springframework.web.bind.annotation.GetMapping("/profile")
    public ResponseEntity<User> getProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(user);
    }

    @PostMapping("/activity")
    public ResponseEntity<Map<String, Object>> logActivity(@org.springframework.web.bind.annotation.RequestBody Map<String, Integer> payload) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        int earnedGems = payload.getOrDefault("gems", 0);
        
        user.setScore(user.getScore() + earnedGems);
        user.setTotalSessions(user.getTotalSessions() + 1);
        
        userRepository.save(user);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("score", user.getScore());
        response.put("totalSessions", user.getTotalSessions());
        
        return ResponseEntity.ok(response);
    }

    @org.springframework.web.bind.annotation.GetMapping("/leaderboard")
    public ResponseEntity<java.util.List<User>> getLeaderboard() {
        return ResponseEntity.ok(userRepository.findTop10ByOrderByScoreDesc());
    }
}
