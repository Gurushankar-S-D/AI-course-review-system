package com.gurushankar.aicoursereview.service.impl;

import lombok.RequiredArgsConstructor;
import com.gurushankar.aicoursereview.repository.ReviewRepository;
import com.gurushankar.aicoursereview.repository.CourseRepository;
import com.gurushankar.aicoursereview.dto.dashboard.DashboardResponse;
import com.gurushankar.aicoursereview.service.DashboardService;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.PageRequest;
import java.util.List;
import com.gurushankar.aicoursereview.entity.Review;
import com.gurushankar.aicoursereview.dto.dashboard.RecentReviewResponse;
import com.gurushankar.aicoursereview.dto.dashboard.CourseRatingResponse;
import com.gurushankar.aicoursereview.dto.dashboard.RatingDistributionResponse;
import com.gurushankar.aicoursereview.repository.ReviewAnalysisRepository;

import java.util.ArrayList;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {
    private final CourseRepository courseRepository;
    private final ReviewRepository reviewRepository;
    private final ReviewAnalysisRepository reviewAnalysisRepository;
    @Override
    public DashboardResponse getDashboard() {

        List<CourseRatingResponse> courseRatings = reviewRepository
                .findCourseRatingSummaries(PageRequest.of(0, 20))
                .stream()
                .map(this::toCourseRatingResponse)
                .toList();

        Map<Integer, Long> distributionByRating = reviewRepository.findRatingDistribution()
                .stream()
                .collect(Collectors.toMap(
                        row -> ((Number) row[0]).intValue(),
                        row -> ((Number) row[1]).longValue()
                ));

        List<RatingDistributionResponse> ratingDistribution = new ArrayList<>();
        for (int rating = 1; rating <= 5; rating++) {
            ratingDistribution.add(new RatingDistributionResponse(
                    rating,
                    distributionByRating.getOrDefault(rating, 0L)
            ));
        }

        String topRatedCourse = courseRatings.isEmpty()
                ? null
                : courseRatings.get(0).getCourseName();

        return new DashboardResponse(
                courseRepository.count(),
                reviewRepository.count(),
                reviewRepository.getAverageRating(),
                topRatedCourse,
                reviewAnalysisRepository.count(),
                courseRatings.stream().limit(3).toList(),
                courseRatings,
                ratingDistribution
        );

    }
    @Override
    public List<RecentReviewResponse> getRecentReviews() {

        List<Review> reviews =
                reviewRepository.findAllByOrderByCreatedAtDesc(
                        PageRequest.of(0, 5)
                );

        return reviews.stream()

                .map(review -> new RecentReviewResponse(

                        review.getUser().getUsername(),

                        review.getCourse().getCourseName(),

                        review.getRating(),

                        review.getReviewText()

                ))

                .toList();

    }

    private CourseRatingResponse toCourseRatingResponse(Object[] row) {
        return new CourseRatingResponse(
                ((Number) row[0]).longValue(),
                (String) row[1],
                (String) row[2],
                ((Number) row[3]).doubleValue(),
                ((Number) row[4]).longValue()
        );
    }
}
