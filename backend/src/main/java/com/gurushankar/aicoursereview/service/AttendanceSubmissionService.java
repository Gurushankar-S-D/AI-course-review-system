package com.gurushankar.aicoursereview.service;

import java.util.List;
import java.util.Map;
import com.gurushankar.aicoursereview.entity.AttendanceRecord;

public interface AttendanceSubmissionService {

    AttendanceRecord submitAttendance(
            String attendanceCode,
            String feedback,
            String username
    );
    List<AttendanceRecord> getMyAttendance(String username);

    Map<String, Object> getMyAttendanceSummary(String username);

}
