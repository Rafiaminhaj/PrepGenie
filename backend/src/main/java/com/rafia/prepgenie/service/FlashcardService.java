package com.rafia.prepgenie.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rafia.prepgenie.model.Deck;
import com.rafia.prepgenie.model.Flashcard;
import com.rafia.prepgenie.repository.DeckRepository;
import com.rafia.prepgenie.repository.FlashcardRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class FlashcardService {

    private final AiService aiService;
    private final DeckRepository deckRepository;
    private final FlashcardRepository flashcardRepository;
    private final ObjectMapper objectMapper;

    public FlashcardService(AiService aiService, DeckRepository deckRepository, FlashcardRepository flashcardRepository) {
        this.aiService = aiService;
        this.deckRepository = deckRepository;
        this.flashcardRepository = flashcardRepository;
        this.objectMapper = new ObjectMapper();
    }

    public Deck generateDeck(String topic) throws Exception {
        String prompt = "You are an expert tutor. Generate 10 flashcards for the topic: '" + topic + "'. " +
                "Return the result STRICTLY as a JSON array of objects with 'question' and 'answer' fields. " +
                "Do NOT include any markdown wrappers like ```json or any other text.\n" +
                "[\n" +
                "  {\"question\": \"...\", \"answer\": \"...\"}\n" +
                "]";

        String response = aiService.generateResponse(prompt);
        
        // Clean up response
        if (response.startsWith("```json")) response = response.substring(7);
        if (response.startsWith("```")) response = response.substring(3);
        if (response.endsWith("```")) response = response.substring(0, response.length() - 3);
        response = response.trim();

        List<Map<String, String>> cardsData = objectMapper.readValue(response, new TypeReference<List<Map<String, String>>>(){});

        Deck deck = new Deck();
        deck.setName(topic);
        String[] colors = {"#38bdf8", "#a855f7", "#ec4899", "#10b981", "#f59e0b"};
        deck.setColor(colors[(int)(Math.random() * colors.length)]);

        Deck savedDeck = deckRepository.save(deck);

        for (Map<String, String> cardData : cardsData) {
            Flashcard card = new Flashcard();
            card.setQuestion(cardData.get("question"));
            card.setAnswer(cardData.get("answer"));
            card.setDeck(savedDeck);
            flashcardRepository.save(card);
        }

        return deckRepository.findById(savedDeck.getId()).orElse(savedDeck);
    }

    public List<Deck> getAllDecks() {
        return deckRepository.findAll();
    }

    public Flashcard reviewCard(Long cardId, String rating) {
        Flashcard card = flashcardRepository.findById(cardId).orElseThrow(() -> new RuntimeException("Card not found"));
        
        int interval = card.getIntervalDays();
        float ease = card.getEaseFactor();

        int quality = 0; 
        if (rating.equalsIgnoreCase("hard")) quality = 0;
        else if (rating.equalsIgnoreCase("good")) quality = 1;
        else if (rating.equalsIgnoreCase("easy")) quality = 2;

        if (quality == 0) {
            interval = 1;
            ease -= 0.2f;
        } else if (quality == 1) {
            if (interval == 0) interval = 1;
            else if (interval == 1) interval = 3;
            else interval = (int) Math.round(interval * ease);
        } else if (quality == 2) {
            if (interval == 0) interval = 1;
            else if (interval == 1) interval = 4;
            else interval = (int) Math.round(interval * ease * 1.3);
            ease += 0.15f;
        }

        if (ease < 1.3f) ease = 1.3f;

        card.setIntervalDays(interval);
        card.setEaseFactor(ease);
        card.setNextReviewDate(LocalDate.now().plusDays(interval));

        return flashcardRepository.save(card);
    }
}
