package com.rafia.prepgenie.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "daily_progress")
public class DailyProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private LocalDate date;

    private boolean quizCompleted = false;
    private boolean resumeCompleted = false;
    private boolean chatCompleted = false;

    private boolean quizClaimed = false;
    private boolean resumeClaimed = false;
    private boolean chatClaimed = false;

    private int streak = 0;

    @Version
    private Long version; // Optimistic locking

    public DailyProgress() {}

    public DailyProgress(User user, LocalDate date) {
        this.user = user;
        this.date = date;
    }

    public Long getId() { return id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public boolean isQuizCompleted() { return quizCompleted; }
    public void setQuizCompleted(boolean quizCompleted) { this.quizCompleted = quizCompleted; }

    public boolean isResumeCompleted() { return resumeCompleted; }
    public void setResumeCompleted(boolean resumeCompleted) { this.resumeCompleted = resumeCompleted; }

    public boolean isChatCompleted() { return chatCompleted; }
    public void setChatCompleted(boolean chatCompleted) { this.chatCompleted = chatCompleted; }

    public boolean isQuizClaimed() { return quizClaimed; }
    public void setQuizClaimed(boolean quizClaimed) { this.quizClaimed = quizClaimed; }

    public boolean isResumeClaimed() { return resumeClaimed; }
    public void setResumeClaimed(boolean resumeClaimed) { this.resumeClaimed = resumeClaimed; }

    public boolean isChatClaimed() { return chatClaimed; }
    public void setChatClaimed(boolean chatClaimed) { this.chatClaimed = chatClaimed; }

    public int getStreak() { return streak; }
    public void setStreak(int streak) { this.streak = streak; }

    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }
}
