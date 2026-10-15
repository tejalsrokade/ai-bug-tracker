package com.bugtracker.ai_bug_tracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AiBugTrackerApplication {

	public static void main(String[] args) {
		SpringApplication.run(AiBugTrackerApplication.class, args);
		System.out.println("---------------------------");
		System.out.println("Server started on port 8080");
		System.out.println("---------------------------");


	}

}
