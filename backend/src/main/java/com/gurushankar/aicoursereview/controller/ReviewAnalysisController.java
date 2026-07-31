package com.gurushankar.aicoursereview.controller;

import com.gurushankar.aicoursereview.dto.ReviewAnalysisResponse;
import com.gurushankar.aicoursereview.service.ReviewAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewAnalysisController {

    private final ReviewAnalysisService reviewAnalysisService;

    @GetMapping("/{reviewId}/analysis")
    public ReviewAnalysisResponse getReviewAnalysis(@PathVariable Long reviewId) {
        return reviewAnalysisService.getReviewAnalysis(reviewId);
    }
}