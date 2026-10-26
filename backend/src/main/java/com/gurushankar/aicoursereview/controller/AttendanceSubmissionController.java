
package com.gurushankar.aicoursereview.controller;

import com.gurushankar.aicoursereview.entity.AttendanceRecord;
import com.gurushankar.aicoursereview.service.AttendanceSubmissionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceSubmissionController {

    private final AttendanceSubmissionService submissionService;

    public AttendanceSubmissionController(
            AttendanceSubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    // Authenticated student submits attendance and feedback
    @PostMapping("/submit")
    public ResponseEntity<Map<String, Object>> submitAttendance(
            @RequestBody AttendanceSubmissionRequest request,
            Authentication authentication) {

        if (authentication == null
                || !authentication.isAuthenticated()) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "Authentication is required");
        }

        AttendanceRecord record =
                submissionService.submitAttendance(
                        request.attendanceCode(),
                        request.feedback(),
                        authentication.getName());

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Attendance submitted successfully");
        response.put("attendanceId", record.getAttendanceId());
        response.put("sessionId", record.getSession().getSessionId());
        response.put("sessionTitle", record.getSession().getTitle());
        response.put("studentUsername", record.getStudent().getUsername());
        response.put("feedback", record.getFeedback());
        response.put("submittedAt", record.getSubmittedAt());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Map<String, Object>>> getMyAttendance(
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "Authentication is required");
        }

        List<AttendanceRecord> records =
                submissionService.getMyAttendance(authentication.getName());

        List<Map<String, Object>> response = records.stream()
                .map(record -> {
                    Map<String, Object> item = new LinkedHashMap<>();

                    item.put("attendanceId", record.getAttendanceId());
                    item.put("sessionId", record.getSession().getSessionId());
                    item.put("sessionTitle", record.getSession().getTitle());
                    item.put("courseName",
                            record.getSession().getCourse() != null
                                    ? record.getSession().getCourse().getCourseName()
                                    : null);
                    item.put("feedback", record.getFeedback());
                    item.put("submittedAt", record.getSubmittedAt());

                    return item;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/my/summary")
    public ResponseEntity<Map<String, Object>> getMyAttendanceSummary(
            Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "Authentication is required");
        }

        Map<String, Object> summary =
                submissionService.getMyAttendanceSummary(
                        authentication.getName());

        return ResponseEntity.ok(summary);
    }

    public record AttendanceSubmissionRequest(
            String attendanceCode,
            String feedback) {
    }
}
