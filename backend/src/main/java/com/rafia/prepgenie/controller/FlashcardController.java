package com.rafia.prepgenie.controller;

import com.rafia.prepgenie.model.Deck;
import com.rafia.prepgenie.model.Flashcard;
import com.rafia.prepgenie.service.FlashcardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/flashcards")
@CrossOrigin(origins = "*")
public class FlashcardController {

    private final FlashcardService flashcardService;

    public FlashcardController(FlashcardService flashcardService) {
        this.flashcardService = flashcardService;
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateDeck(@RequestBody Map<String, String> request) {
        try {
            String topic = request.get("topic");
            Deck deck = flashcardService.generateDeck(topic);
            return ResponseEntity.ok(deck);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("{\"error\": \"Failed to generate deck: " + e.getMessage() + "\"}");
        }
    }

    @GetMapping("/decks")
    public ResponseEntity<List<Deck>> getAllDecks() {
        return ResponseEntity.ok(flashcardService.getAllDecks());
    }

    @PutMapping("/cards/{id}/review")
    public ResponseEntity<?> reviewCard(@PathVariable Long id, @RequestBody Map<String, String> request) {
        try {
            String rating = request.get("rating");
            Flashcard card = flashcardService.reviewCard(id, rating);
            return ResponseEntity.ok(card);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("{\"error\": \"" + e.getMessage() + "\"}");
        }
    }
}
