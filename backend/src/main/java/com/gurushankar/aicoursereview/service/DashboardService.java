package com.gurushankar.aicoursereview.service;

import com.gurushankar.aicoursereview.dto.dashboard.DashboardResponse;
import com.gurushankar.aicoursereview.dto.dashboard.RecentReviewResponse;

import java.util.List;

public interface DashboardService {

    DashboardResponse getDashboard();
    List<RecentReviewResponse> getRecentReviews();

}