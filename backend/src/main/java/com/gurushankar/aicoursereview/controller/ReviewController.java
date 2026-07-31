package com.gurushankar.aicoursereview.controller;

import com.gurushankar.aicoursereview.dto.ReviewRequest;
import com.gurushankar.aicoursereview.dto.ReviewResponse;
import com.gurushankar.aicoursereview.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    // Submit a review
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ReviewResponse addReview(@Valid @RequestBody ReviewRequest reviewRequest,
                                    Authentication authentication) {

        return reviewService.addReview(
                reviewRequest,
                authentication.getName()
        );
    }

    // Get all reviews
    @GetMapping
    public List<ReviewResponse> getAllReviews() {

        return reviewService.getAllReviews();
    }

    // Get reviews by course
    @GetMapping("/course/{courseId}")
    public List<ReviewResponse> getReviewsByCourse(
            @PathVariable Long courseId) {

        return reviewService.getReviewsByCourse(courseId);
    }

    // Delete review
    @DeleteMapping("/{reviewId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteReview(@PathVariable Long reviewId) {

        reviewService.deleteReview(reviewId);
    }
}