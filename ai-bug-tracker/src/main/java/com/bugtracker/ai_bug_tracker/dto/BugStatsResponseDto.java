package com.bugtracker.ai_bug_tracker.dto;
public class BugStatsResponseDto {

    private long totalBugs;
    private long openBugs;
    private long inProgressBugs;
    private long resolvedBugs;

    public BugStatsResponseDto(
            long totalBugs,
            long openBugs,
            long inProgressBugs,
            long resolvedBugs) {
        this.totalBugs = totalBugs;
        this.openBugs = openBugs;
        this.inProgressBugs = inProgressBugs;
        this.resolvedBugs = resolvedBugs;
    }

    public long getTotalBugs() {
        return totalBugs;
    }

    public long getOpenBugs() {
        return openBugs;
    }

    public long getInProgressBugs() {
        return inProgressBugs;
    }

    public long getResolvedBugs() {
        return resolvedBugs;
    }
}