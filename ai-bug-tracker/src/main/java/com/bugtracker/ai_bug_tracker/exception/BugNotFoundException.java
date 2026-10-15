package com.bugtracker.ai_bug_tracker.exception;

public class BugNotFoundException extends RuntimeException{

    public BugNotFoundException(Long id){
        super("Bug not found with ID: "+id);

    }
}
