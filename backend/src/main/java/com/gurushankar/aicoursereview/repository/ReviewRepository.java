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

    @Query("""
            SELECT r.course.courseId, r.course.courseName, r.course.description,
                   AVG(r.rating), COUNT(r)
            FROM Review r
            GROUP BY r.course.courseId, r.course.courseName, r.course.description
            ORDER BY AVG(r.rating) DESC, COUNT(r) DESC
            """)
    List<Object[]> findCourseRatingSummaries(Pageable pageable);

    @Query("""
            SELECT r.rating, COUNT(r)
            FROM Review r
            GROUP BY r.rating
            ORDER BY r.rating
            """)
    List<Object[]> findRatingDistribution();

    List<Review> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
