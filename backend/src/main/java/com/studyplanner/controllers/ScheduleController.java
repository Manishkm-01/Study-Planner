package com.studyplanner.controllers;

import com.studyplanner.models.Schedule;
import com.studyplanner.models.User;
import com.studyplanner.repositories.ScheduleRepository;
import com.studyplanner.repositories.UserRepository;
import com.studyplanner.services.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GeminiService geminiService;

    @GetMapping
    public ResponseEntity<?> getUserSchedules(Authentication authentication) {
        Optional<User> user = userRepository.findByEmail(authentication.getName());
        if (user.isPresent()) {
            List<Schedule> schedules = scheduleRepository.findByUserId(user.get().getId());
            return ResponseEntity.ok(schedules);
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/generate")
    public ResponseEntity<?> generateSchedule(@RequestBody Map<String, String> request, Authentication authentication) {
        String subject = request.get("subject");
        String topic = request.get("topic");

        Optional<User> userOpt = userRepository.findByEmail(authentication.getName());
        if (userOpt.isEmpty()) return ResponseEntity.notFound().build();

        String generatedContent = geminiService.generateSchedule(subject, topic);

        Schedule schedule = new Schedule();
        schedule.setUser(userOpt.get());
        schedule.setSubject(subject);
        schedule.setTopic(topic);
        schedule.setContent(generatedContent);

        scheduleRepository.save(schedule);

        return ResponseEntity.ok(schedule);
    }
}
