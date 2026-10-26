package com.gurushankar.aicoursereview.service;

import com.gurushankar.aicoursereview.entity.AttendanceSession;
import com.gurushankar.aicoursereview.entity.EnrollmentStatus;
import com.gurushankar.aicoursereview.entity.SessionEnrollment;
import com.gurushankar.aicoursereview.entity.User;
import com.gurushankar.aicoursereview.repository.AttendanceSessionRepository;
import com.gurushankar.aicoursereview.repository.SessionEnrollmentRepository;
import com.gurushankar.aicoursereview.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SessionEnrollmentService {

    private final AttendanceSessionRepository sessionRepository;
    private final SessionEnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;

    public SessionEnrollmentService(
            AttendanceSessionRepository sessionRepository,
            SessionEnrollmentRepository enrollmentRepository,
            UserRepository userRepository) {
        this.sessionRepository = sessionRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public SessionEnrollment enrollStudent(Long sessionId, Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() ->
                        new IllegalArgumentException("Student not found"));

        return createEnrollment(
                sessionId,
                student,
                EnrollmentStatus.APPROVED
        );
    }

    @Transactional
    public SessionEnrollment requestEnrollment(
            Long sessionId,
            String username) {

        User student = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new IllegalArgumentException("Student account not found"));

        return createEnrollment(
                sessionId,
                student,
                EnrollmentStatus.PENDING
        );
    }

    @Transactional
    public SessionEnrollment updateStatus(
            Long enrollmentId,
            EnrollmentStatus status) {

        SessionEnrollment enrollment = enrollmentRepository
                .findById(enrollmentId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Enrollment request not found"));

        if (enrollment.getStatus() != EnrollmentStatus.PENDING) {
            throw new IllegalArgumentException(
                    "Only pending enrollment requests can be updated");
        }

        enrollment.setStatus(status);

        return enrollment;
    }

    @Transactional(readOnly = true)
    public List<SessionEnrollment> getPendingRequests() {
        return enrollmentRepository
                .findAllByStatusOrderByEnrolledAtAsc(
                        EnrollmentStatus.PENDING);
    }

    @Transactional(readOnly = true)
    public List<SessionEnrollment> getMyEnrollments(
            String username) {

        return enrollmentRepository
                .findAllByStudent_UsernameOrderByEnrolledAtDesc(username);
    }

    private SessionEnrollment createEnrollment(
            Long sessionId,
            User student,
            EnrollmentStatus status) {

        AttendanceSession session = sessionRepository
                .findById(sessionId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Attendance session not found"));

        if (!"USER".equals(student.getRole())) {
            throw new IllegalArgumentException(
                    "Only USER accounts can request enrollment");
        }

        if (enrollmentRepository
                .existsBySession_SessionIdAndStudent_UserId(
                        sessionId,
                        student.getUserId())) {
            throw new IllegalArgumentException(
                    "An enrollment request already exists for this session");
        }

        return enrollmentRepository.save(
                SessionEnrollment.builder()
                        .session(session)
                        .student(student)
                        .status(status)
                        .build()
        );
    }
}