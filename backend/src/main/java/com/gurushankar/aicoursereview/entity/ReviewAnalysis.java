package com.gurushankar.aicoursereview.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "review_analysis")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewAnalysis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long analysisId;

    @OneToOne
    @JoinColumn(name = "review_id", nullable = false, unique = true)
    private Review review;

    @Column(nullable = false)
    private String sentiment;

    @Column(length = 1000)
    private String summary;

    @Column(length = 500)
    private String keywords;
}