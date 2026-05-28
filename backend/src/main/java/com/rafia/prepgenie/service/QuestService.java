package com.rafia.prepgenie.service;

import com.rafia.prepgenie.entity.DailyProgress;
import com.rafia.prepgenie.entity.User;
import com.rafia.prepgenie.repository.DailyProgressRepository;
import com.rafia.prepgenie.repository.UserRepository;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;

@Service
public class QuestService {

    private final DailyProgressRepository progressRepository;
    private final UserRepository userRepository;

    public QuestService(DailyProgressRepository progressRepository, UserRepository userRepository) {
        this.progressRepository = progressRepository;
        this.userRepository = userRepository;
    }

    public DailyProgress getTodayProgress(User user) {
        LocalDate today = LocalDate.now();
        return progressRepository.findByUserAndDate(user, today).orElseGet(() -> {
            DailyProgress newProgress = new DailyProgress(user, today);
            
            // Calculate streak
            Optional<DailyProgress> lastProgressOpt = progressRepository.findTopByUserOrderByDateDesc(user);
            if (lastProgressOpt.isPresent()) {
                DailyProgress lastProgress = lastProgressOpt.get();
                if (lastProgress.getDate().equals(today.minusDays(1))) {
                    newProgress.setStreak(lastProgress.getStreak() + 1);
                } else if (!lastProgress.getDate().equals(today)) {
                    newProgress.setStreak(0); // Streak broken
                } else {
                    newProgress.setStreak(lastProgress.getStreak());
                }
            } else {
                newProgress.setStreak(1); // First day
            }
            return progressRepository.save(newProgress);
        });
    }

    @Async
    @EventListener
    @Transactional
    public void handleModuleCompletedEvent(ModuleCompletedEvent event) {
        User user = event.getUser();
        DailyProgress progress = getTodayProgress(user);

        switch (event.getModuleType()) {
            case "QUIZ":
                if (!progress.isQuizCompleted()) progress.setQuizCompleted(true);
                break;
            case "RESUME":
                if (!progress.isResumeCompleted()) progress.setResumeCompleted(true);
                break;
            case "CHAT":
                if (!progress.isChatCompleted()) progress.setChatCompleted(true);
                break;
        }
        progressRepository.save(progress);

        user.getUsedModules().add(event.getModuleType());
        userRepository.save(user);
    }

    @Transactional
    public DailyProgress claimReward(User user, String type) {
        DailyProgress progress = getTodayProgress(user);
        boolean claimed = false;

        if ("QUIZ".equalsIgnoreCase(type) && progress.isQuizCompleted() && !progress.isQuizClaimed()) {
            progress.setQuizClaimed(true);
            claimed = true;
        } else if ("RESUME".equalsIgnoreCase(type) && progress.isResumeCompleted() && !progress.isResumeClaimed()) {
            progress.setResumeClaimed(true);
            claimed = true;
        } else if ("CHAT".equalsIgnoreCase(type) && progress.isChatCompleted() && !progress.isChatClaimed()) {
            progress.setChatClaimed(true);
            claimed = true;
        }

        if (claimed) {
            user.setScore(user.getScore() + 50); // Add Gems
            userRepository.save(user);
            return progressRepository.save(progress);
        }
        
        return progress;
    }
}
