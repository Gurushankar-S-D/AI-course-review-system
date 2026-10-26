
package com.gurushankar.aicoursereview.repository;

import com.gurushankar.aicoursereview.entity.AttendanceRecord;
import com.gurushankar.aicoursereview.entity.AttendanceSession;
import com.gurushankar.aicoursereview.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRecordRepository
        extends JpaRepository<AttendanceRecord, Long> {

    boolean existsBySessionAndStudent(
            AttendanceSession session,
            User student
    );

    Optional<AttendanceRecord> findBySessionAndStudent(
            AttendanceSession session,
            User student
    );

    List<AttendanceRecord> findAllBySession_SessionIdOrderBySubmittedAtDesc(
            Long sessionId
    );

    List<AttendanceRecord> findAllByStudent_UserIdOrderBySubmittedAtDesc(
            Long userId
    );

    long countBySession_SessionId(Long sessionId);

    List<AttendanceRecord>
    findAllByStudent_UsernameOrderBySubmittedAtDesc(String username);

    List<AttendanceRecord> findAllByOrderBySubmittedAtDesc();

}
