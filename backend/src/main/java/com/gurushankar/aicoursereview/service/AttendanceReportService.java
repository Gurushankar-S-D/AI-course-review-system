
package com.gurushankar.aicoursereview.service;

import java.util.List;
import java.util.Map;

public interface AttendanceReportService {

    Map<String, Object> getSessionReport(Long sessionId);

    List<Map<String, Object>> getAllSessionReports();

    Map<String, Object> getOverallAttendanceReport();

    List<Map<String, Object>> getStudentAttendanceReports();

    List<Map<String, Object>> getSessionAttendanceSummaries();
}
