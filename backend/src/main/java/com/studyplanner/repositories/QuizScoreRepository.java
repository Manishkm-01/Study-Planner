package com.studyplanner.repositories;

import com.studyplanner.models.QuizScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface QuizScoreRepository extends JpaRepository<QuizScore, Long> {
    List<QuizScore> findByUserId(Long userId);
    
    @Query("SELECT qs FROM QuizScore qs WHERE LOWER(qs.quiz.subject) = LOWER(:subject) ORDER BY qs.score DESC")
    List<QuizScore> findLeaderboardBySubject(String subject);
}
