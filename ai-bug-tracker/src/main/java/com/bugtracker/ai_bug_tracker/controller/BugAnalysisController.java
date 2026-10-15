
package com.bugtracker.ai_bug_tracker.controller;

import com.bugtracker.ai_bug_tracker.dto.AnalyzeLogRequestDto;
import com.bugtracker.ai_bug_tracker.service.AiAnalysisService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/analysis")
public class BugAnalysisController {

    private final AiAnalysisService aiAnalysisService;

    public BugAnalysisController(
            AiAnalysisService aiAnalysisService) {
        this.aiAnalysisService = aiAnalysisService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> analyzeLog(
            @Valid @RequestBody AnalyzeLogRequestDto request) {

        String analysis = aiAnalysisService.analyzeLog(
                request.getErrorLog()
        );

        return ResponseEntity.ok(
                Map.of("analysis", analysis)
        );
    }
}
