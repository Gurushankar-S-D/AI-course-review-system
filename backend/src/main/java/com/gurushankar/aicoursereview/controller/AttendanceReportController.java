
package com.gurushankar.aicoursereview.controller;

import com.gurushankar.aicoursereview.service.AttendanceReportService;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance/reports")
public class AttendanceReportController {

    private final AttendanceReportService reportService;

    public AttendanceReportController(
            AttendanceReportService reportService) {
        this.reportService = reportService;
    }

    // Admin: view reports for all attendance sessions
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllReports(
            Authentication authentication) {

        requireAdmin(authentication);

        return ResponseEntity.ok(
                reportService.getAllSessionReports());
    }

    // Admin: view the report for one session
    @GetMapping("/{sessionId}")
    public ResponseEntity<Map<String, Object>> getSessionReport(
            @PathVariable Long sessionId,
            Authentication authentication) {

        requireAdmin(authentication);

        return ResponseEntity.ok(
                reportService.getSessionReport(sessionId));
    }

    @GetMapping("/students")
    public ResponseEntity<List<Map<String, Object>>> getStudentAttendanceReports(
            Authentication authentication) {

        requireAdmin(authentication);

        return ResponseEntity.ok(
                reportService.getStudentAttendanceReports());
    }

    @GetMapping("/overall")
    public ResponseEntity<Map<String, Object>> getOverallAttendanceReport(
            Authentication authentication) {

        requireAdmin(authentication);

        return ResponseEntity.ok(
                reportService.getOverallAttendanceReport());
    }


    @GetMapping("/sessions/summary")
    public ResponseEntity<List<Map<String, Object>>> getSessionAttendanceSummaries(
            Authentication authentication) {

        requireAdmin(authentication);

        return ResponseEntity.ok(
                reportService.getSessionAttendanceSummaries());
    }

    private void requireAdmin(Authentication authentication) {
        if (authentication == null
                || authentication.getAuthorities().stream()
                .noneMatch(authority -> {
                    String role = authority.getAuthority();
                    return "ADMIN".equals(role)
                            || "ROLE_ADMIN".equals(role);
                })) {
            throw new AccessDeniedException(
                    "Admin access is required to view attendance reports");
        }
    }

}
