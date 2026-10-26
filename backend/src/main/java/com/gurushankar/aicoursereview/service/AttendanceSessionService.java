
package com.gurushankar.aicoursereview.service;

import com.gurushankar.aicoursereview.entity.AttendanceSession;

import java.util.List;

public interface AttendanceSessionService {

    AttendanceSession createSession(
            String title,
            Long courseId
    );

    List<AttendanceSession> getAllSessions();

    AttendanceSession getSessionById(Long sessionId);

    String getGeneratedCode(Long sessionId);
}
