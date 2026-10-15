package com.bugtracker.ai_bug_tracker.dto;

public class AiAnalysisResultDto {

    private String explanation;
    private String possibleCauses;
    private String suggestedSteps;

    public AiAnalysisResultDto() {
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public String getPossibleCauses() {
        return possibleCauses;
    }

    public void setPossibleCauses(String possibleCauses) {
        this.possibleCauses = possibleCauses;
    }

    public String getSuggestedSteps() {
        return suggestedSteps;
    }

    public void setSuggestedSteps(String suggestedSteps) {
        this.suggestedSteps = suggestedSteps;
    }
}