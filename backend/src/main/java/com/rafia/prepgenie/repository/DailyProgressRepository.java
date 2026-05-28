package com.rafia.prepgenie.repository;

import com.rafia.prepgenie.entity.DailyProgress;
import com.rafia.prepgenie.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface DailyProgressRepository extends JpaRepository<DailyProgress, Long> {
    Optional<DailyProgress> findByUserAndDate(User user, LocalDate date);
    Optional<DailyProgress> findTopByUserOrderByDateDesc(User user);
}
