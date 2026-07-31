package com.gurushankar.aicoursereview.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ReviewResponse {

    private Long reviewId;

    private String username;

    private Long courseId;

    private String courseName;

    private Integer rating;

    private String review;

    private LocalDateTime createdAt;
}