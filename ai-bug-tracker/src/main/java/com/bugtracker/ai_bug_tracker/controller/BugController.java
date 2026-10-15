package com.bugtracker.ai_bug_tracker.controller;

import com.bugtracker.ai_bug_tracker.dto.BugRequestDto;
import com.bugtracker.ai_bug_tracker.dto.BugResponseDto;
import com.bugtracker.ai_bug_tracker.dto.BugStatsResponseDto;
import com.bugtracker.ai_bug_tracker.service.BugService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.bugtracker.ai_bug_tracker.enums.BugSeverity;
import com.bugtracker.ai_bug_tracker.enums.BugStatus;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.RequestParam;
import java.util.List;

@RestController
@RequestMapping("/api/bugs")
public class BugController {

    private final BugService bugService;

    public BugController(BugService bugService) {
        this.bugService = bugService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BugResponseDto createBug(
            @Valid @RequestBody BugRequestDto request) {
        return bugService.createBug(request);
    }

    @GetMapping
    public List<BugResponseDto> getAllBugs() {
        return bugService.getAllBugs();
    }

    @GetMapping("/{id}")
    public BugResponseDto getBugById(@PathVariable Long id) {
        return bugService.getBugById(id);
    }

    @PutMapping("/{id}")
    public BugResponseDto updateBug(
            @PathVariable Long id,
            @Valid @RequestBody BugRequestDto request) {
        return bugService.updateBug(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteBug(@PathVariable Long id) {
        bugService.deleteBug(id);
    }


    @GetMapping("/search")
    public ResponseEntity<Page<BugResponseDto>> searchBugs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) BugStatus status,
            @RequestParam(required = false) BugSeverity severity,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return ResponseEntity.ok(
                bugService.searchBugs(keyword, status, severity, page, size)
        );
    }

    @GetMapping("/stats")
    public ResponseEntity<BugStatsResponseDto> getBugStats() {
        return ResponseEntity.ok(bugService.getBugStats());
    }



}
