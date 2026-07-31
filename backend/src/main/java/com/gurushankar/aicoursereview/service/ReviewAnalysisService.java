package com.gurushankar.aicoursereview.service;

import com.gurushankar.aicoursereview.entity.ReviewAnalysis;
import com.gurushankar.aicoursereview.dto.ReviewAnalysisResponse;

public interface ReviewAnalysisService {

    ReviewAnalysisResponse getReviewAnalysis(Long reviewId);

}