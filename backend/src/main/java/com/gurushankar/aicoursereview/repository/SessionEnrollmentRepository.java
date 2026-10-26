package com.gurushankar.aicoursereview.repository;

import com.gurushankar.aicoursereview.entity.EnrollmentStatus;
import com.gurushankar.aicoursereview.entity.SessionEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionEnrollmentRepository
        extends JpaRepository<SessionEnrollment, Long> {

    long countBySession_SessionIdAndStatus(
            Long sessionId,
            EnrollmentStatus status
    );

    boolean existsBySession_SessionIdAndStudent_UserId(
            Long sessionId,
            Long studentId
    );

    boolean existsBySession_SessionIdAndStudent_UserIdAndStatus(
            Long sessionId,
            Long studentId,
            EnrollmentStatus status
    );

    List<SessionEnrollment> findAllByStatusOrderByEnrolledAtAsc(
            EnrollmentStatus status
    );

    List<SessionEnrollment> findAllByStudent_UsernameOrderByEnrolledAtDesc(
            String username
    );

    void deleteBySession_SessionIdAndStudent_UserId(
            Long sessionId,
            Long studentId
    );
}