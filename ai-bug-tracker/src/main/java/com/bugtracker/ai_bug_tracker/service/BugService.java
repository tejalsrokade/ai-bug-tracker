package com.bugtracker.ai_bug_tracker.service;


import com.bugtracker.ai_bug_tracker.dto.BugRequestDto;
import com.bugtracker.ai_bug_tracker.dto.BugResponseDto;
import com.bugtracker.ai_bug_tracker.dto.BugStatsResponseDto;
import com.bugtracker.ai_bug_tracker.entity.Bug;
import com.bugtracker.ai_bug_tracker.exception.BugNotFoundException;
import com.bugtracker.ai_bug_tracker.repository.BugRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import com.bugtracker.ai_bug_tracker.enums.BugSeverity;
import com.bugtracker.ai_bug_tracker.enums.BugStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;

@Service
public class BugService {



    private final BugRepository bugRepository;

    public BugService(BugRepository bugRepository) {
        this.bugRepository = bugRepository;
    }

    public BugResponseDto createBug(BugRequestDto request) {
        Bug bug = new Bug();
        mapRequestToEntity(request, bug);

        Bug savedBug = bugRepository.save(bug);
        return mapToResponseDto(savedBug);
    }

    public List<BugResponseDto> getAllBugs() {
        return bugRepository.findAll()
                .stream()
                .map(this::mapToResponseDto)
                .toList();
    }

    public BugResponseDto getBugById(Long id) {
        Bug bug = findBugById(id);
        return mapToResponseDto(bug);
    }

    @Transactional
    public BugResponseDto updateBug(Long id, BugRequestDto request) {
        Bug bug = findBugById(id);
        mapRequestToEntity(request, bug);

        Bug updatedBug = bugRepository.save(bug);
        return mapToResponseDto(updatedBug);
    }

    public void deleteBug(Long id) {
        Bug bug = findBugById(id);
        bugRepository.delete(bug);
    }

    private Bug findBugById(Long id) {
        return bugRepository.findById(id)
                .orElseThrow(() -> new BugNotFoundException(id));
    }

    private void mapRequestToEntity(BugRequestDto request, Bug bug) {
        bug.setTitle(request.getTitle());
        bug.setDescription(request.getDescription());
        bug.setSeverity(request.getSeverity());
        bug.setStatus(request.getStatus());
        bug.setErrorLog(request.getErrorLog());
    }



    public Page<BugResponseDto> searchBugs(
            String keyword,
            BugStatus status,
            BugSeverity severity,
            int page,
            int size) {

        if (page < 0) {
            throw new IllegalArgumentException("Page number cannot be negative");
        }

        if (size < 1 || size > 100) {
            throw new IllegalArgumentException(
                    "Page size must be between 1 and 100"
            );
        }

        if (keyword != null && keyword.isBlank()) {
            keyword = null;
        }

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Page<Bug> bugs = bugRepository.searchAndFilter(
                keyword,
                status,
                severity,
                pageable
        );

        return bugs.map(this::mapToResponseDto);
    }

    public BugStatsResponseDto getBugStats() {
        return new BugStatsResponseDto(
                bugRepository.count(),
                bugRepository.countByStatus(BugStatus.OPEN),
                bugRepository.countByStatus(BugStatus.IN_PROGRESS),
                bugRepository.countByStatus(BugStatus.RESOLVED)
        );
    }


    private BugResponseDto mapToResponseDto(Bug bug) {
        return new BugResponseDto(
                bug.getId(),
                bug.getTitle(),
                bug.getDescription(),
                bug.getSeverity(),
                bug.getStatus(),
                bug.getErrorLog(),
                bug.getCreatedAt(),
                bug.getUpdatedAt()
        );
    }



}
