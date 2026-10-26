
package com.gurushankar.aicoursereview.service.impl;

import com.gurushankar.aicoursereview.entity.AttendanceRecord;
import com.gurushankar.aicoursereview.entity.AttendanceSession;
import com.gurushankar.aicoursereview.repository.AttendanceRecordRepository;
import com.gurushankar.aicoursereview.repository.AttendanceSessionRepository;
import com.gurushankar.aicoursereview.repository.UserRepository;
import com.gurushankar.aicoursereview.service.AttendanceReportService;
import com.gurushankar.aicoursereview.repository.SessionEnrollmentRepository;
import com.gurushankar.aicoursereview.entity.EnrollmentStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class AttendanceReportServiceImpl
        implements AttendanceReportService {

    private final AttendanceSessionRepository sessionRepository;
    private final AttendanceRecordRepository recordRepository;
    private final UserRepository userRepository;
    private final SessionEnrollmentRepository enrollmentRepository;

    public AttendanceReportServiceImpl(
            AttendanceSessionRepository sessionRepository,
            AttendanceRecordRepository recordRepository,
            UserRepository userRepository,
            SessionEnrollmentRepository enrollmentRepository) {
        this.sessionRepository = sessionRepository;
        this.recordRepository = recordRepository;
        this.userRepository = userRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getSessionReport(Long sessionId) {
        AttendanceSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Attendance session not found: " + sessionId));

        List<AttendanceRecord> records =
                recordRepository
                        .findAllBySession_SessionIdOrderBySubmittedAtDesc(
                                sessionId);

        long totalStudents = userRepository.countByRole("USER");
        long presentStudents = records.size();

        double attendancePercentage = totalStudents == 0
                ? 0.0
                : (presentStudents * 100.0) / totalStudents;

        Map<String, Object> report = new LinkedHashMap<>();
        report.put("sessionId", session.getSessionId());
        report.put("sessionTitle", session.getTitle());
        report.put("courseName", session.getCourse() == null
                ? null
                : session.getCourse().getCourseName());
        report.put("sessionDate", session.getSessionDate());
        report.put("expiresAt", session.getExpiresAt());
        report.put("totalRegisteredStudents", totalStudents);
        report.put("presentStudents", presentStudents);
        report.put("attendancePercentage",
                Math.round(attendancePercentage * 100.0) / 100.0);
        report.put("studentFeedback", records.stream()
                .map(this::toStudentFeedback)
                .toList());

        return report;
    }

    @Override
    public List<Map<String, Object>> getSessionAttendanceSummaries() {
        List<AttendanceSession> sessions =
                sessionRepository.findAllByOrderByCreatedAtDesc();

        List<Map<String, Object>> summaries = new ArrayList<>();

        for (AttendanceSession session : sessions) {
            Map<String, Object> summary = new LinkedHashMap<>();

            long attendanceCount =
                    recordRepository.countBySession_SessionId(
                            session.getSessionId()
                    );
            long totalStudentsEnrolled =
                    enrollmentRepository.countBySession_SessionIdAndStatus(
                            session.getSessionId(),
                            EnrollmentStatus.APPROVED
                    );

            summary.put("sessionId", session.getSessionId());
            summary.put("sessionTitle", session.getTitle());
            summary.put(
                    "courseName",
                    session.getCourse() != null
                            ? session.getCourse().getCourseName()
                            : null
            );
            summary.put("sessionDate", session.getSessionDate());
            summary.put("expiresAt", session.getExpiresAt());
            summary.put("attendanceCount", attendanceCount);
            summary.put("totalStudentsEnrolled", totalStudentsEnrolled);

            summaries.add(summary);
        }

        return summaries;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getAllSessionReports() {
        return sessionRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(session -> getSessionReport(session.getSessionId()))
                .toList();
    }

    private Map<String, Object> toStudentFeedback(
            AttendanceRecord record) {
        Map<String, Object> feedback = new LinkedHashMap<>();
        feedback.put("attendanceId", record.getAttendanceId());
        feedback.put("studentUsername",
                record.getStudent().getUsername());
        feedback.put("feedback", record.getFeedback());
        feedback.put("submittedAt", record.getSubmittedAt());
        return feedback;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getOverallAttendanceReport() {

        List<AttendanceRecord> records =
                recordRepository.findAllByOrderBySubmittedAtDesc();

        long totalSessions = sessionRepository.count();
        long totalStudents = userRepository.countByRole("USER");
        long totalSubmissions = records.size();

        Map<String, Object> report = new LinkedHashMap<>();
        report.put("totalSessions", totalSessions);
        report.put("totalRegisteredStudents", totalStudents);
        report.put("totalAttendanceSubmissions", totalSubmissions);

        report.put("sessionAttendance", records.stream()
                .map(record -> {
                    Map<String, Object> item = new LinkedHashMap<>();
                    item.put("attendanceId", record.getAttendanceId());
                    item.put("sessionId", record.getSession().getSessionId());
                    item.put("sessionTitle", record.getSession().getTitle());
                    item.put("studentUsername", record.getStudent().getUsername());
                    item.put("feedback", record.getFeedback());
                    item.put("submittedAt", record.getSubmittedAt());
                    return item;
                })
                .toList());

        return report;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getStudentAttendanceReports() {

        List<AttendanceRecord> records =
                recordRepository.findAllByOrderBySubmittedAtDesc();

        Map<String, Map<String, Object>> studentReports =
                new LinkedHashMap<>();

        for (AttendanceRecord record : records) {
            String username = record.getStudent().getUsername();

            Map<String, Object> studentReport =
                    studentReports.computeIfAbsent(username, key -> {
                        Map<String, Object> item = new LinkedHashMap<>();
                        item.put("username", key);
                        item.put("totalSessionsAttended", 0);
                        item.put("attendanceHistory", new ArrayList<Map<String, Object>>());
                        return item;
                    });

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> history =
                    (List<Map<String, Object>>) studentReport.get("attendanceHistory");

            Map<String, Object> session = new LinkedHashMap<>();
            session.put("attendanceId", record.getAttendanceId());
            session.put("sessionId", record.getSession().getSessionId());
            session.put("sessionTitle", record.getSession().getTitle());
            session.put("courseName",
                    record.getSession().getCourse() != null
                            ? record.getSession().getCourse().getCourseName()
                            : null);
            session.put("feedback", record.getFeedback());
            session.put("submittedAt", record.getSubmittedAt());

            history.add(session);
            studentReport.put("totalSessionsAttended", history.size());
        }

        return new ArrayList<>(studentReports.values());
    }
}
