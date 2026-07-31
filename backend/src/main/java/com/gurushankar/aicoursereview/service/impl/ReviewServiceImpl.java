package com.gurushankar.aicoursereview.service.impl;

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

    @Override
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
        System.out.println("STEP 1 - Review saved successfully");
        System.out.println("Review ID : " + savedReview.getReviewId());
        System.out.println("======================================");

        try {

            System.out.println("STEP 2 - Calling Gemini API");

            GeminiAnalysisResponse aiResponse =
                    sentimentAnalysisService.analyzeReview(savedReview.getReviewText());

            System.out.println("STEP 3 - Gemini Response Received");
            System.out.println("Sentiment : " + aiResponse.getSentiment());
            System.out.println("Summary   : " + aiResponse.getSummary());
            System.out.println("Keywords  : " + aiResponse.getKeywords());

            ReviewAnalysis reviewAnalysis = ReviewAnalysis.builder()
                    .review(savedReview)
                    .sentiment(aiResponse.getSentiment())
                    .summary(aiResponse.getSummary())
                    .keywords(aiResponse.getKeywords())
                    .build();

            reviewAnalysisRepository.save(reviewAnalysis);

            System.out.println("STEP 4 - ReviewAnalysis saved successfully");

        } catch (Exception e) {

            System.out.println("======================================");
            System.out.println("GEMINI ERROR");
            e.printStackTrace();
            System.out.println("======================================");
        }

        return mapToResponse(savedReview);
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
    public void deleteReview(Long reviewId) {

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() ->
                        new RuntimeException("Review not found"));

        reviewRepository.delete(review);
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