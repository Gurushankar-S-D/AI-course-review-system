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

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {
    private final CourseRepository courseRepository;
    private final ReviewRepository reviewRepository;
    @Override
    public DashboardResponse getDashboard() {

        return new DashboardResponse(
                courseRepository.count(),
                reviewRepository.count(),
                reviewRepository.getAverageRating(),
                "Java Programming",
                228
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
}