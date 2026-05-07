package com.studyplanner.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public String generateSchedule(String subject, String topic) {
        String prompt = "Create a detailed study schedule for the subject '" + subject
                + "' specifically focusing on the topic '" + topic + "'. Structure it clearly.";
        return callGeminiAPI(prompt);
    }

    public String generateQuiz(String subject, String topic) {
        String prompt = "Generate a multiple-choice quiz about the subject '" + subject + "' and topic '" + topic
                + "'. Provide 10 questions. Format the response as a valid JSON array of objects, where each object has 'question', 'options' (array of strings), 'answer' (the correct option string), and 'explanation' (a brief string explaining why the answer is correct). Do not include any markdown formatting or extra text outside the JSON array.";
        return callGeminiAPI(prompt);
    }

    @SuppressWarnings("unchecked")
    private String callGeminiAPI(String prompt) {
        if ("YOUR_GEMINI_API_KEY".equals(apiKey)) {
            return fallbackResponse(prompt);
        }

        String url = apiUrl + "?key=" + apiKey;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> parts = new HashMap<>();
        parts.put("text", prompt);

        Map<String, Object> content = new HashMap<>();
        content.put("parts", List.of(parts));

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", List.of(content));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            Map<String, Object> response = (Map<String, Object>) restTemplate.postForObject(url, request, Map.class);
            if (response != null && response.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> contentMap = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> partsList = (List<Map<String, Object>>) contentMap.get("parts");
                    return (String) partsList.get(0).get("text");
                }
            }
            return "Failed to generate content.";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error calling Gemini API: " + e.getMessage();
        }
    }

    private String fallbackResponse(String prompt) {
        if (prompt.contains("quiz")) {
            return "[{\"question\": \"What is a mock question?\", \"options\": [\"A\", \"B\", \"C\", \"D\"], \"answer\": \"A\"}]";
        }
        return "This is a mock schedule generated because the actual API key is not configured.\n\nDay 1: Basics\nDay 2: Advanced";
    }
}
