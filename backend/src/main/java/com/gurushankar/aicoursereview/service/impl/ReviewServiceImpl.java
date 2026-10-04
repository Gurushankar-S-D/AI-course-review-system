package com.gurushankar.aicoursereview.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;
import com.gurushankar.aicoursereview.dto.ReviewRequest;
import com.gurushankar.aicoursereview.dto.ReviewResponse;
import com.gurushankar.aicoursereview.entity.Course;
import com.gurushankar.aicoursereview.entity.Review;
import com.gurushankar.aicoursereview.entity.User;
import com.gurushankar.aicoursereview.repository.CourseRepository;
import com.gurushankar.aicoursereview.repository.ReviewRepository;
import com.gurushankar.aicoursereview.repository.UserRepository;
import com.gurushankar.aicoursereview.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.gurushankar.aicoursereview.dto.gemini.GeminiAnalysisResponse;
import com.gurushankar.aicoursereview.entity.ReviewAnalysis;
import com.gurushankar.aicoursereview.repository.ReviewAnalysisRepository;
import com.gurushankar.aicoursereview.service.SentimentAnalysisService;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final SentimentAnalysisService sentimentAnalysisService;
    private final ReviewAnalysisRepository reviewAnalysisRepository;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private static final Logger logger =
            LoggerFactory.getLogger(ReviewServiceImpl.class);

    @Override
    @Transactional
    public ReviewResponse addReview(ReviewRequest reviewRequest, String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Course course = courseRepository.findById(reviewRequest.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        Review review = Review.builder()
                .user(user)
                .course(course)
                .rating(reviewRequest.getRating())
                .reviewText(reviewRequest.getReview())
                .createdAt(LocalDateTime.now())
                .build();

        Review savedReview = reviewRepository.save(review);

        System.out.println("======================================");
        logger.info("Review {} saved successfully", savedReview.getReviewId());
        System.out.println("Review ID : " + savedReview.getReviewId());
        System.out.println("======================================");

        try {

            logger.info("Starting AI analysis for review {}",
                    savedReview.getReviewId());

            analyzeReview(savedReview);

            logger.info("AI analysis completed successfully for review {}",
                    savedReview.getReviewId());

        } catch (Exception e) {

            logger.error("AI analysis failed for review {}",
                    savedReview.getReviewId(), e);

        }

        return mapToResponse(savedReview);
    }
    private void analyzeReview(Review savedReview) {

        GeminiAnalysisResponse aiResponse =
                sentimentAnalysisService.analyzeReview(
                        savedReview.getReviewText()
                );

        ReviewAnalysis reviewAnalysis =
                ReviewAnalysis.builder()

                        .review(savedReview)

                        .sentiment(aiResponse.getSentiment())

                        .summary(aiResponse.getSummary())

                        .keywords(aiResponse.getKeywords())

                        .build();

        reviewAnalysisRepository.save(reviewAnalysis);

    }

    @Override
    public List<ReviewResponse> getAllReviews() {

        return reviewRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReviewResponse> getReviewsByCourse(Long courseId) {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        return reviewRepository.findByCourse(course)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional
    public void deleteReview(Long reviewId) {

        logger.info("Deleting review {}", reviewId);

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() ->
                        new RuntimeException("Review not found"));

        // Delete associated AI analysis first.
        reviewAnalysisRepository
                .findByReviewReviewId(reviewId)
                .ifPresent(reviewAnalysis -> {
                    logger.info(
                            "Deleting AI analysis {} for review {}",
                            reviewAnalysis.getAnalysisId(),
                            reviewId
                    );

                    reviewAnalysisRepository.delete(reviewAnalysis);
                });

        // Now safely delete the review.
        reviewRepository.delete(review);

        logger.info("Review {} deleted successfully", reviewId);
    }

    private ReviewResponse mapToResponse(Review review) {

        return ReviewResponse.builder()
                .reviewId(review.getReviewId())
                .username(review.getUser().getUsername())
                .courseId(review.getCourse().getCourseId())
                .courseName(review.getCourse().getCourseName())
                .rating(review.getRating())
                .review(review.getReviewText())
                .createdAt(review.getCreatedAt())
                .build();
    }
}