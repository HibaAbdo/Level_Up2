package com.example.chess_tournament.repository;

import com.example.chess_tournament.model.Round;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RoundRepository extends JpaRepository<Round, Long> {
    List<Round> findByTournamentId(Long tournamentId);
}
