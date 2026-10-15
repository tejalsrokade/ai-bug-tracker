package com.bugtracker.ai_bug_tracker.service;

import com.bugtracker.ai_bug_tracker.dto.AiAnalysisResultDto;
import com.bugtracker.ai_bug_tracker.dto.AnalyzeLogRequestDto;
import com.bugtracker.ai_bug_tracker.entity.Bug;
import com.bugtracker.ai_bug_tracker.entity.BugAnalysis;
import com.bugtracker.ai_bug_tracker.exception.BugNotFoundException;
import com.bugtracker.ai_bug_tracker.repository.BugAnalysisRepository;
import com.bugtracker.ai_bug_tracker.repository.BugRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BugAnalysisService {

    private final BugRepository bugRepository;
    private final BugAnalysisRepository bugAnalysisRepository;
    private final AiAnalysisService aiAnalysisService;

    public BugAnalysisService(
            BugRepository bugRepository,
            BugAnalysisRepository bugAnalysisRepository,
            AiAnalysisService aiAnalysisService) {
        this.bugRepository = bugRepository;
        this.bugAnalysisRepository = bugAnalysisRepository;
        this.aiAnalysisService = aiAnalysisService;
    }

    @Transactional
    public BugAnalysis analyzeAndSave(AnalyzeLogRequestDto request) {

        Bug bug = bugRepository.findById(request.getBugId())
                .orElseThrow(() -> new BugNotFoundException(
                        request.getBugId()
                ));

        AiAnalysisResultDto result =
                aiAnalysisService.analyzeLog(request.getErrorLog());

        BugAnalysis analysis = new BugAnalysis();
        analysis.setBug(bug);
        analysis.setExplanation(result.getExplanation());
        analysis.setPossibleCauses(result.getPossibleCauses());
        analysis.setSuggestedSteps(result.getSuggestedSteps());

        return bugAnalysisRepository.save(analysis);
    }
}