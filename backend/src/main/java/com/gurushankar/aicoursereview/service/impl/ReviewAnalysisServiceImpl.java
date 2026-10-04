package com.gurushankar.aicoursereview.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.gurushankar.aicoursereview.entity.ReviewAnalysis;
import com.gurushankar.aicoursereview.exception.ResourceNotFoundException;
import com.gurushankar.aicoursereview.repository.ReviewAnalysisRepository;
import com.gurushankar.aicoursereview.service.ReviewAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.gurushankar.aicoursereview.dto.ReviewAnalysisResponse;

@Service
@RequiredArgsConstructor
public class ReviewAnalysisServiceImpl implements ReviewAnalysisService {

    private final ReviewAnalysisRepository reviewAnalysisRepository;
    private static final Logger logger =
            LoggerFactory.getLogger(
                    ReviewAnalysisServiceImpl.class
            );

    @Override
    public ReviewAnalysisResponse getReviewAnalysis(Long reviewId) {

        logger.info("Fetching AI analysis for review {}", reviewId);

        ReviewAnalysis analysis = reviewAnalysisRepository
                .findByReviewReviewId(reviewId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Review analysis not found for review id: " + reviewId
                        ));

        logger.info("AI analysis returned successfully for review {}", reviewId);

        return mapToResponse(analysis);
    }
    private ReviewAnalysisResponse mapToResponse(
            ReviewAnalysis analysis
    ) {

        return ReviewAnalysisResponse.builder()

                .analysisId(analysis.getAnalysisId())

                .reviewId(analysis.getReview().getReviewId())

                .sentiment(analysis.getSentiment())

                .summary(analysis.getSummary())

                .keywords(analysis.getKeywords())

                .analyzedAt(analysis.getAnalyzedAt())

                .build();

    }
}