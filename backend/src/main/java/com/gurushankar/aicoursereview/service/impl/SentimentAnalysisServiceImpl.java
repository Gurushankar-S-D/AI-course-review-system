package com.gurushankar.aicoursereview.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gurushankar.aicoursereview.dto.gemini.GeminiAnalysisResponse;
import com.gurushankar.aicoursereview.dto.gemini.GeminiRequest;
import com.gurushankar.aicoursereview.dto.gemini.GeminiResponse;
import com.gurushankar.aicoursereview.service.SentimentAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SentimentAnalysisServiceImpl implements SentimentAnalysisService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private static final Logger logger =
            LoggerFactory.getLogger(
                    SentimentAnalysisServiceImpl.class
            );

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    @Override
    public GeminiAnalysisResponse analyzeReview(String reviewText) {

        String prompt = buildPrompt(reviewText);

        GeminiRequest request = new GeminiRequest(
                List.of(
                        new GeminiRequest.Content(
                                List.of(
                                        new GeminiRequest.Part(prompt)
                                )
                        )
                )
        );

        try {

            String response = restClient
                    .post()
                    .uri(apiUrl + "?key=" + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(String.class);

            logger.info("Raw Gemini Response : {}", response);

            GeminiResponse geminiResponse =
                    objectMapper.readValue(response, GeminiResponse.class);
            if (geminiResponse.getCandidates() == null ||
                    geminiResponse.getCandidates().isEmpty()) {

                throw new RuntimeException("Gemini returned no response.");

            }
            return parseResponse(geminiResponse);

        } catch (Exception ex) {

            logger.error("Gemini API call failed", ex);

            return GeminiAnalysisResponse.builder()
                    .sentiment("UNKNOWN")
                    .summary("Unable to analyze review.")
                    .keywords("None")
                    .build();
        }
    }
    private String buildPrompt(String reviewText) {

        return """
You are an AI assistant that analyzes student course reviews.

Analyze the following review and return ONLY valid JSON.

Requirements:

1. sentiment must be exactly one of:
Positive
Neutral
Negative

2. summary must be one sentence.

3. keywords must contain 3 to 5 comma-separated keywords.

Return ONLY this JSON:

{
  "sentiment":"Positive",
  "summary":"Students appreciated the practical examples.",
  "keywords":"Java, Spring Boot, Practical"
}

Review:
""" + reviewText;

    }
    private GeminiAnalysisResponse parseResponse(
            GeminiResponse geminiResponse
    ) throws Exception {

        String aiText = geminiResponse
                .getCandidates()
                .get(0)
                .getContent()
                .getParts()
                .get(0)
                .getText()
                .trim();

        return objectMapper.readValue(
                aiText,
                GeminiAnalysisResponse.class
        );

    }
}