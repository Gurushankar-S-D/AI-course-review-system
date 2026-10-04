package com.gurushankar.aicoursereview.service.impl;

import com.gurushankar.aicoursereview.dto.CourseRequest;
import com.gurushankar.aicoursereview.dto.CourseResponse;
import com.gurushankar.aicoursereview.dto.CourseSummaryResponse;
import com.gurushankar.aicoursereview.entity.Course;
import com.gurushankar.aicoursereview.entity.Review;
import com.gurushankar.aicoursereview.repository.CourseRepository;
import com.gurushankar.aicoursereview.repository.ReviewAnalysisRepository;
import com.gurushankar.aicoursereview.repository.ReviewRepository;
import com.gurushankar.aicoursereview.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final ReviewRepository reviewRepository;
    private final ReviewAnalysisRepository reviewAnalysisRepository;


    // =========================
    // ADD COURSE
    // =========================

    @Override
    public CourseResponse addCourse(CourseRequest courseRequest) {

        Course course = Course.builder()
                .courseName(courseRequest.getCourseName())
                .description(courseRequest.getDescription())
                .build();

        Course savedCourse = courseRepository.save(course);

        return mapToResponse(savedCourse);
    }


    // =========================
    // GET ALL COURSES
    // =========================

    @Override
    public List<CourseResponse> getAllCourses() {

        return courseRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    // =========================
    // GET COURSE BY ID
    // =========================

    @Override
    public CourseResponse getCourseById(Long courseId) {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Course not found with ID: " + courseId
                        )
                );

        return mapToResponse(course);
    }


    // =========================
    // UPDATE COURSE
    // =========================

    @Override
    public CourseResponse updateCourse(
            Long courseId,
            CourseRequest courseRequest
    ) {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Course not found with ID: " + courseId
                        )
                );

        course.setCourseName(courseRequest.getCourseName());
        course.setDescription(courseRequest.getDescription());

        Course updatedCourse =
                courseRepository.save(course);

        return mapToResponse(updatedCourse);
    }


    // =========================
    // DELETE COURSE
    // =========================

    @Override
    @Transactional
    public void deleteCourse(Long courseId) {

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Course not found with ID: " + courseId
                        )
                );

        /*
         * A course can have multiple reviews.
         *
         * A review can also have a ReviewAnalysis record.
         *
         * Therefore the deletion order must be:
         *
         * ReviewAnalysis
         *       ↓
         * Review
         *       ↓
         * Course
         */

        List<Review> reviews =
                reviewRepository.findByCourse(course);

        for (Review review : reviews) {

            // Delete AI analysis belonging to this review
            reviewAnalysisRepository
                    .findByReviewReviewId(review.getReviewId())
                    .ifPresent(reviewAnalysis ->
                            reviewAnalysisRepository
                                    .delete(reviewAnalysis)
                    );

            // Delete the review
            reviewRepository.delete(review);
        }

        // Finally delete the course
        courseRepository.delete(course);
    }


    // =========================
    // COURSE SUMMARY
    // =========================

    @Override
    public List<CourseSummaryResponse> getCourseSummary() {

        List<CourseSummaryResponse> summaries =
                new ArrayList<>();

        for (Course course : courseRepository.findAll()) {

            List<Review> reviews =
                    reviewRepository.findByCourse(course);

            double averageRating =
                    reviews.stream()
                            .mapToInt(Review::getRating)
                            .average()
                            .orElse(0.0);

            summaries.add(
                    CourseSummaryResponse.builder()
                            .courseId(course.getCourseId())
                            .courseName(course.getCourseName())
                            .description(course.getDescription())
                            .averageRating(
                                    Math.round(
                                            averageRating * 10.0
                                    ) / 10.0
                            )
                            .totalReviews(
                                    (long) reviews.size()
                            )
                            .build()
            );
        }

        return summaries;
    }


    // =========================
    // RESPONSE MAPPER
    // =========================

    private CourseResponse mapToResponse(
            Course course
    ) {

        return CourseResponse.builder()
                .courseId(course.getCourseId())
                .courseName(course.getCourseName())
                .description(course.getDescription())
                .build();
    }
}