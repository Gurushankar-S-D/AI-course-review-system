
package com.gurushankar.aicoursereview.repository;

import com.gurushankar.aicoursereview.entity.AttendanceSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

import java.util.List;

@Repository
public interface AttendanceSessionRepository
        extends JpaRepository<AttendanceSession, Long> {

    List<AttendanceSession> findAllByOrderByCreatedAtDesc();

    Optional<AttendanceSession> findByAttendanceCode(String attendanceCode);
}
