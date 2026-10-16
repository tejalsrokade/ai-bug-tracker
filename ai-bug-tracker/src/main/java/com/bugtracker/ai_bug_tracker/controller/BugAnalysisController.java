
package com.bugtracker.ai_bug_tracker.controller;

import com.bugtracker.ai_bug_tracker.dto.AnalyzeLogRequestDto;
import com.bugtracker.ai_bug_tracker.entity.BugAnalysis;
import com.bugtracker.ai_bug_tracker.service.BugAnalysisService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analysis")
public class BugAnalysisController {


    private final BugAnalysisService bugAnalysisService;

    public BugAnalysisController(
            BugAnalysisService bugAnalysisService) {
        this.bugAnalysisService = bugAnalysisService;
    }

    @PostMapping
    public ResponseEntity<BugAnalysis> analyzeLog(
            @Valid @RequestBody AnalyzeLogRequestDto request) {

        BugAnalysis savedAnalysis =
                bugAnalysisService.analyzeAndSave(request);

        return ResponseEntity.ok(savedAnalysis);
    }

    @GetMapping
    public ResponseEntity<List<BugAnalysis>> getAllAnalyses() {

        List<BugAnalysis> analyses =
                bugAnalysisService.getAllAnalyses();

        return ResponseEntity.ok(analyses);
    }
}
