package com.gurushankar.aicoursereview.service;

import com.gurushankar.aicoursereview.dto.ReviewRequest;
import com.gurushankar.aicoursereview.dto.ReviewResponse;
import com.gurushankar.aicoursereview.entity.Course;
import com.gurushankar.aicoursereview.entity.Review;
import com.gurushankar.aicoursereview.entity.User;
import com.gurushankar.aicoursereview.repository.CourseRepository;
import com.gurushankar.aicoursereview.repository.ReviewRepository;
import com.gurushankar.aicoursereview.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

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