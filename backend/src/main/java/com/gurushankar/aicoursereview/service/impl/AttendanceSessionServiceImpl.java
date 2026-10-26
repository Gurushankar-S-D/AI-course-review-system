
package com.gurushankar.aicoursereview.service.impl;

import com.gurushankar.aicoursereview.entity.AttendanceSession;
import com.gurushankar.aicoursereview.entity.Course;
import com.gurushankar.aicoursereview.repository.AttendanceSessionRepository;
import com.gurushankar.aicoursereview.repository.CourseRepository;
import com.gurushankar.aicoursereview.service.AttendanceSessionService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

@Service
public class AttendanceSessionServiceImpl
        implements AttendanceSessionService {

    private final AttendanceSessionRepository sessionRepository;
    private final CourseRepository courseRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    // Keeps the original code temporarily available to the admin
    // after creation. The database stores only its hash.
    private final Map<Long, String> generatedCodes =
            new ConcurrentHashMap<>();

    public AttendanceSessionServiceImpl(
            AttendanceSessionRepository sessionRepository,
            CourseRepository courseRepository) {
        this.sessionRepository = sessionRepository;
        this.courseRepository = courseRepository;
    }

    @Override
    @Transactional
    public AttendanceSession createSession(String title, Long courseId) {
        if (title == null || title.isBlank()) {
            throw new IllegalArgumentException("Session title is required");
        }

        Course course = null;
        if (courseId != null) {
            course = courseRepository.findById(courseId)
                    .orElseThrow(() -> new IllegalArgumentException(
                            "Course not found: " + courseId));
        }

        String code = generateCode();
        LocalDateTime activatedAt = LocalDateTime.now();

        AttendanceSession session = AttendanceSession.builder()
                .title(title.trim())
                .course(course)
                .sessionDate(activatedAt)
                .attendanceCode(hashCode(code))
                .activatedAt(activatedAt)
                .expiresAt(activatedAt.plusHours(18))
                .build();

        AttendanceSession saved = sessionRepository.save(session);
        generatedCodes.put(saved.getSessionId(), code);

        return saved;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttendanceSession> getAllSessions() {
        return sessionRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    @Transactional(readOnly = true)
    public AttendanceSession getSessionById(Long sessionId) {
        return sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Attendance session not found: " + sessionId));
    }

    @Override
    public String getGeneratedCode(Long sessionId) {
        String code = generatedCodes.get(sessionId);
        if (code == null) {
            throw new IllegalArgumentException(
                    "Generated code is unavailable. It can only be viewed immediately after creation.");
        }
        return code;
    }

    private String generateCode() {
        // Generate a readable, random 12-character code.
        byte[] bytes = new byte[9];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes)
                .substring(0, 12)
                .toUpperCase();
    }

    private String hashCode(String code) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(
                    code.trim().getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (Exception exception) {
            throw new IllegalStateException(
                    "Unable to secure attendance code", exception);
        }
    }
}
