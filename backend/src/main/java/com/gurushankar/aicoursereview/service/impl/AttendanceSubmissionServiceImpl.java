
package com.gurushankar.aicoursereview.service.impl;

import com.gurushankar.aicoursereview.entity.AttendanceRecord;
import com.gurushankar.aicoursereview.entity.AttendanceSession;
import com.gurushankar.aicoursereview.entity.User;
import com.gurushankar.aicoursereview.repository.AttendanceRecordRepository;
import com.gurushankar.aicoursereview.repository.AttendanceSessionRepository;
import com.gurushankar.aicoursereview.repository.UserRepository;
import com.gurushankar.aicoursereview.service.AttendanceSubmissionService;
import com.gurushankar.aicoursereview.entity.EnrollmentStatus;
import com.gurushankar.aicoursereview.repository.SessionEnrollmentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.LinkedHashMap;
import java.util.Map;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

@Service
public class AttendanceSubmissionServiceImpl
        implements AttendanceSubmissionService {

    private final AttendanceSessionRepository sessionRepository;
    private final AttendanceRecordRepository recordRepository;
    private final UserRepository userRepository;
    private final SessionEnrollmentRepository enrollmentRepository;

    public AttendanceSubmissionServiceImpl(
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
    public Map<String, Object> getMyAttendanceSummary(String username) {

        List<AttendanceRecord> records =
                recordRepository
                        .findAllByStudent_UsernameOrderBySubmittedAtDesc(username);

        long attendedSessions = records.size();

        Map<String, Object> summary = new LinkedHashMap<>();
        summary.put("username", username);
        summary.put("totalSessionsAttended", attendedSessions);
        summary.put("attendanceHistory", records.stream()
                .map(record -> Map.of(
                        "sessionId", record.getSession().getSessionId(),
                        "sessionTitle", record.getSession().getTitle(),
                        "submittedAt", record.getSubmittedAt()
                ))
                .toList());

        return summary;
    }
    @Override
    @Transactional
    public AttendanceRecord submitAttendance(
            String attendanceCode,
            String feedback,
            String username) {

        if (attendanceCode == null || attendanceCode.isBlank()) {
            throw new IllegalArgumentException(
                    "Attendance code is required");
        }

        if (feedback == null || feedback.isBlank()) {
            throw new IllegalArgumentException(
                    "Feedback is required");
        }

        if (feedback.trim().length() > 1000) {
            throw new IllegalArgumentException(
                    "Feedback must not exceed 1000 characters");
        }

        User student = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Student account not found"));

        String codeHash = hashCode(attendanceCode);

        AttendanceSession session = sessionRepository
                .findByAttendanceCode(codeHash)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Invalid attendance code"));

        LocalDateTime now = LocalDateTime.now();

        if (now.isBefore(session.getActivatedAt())
                || !now.isBefore(session.getExpiresAt())) {
            throw new IllegalArgumentException(
                    "Attendance code has expired or is not active");
        }

        if (recordRepository.existsBySessionAndStudent(session, student)) {
            throw new IllegalArgumentException(
                    "Attendance has already been submitted for this session");
        }
        if (!enrollmentRepository
                .existsBySession_SessionIdAndStudent_UserIdAndStatus(
                        session.getSessionId(),
                        student.getUserId(),
                        EnrollmentStatus.APPROVED)) {

            throw new IllegalArgumentException(
                    "Your enrollment for this session has not been approved");
        }
        AttendanceRecord record = AttendanceRecord.builder()
                .session(session)
                .student(student)
                .feedback(feedback.trim())
                .submittedAt(now)
                .build();

        return recordRepository.save(record);
    }

    private String hashCode(String code) {
        try {
            MessageDigest digest =
                    MessageDigest.getInstance("SHA-256");

            byte[] hash = digest.digest(
                    code.trim().getBytes(StandardCharsets.UTF_8));

            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception exception) {
            throw new IllegalStateException(
                    "Unable to validate attendance code", exception);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceRecord> getMyAttendance(String username) {
        return recordRepository
                .findAllByStudent_UsernameOrderBySubmittedAtDesc(username);
    }
}
