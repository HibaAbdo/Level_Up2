package com.example.chess_tournament.service;

import com.example.chess_tournament.model.Player;
import com.example.chess_tournament.model.Round;
import com.example.chess_tournament.model.Violation;
import com.example.chess_tournament.repository.PlayerRepository;
import com.example.chess_tournament.repository.RoundRepository;
import com.example.chess_tournament.repository.ViolationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ViolationService {

    @Autowired
    private ViolationRepository violationRepository;

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private RoundRepository roundRepository;

    public List<Violation> getViolationsByPlayer(Long playerId) {
        return violationRepository.findByPlayerId(playerId);
    }

    public List<Violation> getViolationsByTournament(Long tournamentId) {
        return violationRepository.findByRoundTournamentId(tournamentId);
    }

    public Violation createViolation(Long playerId, Long roundId, String type, String description) {
        Player player = playerRepository.findById(playerId)
                .orElseThrow(() -> new RuntimeException("Player not found"));

        Round round = roundRepository.findById(roundId)
                .orElseThrow(() -> new RuntimeException("Round not found"));

        Violation violation = Violation.builder()
                .player(player)
                .round(round)
                .type(type)
                .description(description != null ? description : "")
                .build();

        return violationRepository.save(violation);
    }

    public void deleteViolation(Long violationId) {
        Violation v = violationRepository.findById(violationId)
                .orElseThrow(() -> new RuntimeException("Violation not found"));
        violationRepository.delete(v);
    }
}
