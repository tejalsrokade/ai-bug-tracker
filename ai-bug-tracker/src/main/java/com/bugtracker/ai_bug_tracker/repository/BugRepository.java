package com.bugtracker.ai_bug_tracker.repository;

import com.bugtracker.ai_bug_tracker.entity.Bug;
import com.bugtracker.ai_bug_tracker.enums.BugSeverity;
import com.bugtracker.ai_bug_tracker.enums.BugStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BugRepository
        extends JpaRepository<Bug, Long> {
    @Query("""
        SELECT b FROM Bug b
        WHERE (
            :keyword IS NULL
            OR LOWER(b.title) LIKE LOWER(CONCAT('%', :keyword, '%'))
            OR LOWER(b.description) LIKE LOWER(CONCAT('%', :keyword, '%'))
        )
        AND (:status IS NULL OR b.status = :status)
        AND (:severity IS NULL OR b.severity = :severity)
        """)
    Page<Bug> searchAndFilter(
            @Param("keyword") String keyword,
            @Param("status") BugStatus status,
            @Param("severity") BugSeverity severity,
            Pageable pageable
    );

    long countByStatus(BugStatus status);
}