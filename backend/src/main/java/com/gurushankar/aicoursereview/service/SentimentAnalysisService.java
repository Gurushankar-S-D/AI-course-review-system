package com.gurushankar.aicoursereview.service;

import com.gurushankar.aicoursereview.dto.gemini.GeminiAnalysisResponse;

public interface SentimentAnalysisService {

    GeminiAnalysisResponse analyzeReview(String reviewText);

}