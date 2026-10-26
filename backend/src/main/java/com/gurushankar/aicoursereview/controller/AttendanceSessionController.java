package com.gurushankar.aicoursereview.controller;

import com.gurushankar.aicoursereview.entity.AttendanceSession;
import com.gurushankar.aicoursereview.entity.EnrollmentStatus;
import com.gurushankar.aicoursereview.entity.SessionEnrollment;
import com.gurushankar.aicoursereview.service.AttendanceSessionService;
import com.gurushankar.aicoursereview.service.SessionEnrollmentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance/sessions")
public class AttendanceSessionController {

    private final AttendanceSessionService sessionService;
    private final SessionEnrollmentService enrollmentService;

    public AttendanceSessionController(
            AttendanceSessionService sessionService,
            SessionEnrollmentService enrollmentService) {
        this.sessionService = sessionService;
        this.enrollmentService = enrollmentService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createSession(
            @RequestBody CreateSessionRequest request,
            Authentication authentication) {

        requireAdmin(authentication);

        AttendanceSession session = sessionService.createSession(
                request.title(),
                request.courseId()
        );

        Map<String, Object> response = toSessionResponse(session);
        response.put(
                "attendanceCode",
                sessionService.getGeneratedCode(session.getSessionId())
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllSessions(
            Authentication authentication) {

        requireAdmin(authentication);

        List<Map<String, Object>> responses = new ArrayList<>();

        for (AttendanceSession session : sessionService.getAllSessions()) {
            responses.add(toSessionResponse(session));
        }

        return ResponseEntity.ok(responses);
    }

    @GetMapping("/available")
    public ResponseEntity<List<Map<String, Object>>> getAvailableSessions(
            Authentication authentication) {

        requireAuthenticated(authentication);

        return ResponseEntity.ok(
                sessionService.getAllSessions()
                        .stream()
                        .map(this::toSessionResponse)
                        .toList()
        );
    }

    @PostMapping("/{sessionId}/enrollments")
    public ResponseEntity<Map<String, Object>> enrollStudent(
            @PathVariable Long sessionId,
            @RequestBody EnrollStudentRequest request,
            Authentication authentication) {

        requireAdmin(authentication);

        if (request.studentId() == null) {
            throw new IllegalArgumentException("Student ID is required");
        }

        SessionEnrollment enrollment =
                enrollmentService.enrollStudent(
                        sessionId,
                        request.studentId()
                );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(toEnrollmentResponse(enrollment));
    }

    @PostMapping("/{sessionId}/enrollment-requests")
    public ResponseEntity<Map<String, Object>> requestEnrollment(
            @PathVariable Long sessionId,
            Authentication authentication) {

        requireAuthenticated(authentication);

        SessionEnrollment enrollment =
                enrollmentService.requestEnrollment(
                        sessionId,
                        authentication.getName()
                );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(toEnrollmentResponse(enrollment));
    }

    @GetMapping("/enrollment-requests/mine")
    public ResponseEntity<List<Map<String, Object>>> getMyRequests(
            Authentication authentication) {

        requireAuthenticated(authentication);

        return ResponseEntity.ok(
                enrollmentService.getMyEnrollments(
                                authentication.getName())
                        .stream()
                        .map(this::toEnrollmentResponse)
                        .toList()
        );
    }

    @GetMapping("/enrollment-requests")
    public ResponseEntity<List<Map<String, Object>>> getPendingRequests(
            Authentication authentication) {

        requireAdmin(authentication);

        return ResponseEntity.ok(
                enrollmentService.getPendingRequests()
                        .stream()
                        .map(this::toEnrollmentResponse)
                        .toList()
        );
    }

    @PostMapping("/enrollment-requests/{enrollmentId}/approve")
    public ResponseEntity<Map<String, Object>> approveRequest(
            @PathVariable Long enrollmentId,
            Authentication authentication) {

        requireAdmin(authentication);

        return ResponseEntity.ok(
                toEnrollmentResponse(
                        enrollmentService.updateStatus(
                                enrollmentId,
                                EnrollmentStatus.APPROVED
                        )
                )
        );
    }

    @PostMapping("/enrollment-requests/{enrollmentId}/reject")
    public ResponseEntity<Map<String, Object>> rejectRequest(
            @PathVariable Long enrollmentId,
            Authentication authentication) {

        requireAdmin(authentication);

        return ResponseEntity.ok(
                toEnrollmentResponse(
                        enrollmentService.updateStatus(
                                enrollmentId,
                                EnrollmentStatus.REJECTED
                        )
                )
        );
    }

    private Map<String, Object> toSessionResponse(
            AttendanceSession session) {

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("sessionId", session.getSessionId());
        response.put("title", session.getTitle());
        response.put(
                "courseId",
                session.getCourse() == null
                        ? null
                        : session.getCourse().getCourseId()
        );
        response.put("sessionDate", session.getSessionDate());
        response.put("activatedAt", session.getActivatedAt());
        response.put("expiresAt", session.getExpiresAt());
        response.put("createdAt", session.getCreatedAt());

        return response;
    }

    private Map<String, Object> toEnrollmentResponse(
            SessionEnrollment enrollment) {

        Map<String, Object> response = new LinkedHashMap<>();

        response.put("enrollmentId", enrollment.getEnrollmentId());
        response.put("sessionId", enrollment.getSession().getSessionId());
        response.put("sessionTitle", enrollment.getSession().getTitle());
        response.put(
                "courseName",
                enrollment.getSession().getCourse() == null
                        ? null
                        : enrollment.getSession()
                        .getCourse()
                        .getCourseName()
        );
        response.put("studentId", enrollment.getStudent().getUserId());
        response.put("username", enrollment.getStudent().getUsername());
        response.put("status", enrollment.getStatus());
        response.put("enrolledAt", enrollment.getEnrolledAt());

        return response;
    }

    private void requireAdmin(Authentication authentication) {
        if (authentication == null
                || authentication.getAuthorities().stream()
                .noneMatch(authority ->
                        "ADMIN".equals(authority.getAuthority())
                                || "ROLE_ADMIN".equals(
                                authority.getAuthority()))) {

            throw new AccessDeniedException(
                    "Admin access is required for this operation");
        }
    }

    private void requireAuthenticated(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new AccessDeniedException(
                    "Authentication is required");
        }
    }

    public record CreateSessionRequest(
            String title,
            Long courseId
    ) {}

    public record EnrollStudentRequest(Long studentId) {}
}