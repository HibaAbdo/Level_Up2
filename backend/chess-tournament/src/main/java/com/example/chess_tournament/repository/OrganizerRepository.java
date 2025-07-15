package com.example.chess_tournament.repository;

import com.example.chess_tournament.model.Organizer;
import com.example.chess_tournament.model.Player;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface OrganizerRepository extends JpaRepository<Organizer, Long> {
    List<Organizer> findByTournamentId(Long tournamentId);

}
