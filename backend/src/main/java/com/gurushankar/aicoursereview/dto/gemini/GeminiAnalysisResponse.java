package com.gurushankar.aicoursereview.dto.gemini;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GeminiAnalysisResponse {

    private String sentiment;

    private String summary;

    private String keywords;

}