package com.gurushankar.aicoursereview.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecentReviewResponse {

    private String username;

    private String courseName;

    private Integer rating;

    private String reviewText;

}