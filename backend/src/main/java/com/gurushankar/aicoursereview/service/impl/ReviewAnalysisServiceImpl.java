package com.gurushankar.aicoursereview.service.impl;

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

    @Override
    public ReviewAnalysisResponse getReviewAnalysis(Long reviewId) {

        ReviewAnalysis analysis = reviewAnalysisRepository
                .findByReviewReviewId(reviewId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Review analysis not found for review id: " + reviewId
                        ));

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