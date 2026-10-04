package com.gurushankar.aicoursereview.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RatingDistributionResponse {
    private int rating;
    private long count;
}
