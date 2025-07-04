package com.example.chess_tournament.repository;

import com.example.chess_tournament.model.Match;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MatchRepository extends JpaRepository<Match, Long> {
    List<Match> findByRoundId(Long roundId);
}
