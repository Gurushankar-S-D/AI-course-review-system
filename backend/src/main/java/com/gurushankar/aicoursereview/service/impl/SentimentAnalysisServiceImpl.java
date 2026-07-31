package com.gurushankar.aicoursereview.service.impl;

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

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    @Override
    public GeminiAnalysisResponse analyzeReview(String reviewText) {

        String prompt = """
            Analyze the following course review.

            Return ONLY valid JSON.

            {
              "sentiment":"Positive",
              "summary":"Short summary",
              "keywords":"Java, Practical, Instructor"
            }

            Review:
            """ + reviewText;

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

            String response = restClient.post()
                    .uri(apiUrl + "?key=" + apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(request)
                    .retrieve()
                    .body(String.class);

            System.out.println("========== RAW GEMINI RESPONSE ==========");
            System.out.println(response);
            System.out.println("=========================================");

            GeminiResponse geminiResponse =
                    objectMapper.readValue(response, GeminiResponse.class);

            String aiText =
                    geminiResponse.getCandidates()
                            .get(0)
                            .getContent()
                            .getParts()
                            .get(0)
                            .getText();

            return objectMapper.readValue(aiText, GeminiAnalysisResponse.class);

        } catch (Exception e) {

            e.printStackTrace();

            return new GeminiAnalysisResponse(
                    "UNKNOWN",
                    "Analysis Failed",
                    "None"
            );
        }
    }
}