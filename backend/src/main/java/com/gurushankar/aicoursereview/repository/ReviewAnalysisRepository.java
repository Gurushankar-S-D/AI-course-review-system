package com.gurushankar.aicoursereview.repository;

import com.gurushankar.aicoursereview.entity.Review;
import com.gurushankar.aicoursereview.entity.ReviewAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReviewAnalysisRepository extends JpaRepository<ReviewAnalysis, Long> {

    Optional<ReviewAnalysis> findByReview(Review review);

    Optional<ReviewAnalysis> findByReviewReviewId(Long reviewId);

}