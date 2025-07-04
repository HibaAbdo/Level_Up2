package com.example.chess_tournament.repository;

import com.example.chess_tournament.model.Violation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ViolationRepository extends JpaRepository<Violation, Long> {
    List<Violation> findByPlayerId(Long playerId);

    List<Violation> findByRoundTournamentId(Long tournamentId);
}
