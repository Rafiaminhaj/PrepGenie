package com.rafia.prepgenie.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDate;

@Entity
public class Flashcard {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 1000)
    private String question;
    
    @Column(length = 2000)
    private String answer;

    private LocalDate nextReviewDate = LocalDate.now();
    private int intervalDays = 0;
    private float easeFactor = 2.5f;

    @ManyToOne
    @JoinColumn(name = "deck_id")
    @JsonIgnore
    private Deck deck;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }
    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }
    public LocalDate getNextReviewDate() { return nextReviewDate; }
    public void setNextReviewDate(LocalDate nextReviewDate) { this.nextReviewDate = nextReviewDate; }
    public int getIntervalDays() { return intervalDays; }
    public void setIntervalDays(int intervalDays) { this.intervalDays = intervalDays; }
    public float getEaseFactor() { return easeFactor; }
    public void setEaseFactor(float easeFactor) { this.easeFactor = easeFactor; }
    public Deck getDeck() { return deck; }
    public void setDeck(Deck deck) { this.deck = deck; }
}
