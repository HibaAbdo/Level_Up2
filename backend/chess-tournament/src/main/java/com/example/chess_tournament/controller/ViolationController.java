package com.example.chess_tournament.controller;

import com.example.chess_tournament.model.Violation;
import com.example.chess_tournament.service.ViolationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/violations")
@CrossOrigin("*")
public class ViolationController {

    @Autowired
    private ViolationService violationService;

    @GetMapping("/player/{playerId}")
    public ResponseEntity<?> getByPlayer(@PathVariable Long playerId) {
        List<Violation> violations = violationService.getViolationsByPlayer(playerId);
        return ResponseEntity.ok(violations);
    }

    @GetMapping("/tournament/{tournamentId}")
    public ResponseEntity<?> getByTournament(@PathVariable Long tournamentId) {
        List<Violation> violations = violationService.getViolationsByTournament(tournamentId);
        return ResponseEntity.ok(violations);
    }

    @PostMapping
    public ResponseEntity<?> create(
            @RequestParam Long playerId,
            @RequestParam Long roundId,
            @RequestParam String type,
            @RequestParam(required = false) String description) {
        Violation created = violationService.createViolation(playerId, roundId, type, description);
        return ResponseEntity.ok(created);
    }

    @DeleteMapping("/{violationId}")
    public ResponseEntity<?> delete(@PathVariable Long violationId) {
        violationService.deleteViolation(violationId);
        return ResponseEntity.ok().build();
    }
}
