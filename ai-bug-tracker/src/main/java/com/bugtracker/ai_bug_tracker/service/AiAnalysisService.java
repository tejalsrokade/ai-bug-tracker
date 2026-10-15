package com.bugtracker.ai_bug_tracker.service;

import com.bugtracker.ai_bug_tracker.dto.AiAnalysisResultDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

import java.util.List;
import java.util.Map;

@Service
public class AiAnalysisService {

    private final RestClient restClient;
    private final ObjectMapper objectMapper;
    private final String apiKey;
    private final String model;

    public AiAnalysisService(
            RestClient.Builder restClientBuilder,
            ObjectMapper objectMapper,
            @Value("${gemini.api.key}") String apiKey,
            @Value("${gemini.api.model}") String model) {

        this.restClient = restClientBuilder.build();
        this.objectMapper = objectMapper;
        this.apiKey = apiKey;
        this.model = model;
    }

    public AiAnalysisResultDto analyzeLog(String errorLog) {

        String prompt = """
                You are a Java debugging assistant.

                Analyze the error log and return a JSON object with
                exactly these three string fields:

                {
                  "explanation": "Explain the error in simple language.",
                  "possibleCauses": "Describe the likely causes.",
                  "suggestedSteps": "Provide debugging steps and a possible fix."
                }

                Use plain text inside each field.
                Do not use Markdown code fences.
                Do not invent facts unsupported by the log.
                Clearly state when the cause is uncertain.

                Error log:
                """ + errorLog;

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of(
                                "parts", List.of(
                                        Map.of("text", prompt)
                                )
                        )
                ),
                "generationConfig", Map.of(
                        "responseMimeType", "application/json"
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

        if (textNode.isMissingNode()
                || textNode.isNull()
                || textNode.asText().isBlank()) {
            throw new IllegalStateException(
                    "Gemini did not return analysis text"
            );
        }

        try {
            JsonNode result = objectMapper.readTree(textNode.asText());

            AiAnalysisResultDto dto = new AiAnalysisResultDto();
            dto.setExplanation(
                    result.path("explanation").asString("")
            );
            dto.setPossibleCauses(
                    result.path("possibleCauses").asString("")
            );
            dto.setSuggestedSteps(
                    result.path("suggestedSteps").asString("")
            );

            if (dto.getExplanation().isBlank()
                    || dto.getPossibleCauses().isBlank()
                    || dto.getSuggestedSteps().isBlank()) {
                throw new IllegalStateException(
                        "Gemini response is missing required analysis fields"
                );
            }

            return dto;

        } catch (tools.jackson.core.JacksonException e) {
            throw new IllegalStateException(
                    "Failed to parse Gemini analysis JSON", e
            );
        }
    }
}