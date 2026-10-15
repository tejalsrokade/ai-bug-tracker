package com.bugtracker.ai_bug_tracker.dto;



import jakarta.validation.constraints.NotBlank;

public class AnalyzeLogRequestDto {

    @NotBlank(message = "Error log cannot be empty")
    private String errorLog;

    public String getErrorLog() {
        return errorLog;
    }

    public void setErrorLog(String errorLog) {
        this.errorLog = errorLog;
    }
}