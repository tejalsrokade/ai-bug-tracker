
package com.bugtracker.ai_bug_tracker.service;

import tools.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.List;
import java.util.Map;

@Service
public class AiAnalysisService {

    private final RestClient restClient;
    private final String apiKey;
    private final String model;

    public AiAnalysisService(
            RestClient.Builder restClientBuilder,
            @Value("${gemini.api.key}") String apiKey,
            @Value("${gemini.api.model}") String model) {

        this.restClient = restClientBuilder.build();
        this.apiKey = apiKey;
        this.model = model;
    }

    public String analyzeLog(String errorLog) {

        String prompt = """
                You are a Java debugging assistant.

                Analyze the following error log and provide:
                1. A simple explanation of the error.
                2. The most likely causes.
                3. Step-by-step debugging suggestions.
                4. A possible fix, if enough information is available.

                Do not invent facts that are not supported by the log.
                If the cause is uncertain, clearly state that.

                Error log:
                """ + errorLog;

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of(
                                "parts", List.of(
                                        Map.of("text", prompt)
                                )
                        )
                )
        );

        JsonNode response = restClient.post()
                .uri(
                        "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent",
                        model
                )
                .header("x-goog-api-key", apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .body(requestBody)
                .retrieve()
                .body(JsonNode.class);

        if (response == null) {
            throw new IllegalStateException(
                    "Gemini returned an empty response"
            );
        }

        JsonNode textNode = response.at(
                "/candidates/0/content/parts/0/text"
        );

        if (textNode.isMissingNode() || textNode.isNull()
                || textNode.asText().isBlank()) {
            throw new IllegalStateException(
                    "Gemini did not return analysis text"
            );
        }

        return textNode.asText();
    }
}
