package com.rafia.prepgenie.controller;

import com.rafia.prepgenie.service.ResumeService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/resume")
@CrossOrigin(origins = "*")
public class ResumeController {

    private final ResumeService resumeService;

    public ResumeController(ResumeService resumeService) {
        this.resumeService = resumeService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<?> analyzeResume(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty() || !file.getContentType().equals("application/pdf")) {
                return ResponseEntity.badRequest().body("{\"error\": \"Please upload a valid PDF file.\"}");
            }
            
            String analysisResult = resumeService.analyzeResume(file);
            return ResponseEntity.ok(analysisResult);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("{\"error\": \"Failed to process resume: " + e.getMessage() + "\"}");
        }
    }
}
