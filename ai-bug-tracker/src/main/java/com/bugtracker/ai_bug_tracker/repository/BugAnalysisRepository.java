package com.bugtracker.ai_bug_tracker.repository;

import com.bugtracker.ai_bug_tracker.entity.BugAnalysis;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BugAnalysisRepository
        extends JpaRepository<BugAnalysis, Long> {

    List<BugAnalysis> findByBugId(Long bugId);
}
