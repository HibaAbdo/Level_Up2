package com.example.chess_tournament.repository;

import com.example.chess_tournament.model.Arbiter;
import com.example.chess_tournament.model.Player;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ArbiterRepository extends JpaRepository<Arbiter, Long> {
    List<Arbiter> findByTournamentId(Long tournamentId);

}
