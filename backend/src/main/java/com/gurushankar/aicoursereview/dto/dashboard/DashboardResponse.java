package com.gurushankar.aicoursereview.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardResponse {

    private long totalCourses;

    private long totalReviews;

    private double averageRating;

    private String topRatedCourse;

    private long aiAnalysedReviews;

    private List<CourseRatingResponse> topRatedCourses;

    private List<CourseRatingResponse> courseRatings;

    private List<RatingDistributionResponse> ratingDistribution;
}
