package com.gurushankar.aicoursereview.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseSummaryResponse {

    private Long courseId;

    private String courseName;

    private String description;

    private Double averageRating;

    private Long totalReviews;

}