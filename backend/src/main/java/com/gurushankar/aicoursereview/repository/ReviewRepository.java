package com.gurushankar.aicoursereview.repository;

import com.gurushankar.aicoursereview.entity.Course;
import com.gurushankar.aicoursereview.entity.Review;
import com.gurushankar.aicoursereview.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByUser(User user);

    List<Review> findByCourse(Course course);

    @Query("""
SELECT COALESCE(AVG(r.rating),0)
FROM Review r
""")
    Double getAverageRating();

    List<Review> findAllByOrderByCreatedAtDesc(Pageable pageable);
}