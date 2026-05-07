package com.studyplanner.controllers;

import com.studyplanner.models.Quiz;
import com.studyplanner.models.QuizScore;
import com.studyplanner.models.User;
import com.studyplanner.repositories.QuizRepository;
import com.studyplanner.repositories.QuizScoreRepository;
import com.studyplanner.repositories.UserRepository;
import com.studyplanner.services.GeminiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.NonNull;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuizScoreRepository quizScoreRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GeminiService geminiService;

    @PostMapping("/generate")
    public ResponseEntity<?> generateQuiz(@RequestBody Map<String, String> request) {
        String subject = request.get("subject");
        String topic = request.get("topic");

        String generatedQuestions = geminiService.generateQuiz(subject, topic);

        Quiz quiz = new Quiz();
        quiz.setSubject(subject);
        quiz.setTopic(topic);
        quiz.setQuestionsJson(generatedQuestions);

        quizRepository.save(quiz);

        return ResponseEntity.ok(quiz);
    }

    @PostMapping("/{quizId}/submit")
    public ResponseEntity<?> submitQuizScore(@PathVariable @NonNull Long quizId,
            @RequestBody Map<String, Integer> request, Authentication authentication) {
        Optional<User> userOpt = userRepository.findByEmail(authentication.getName());
        Optional<Quiz> quizOpt = quizRepository.findById(quizId);

        if (userOpt.isEmpty() || quizOpt.isEmpty())
            return ResponseEntity.notFound().build();

        int score = request.get("score");
        int total = request.get("total");

        QuizScore quizScore = new QuizScore();
        quizScore.setUser(userOpt.get());
        quizScore.setQuiz(quizOpt.get());
        quizScore.setScore(score);
        quizScore.setTotalQuestions(total);

        quizScoreRepository.save(quizScore);

        return ResponseEntity.ok(quizScore);
    }

    @GetMapping("/leaderboard/{subject}")
    public ResponseEntity<?> getLeaderboard(@PathVariable String subject) {
        List<QuizScore> leaderboard = quizScoreRepository.findLeaderboardBySubject(subject);
        return ResponseEntity.ok(leaderboard);
    }
}
