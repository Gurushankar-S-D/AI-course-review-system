package com.gurushankar.aicoursereview.controller;

import com.gurushankar.aicoursereview.dto.dashboard.DashboardResponse;
import com.gurushankar.aicoursereview.dto.dashboard.RecentReviewResponse;
import com.gurushankar.aicoursereview.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    public DashboardResponse getDashboard() {
        return dashboardService.getDashboard();
    }
    @GetMapping("/recent-reviews")
    public List<RecentReviewResponse> getRecentReviews() {

        return dashboardService.getRecentReviews();

    }

}