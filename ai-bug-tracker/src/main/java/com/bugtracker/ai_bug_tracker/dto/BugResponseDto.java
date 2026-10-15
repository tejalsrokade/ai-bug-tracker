package com.bugtracker.ai_bug_tracker.dto;

import com.bugtracker.ai_bug_tracker.enums.BugSeverity;
import com.bugtracker.ai_bug_tracker.enums.BugStatus;

import java.time.LocalDateTime;

public class BugResponseDto {

    private Long id;
    private String title;
    private String description;
    private BugSeverity severity;
    private BugStatus status;
    private String errorLog;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public BugResponseDto() {
    }

    public BugResponseDto(
            Long id,
            String title,
            String description,
            BugSeverity severity,
            BugStatus status,
            String errorLog,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.severity = severity;
        this.status = status;
        this.errorLog = errorLog;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public BugSeverity getSeverity() {
        return severity;
    }

    public BugStatus getStatus() {
        return status;
    }

    public String getErrorLog() {
        return errorLog;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
