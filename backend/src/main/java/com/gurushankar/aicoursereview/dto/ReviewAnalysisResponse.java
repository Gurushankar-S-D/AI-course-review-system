package com.gurushankar.aicoursereview.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewAnalysisResponse {

    private Long analysisId;

    private Long reviewId;

    private String sentiment;

    private String summary;

    private String keywords;

    private LocalDateTime analyzedAt;
}