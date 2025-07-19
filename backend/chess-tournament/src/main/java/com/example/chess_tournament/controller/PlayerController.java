package com.example.chess_tournament.controller;

import com.example.chess_tournament.dto.PlayerRequest;
import com.example.chess_tournament.dto.PlayerListRequest;
import com.example.chess_tournament.dto.AttendanceRequest;
import com.example.chess_tournament.model.Player;
import com.example.chess_tournament.model.Tournament;
import com.example.chess_tournament.repository.PlayerRepository;
import com.example.chess_tournament.repository.TournamentRepository;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedList;
import java.util.List;
import java.util.Map;

@Validated
@RestController
@RequestMapping("/api/players")
public class PlayerController {

    @Autowired
    private PlayerRepository playerRepository;
    @Autowired
    private TournamentRepository tournamentRepository;

    @GetMapping
    public List<Player> getPlayers(@RequestParam Long tournamentId) {
        return playerRepository.findByTournamentId(tournamentId);
    }

    @PostMapping
    public ResponseEntity<Player> addOrUpdatePlayer(@Valid @RequestBody PlayerRequest req) {
        Tournament t = tournamentRepository.findById(req.tournamentId)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));

        Player p = (req.id != null)
                ? playerRepository.findById(req.id)
                        .orElseThrow(() -> new RuntimeException("Player not found"))
                : new Player();

        p.setTournament(t);
        p.setName(req.name);
        p.setCountry(req.country);
        p.setBirthYear(req.birthYear);
        p.setRating(req.rating);
        p.setGender(req.gender);
        p.setFideId(req.fideId);
        p.setEmail(req.email);
        p.setKFactor(req.kFactor);
        p.setExtraPoints(req.extraPoints);
        p.setDisabled(req.disabled);
        if (req.id == null)
            p.setConfirmAttendance(0);

        return ResponseEntity.ok(playerRepository.save(p));
    }

    @PostMapping("/bulk")
    public ResponseEntity<?> addPlayersBulk(@Valid @RequestBody PlayerListRequest req) {

        if (req.names == null || req.names.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", "Player names list cannot be empty"));
        }

        Tournament t = tournamentRepository.findById(req.tournamentId)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));

        List<Player> list = new LinkedList<>();
        for (String name : req.names) {
            Player p = new Player();
            p.setTournament(t);
            p.setName(name);
            p.setCountry("ISR");
            p.setBirthYear(2000);
            p.setRating(1200);
            p.setGender("m");
            p.setFideId(null);
            p.setEmail("");
            p.setKFactor(20);
            p.setExtraPoints(0);
            p.setDisabled(false);
            p.setConfirmAttendance(0);
            list.add(p);
        }
        return ResponseEntity.ok(playerRepository.saveAll(list));
    }

    @PutMapping("/attendance")
    public ResponseEntity<?> confirmAttendance(@Valid @RequestBody AttendanceRequest req) {
        for (Long pid : req.playerIds) {
            Player p = playerRepository.findById(pid)
                    .orElseThrow(() -> new RuntimeException("Player not found"));
            p.setConfirmAttendance(1);
            playerRepository.save(p);
        }
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Updated " + req.playerIds.size() + " players"));
    }

}
