package com.bugtracker.ai_bug_tracker.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class AnalyzeLogRequestDto {

    @NotNull(message = "Bug ID is required")
    @Positive(message = "Bug ID must be positive")
    private Long bugId;

    @NotBlank(message = "Error log cannot be empty")
    private String errorLog;

    public Long getBugId() {
        return bugId;
    }

    public void setBugId(Long bugId) {
        this.bugId = bugId;
    }

    public String getErrorLog() {
        return errorLog;
    }

    public void setErrorLog(String errorLog) {
        this.errorLog = errorLog;
    }
}