package com.rafia.prepgenie.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class ResumeService {

    private final AiService aiService;

    public ResumeService(AiService aiService) {
        this.aiService = aiService;
    }

    public String analyzeResume(MultipartFile file) throws IOException {
        String pdfText = extractTextFromPdf(file);
        
        String prompt = "You are an expert ATS (Applicant Tracking System) and technical recruiter. " +
                "Please analyze the following resume text and provide feedback. " +
                "Return the result STRICTLY as a JSON object with the following structure, with NO Markdown wrappers like ```json and NO extra text:\n" +
                "{\n" +
                "  \"score\": <a number between 0 and 100>,\n" +
                "  \"strengths\": [\"strength 1\", \"strength 2\"],\n" +
                "  \"weaknesses\": [\"weakness 1\", \"weakness 2\"],\n" +
                "  \"missingKeywords\": [\"keyword 1\", \"keyword 2\"],\n" +
                "  \"summary\": \"Brief summary of the resume\"\n" +
                "}\n\n" +
                "Resume Text:\n" + pdfText;

        String response = aiService.generateResponse(prompt);
        // Remove markdown formatting if the AI still includes it
        if (response.startsWith("```json")) {
            response = response.substring(7);
        }
        if (response.startsWith("```")) {
            response = response.substring(3);
        }
        if (response.endsWith("```")) {
            response = response.substring(0, response.length() - 3);
        }
        return response.trim();
    }

    private String extractTextFromPdf(MultipartFile file) throws IOException {
        try (PDDocument document = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }
}
