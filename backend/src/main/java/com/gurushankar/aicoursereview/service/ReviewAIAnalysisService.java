package com.gurushankar.aicoursereview.service;

import com.gurushankar.aicoursereview.dto.gemini.GeminiAnalysisResponse;
import com.gurushankar.aicoursereview.entity.Review;
import com.gurushankar.aicoursereview.entity.ReviewAnalysis;
import com.gurushankar.aicoursereview.repository.ReviewAnalysisRepository;
import com.gurushankar.aicoursereview.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewAIAnalysisService {

    private static final Logger logger =
            LoggerFactory.getLogger(ReviewAIAnalysisService.class);

    private final SentimentAnalysisService sentimentAnalysisService;
    private final ReviewAnalysisRepository reviewAnalysisRepository;
    private final ReviewRepository reviewRepository;

    @Async
    public void analyzeReviewAsync(Long reviewId) {

        try {

            logger.info(
                    "Background AI analysis started for review {}",
                    reviewId
            );

            Review review = reviewRepository.findById(reviewId)
                    .orElseThrow(() ->
                            new RuntimeException("Review not found: " + reviewId)
                    );

            GeminiAnalysisResponse aiResponse =
                    sentimentAnalysisService.analyzeReview(
                            review.getReviewText()
                    );

            ReviewAnalysis reviewAnalysis =
                    ReviewAnalysis.builder()
                            .review(review)
                            .sentiment(aiResponse.getSentiment())
                            .summary(aiResponse.getSummary())
                            .keywords(aiResponse.getKeywords())
                            .build();

            reviewAnalysisRepository.save(reviewAnalysis);

            logger.info(
                    "Background AI analysis completed successfully for review {}",
                    reviewId
            );

        } catch (Exception e) {

            logger.error(
                    "Background AI analysis failed for review {}",
                    reviewId,
                    e
            );
        }
    }
}