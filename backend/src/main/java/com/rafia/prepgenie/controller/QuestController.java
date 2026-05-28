package com.rafia.prepgenie.controller;

import com.rafia.prepgenie.entity.DailyProgress;
import com.rafia.prepgenie.entity.User;
import com.rafia.prepgenie.repository.UserRepository;
import com.rafia.prepgenie.service.QuestService;
import com.rafia.prepgenie.service.ModuleCompletedEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/quests")
public class QuestController {

    private final QuestService questService;
    private final UserRepository userRepository;
    private final ApplicationEventPublisher eventPublisher;

    public QuestController(QuestService questService, UserRepository userRepository, ApplicationEventPublisher eventPublisher) {
        this.questService = questService;
        this.userRepository = userRepository;
        this.eventPublisher = eventPublisher;
    }

    private User getAuthenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getQuestStatus() {
        User user = getAuthenticatedUser();
        DailyProgress progress = questService.getTodayProgress(user);

        Map<String, Object> response = new HashMap<>();
        response.put("quizCompleted", progress.isQuizCompleted());
        response.put("resumeCompleted", progress.isResumeCompleted());
        response.put("chatCompleted", progress.isChatCompleted());
        
        response.put("quizClaimed", progress.isQuizClaimed());
        response.put("resumeClaimed", progress.isResumeClaimed());
        response.put("chatClaimed", progress.isChatClaimed());

        response.put("streak", progress.getStreak());
        response.put("totalGems", user.getScore());
        response.put("studyTimeMinutes", user.getStudyTimeMinutes());
        response.put("usedModulesCount", user.getUsedModules().size());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/complete/{type}")
    public ResponseEntity<Map<String, Object>> completeQuest(@PathVariable String type) {
        User user = getAuthenticatedUser();
        eventPublisher.publishEvent(new ModuleCompletedEvent(this, user, type.toUpperCase()));
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/claim/{type}")
    public ResponseEntity<Map<String, Object>> claimQuestReward(@PathVariable String type) {
        User user = getAuthenticatedUser();
        DailyProgress progress = questService.claimReward(user, type);
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("totalGems", user.getScore());
        response.put("streak", progress.getStreak());

        return ResponseEntity.ok(response);
    }
}
