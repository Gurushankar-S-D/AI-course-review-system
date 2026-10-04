package com.gurushankar.aicoursereview.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CourseRatingResponse {
    private Long courseId;
    private String courseName;
    private String description;
    private double averageRating;
    private long reviewCount;
}
