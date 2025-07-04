package com.example.chess_tournament.controller;

import com.example.chess_tournament.model.Tournament;
import com.example.chess_tournament.repository.TournamentRepository;
import com.example.chess_tournament.service.JaVaFoService;
import com.example.chess_tournament.service.RecordResultsService;
import com.example.chess_tournament.service.StandingsService;
import com.example.chess_tournament.dto.MatchInfo;
import com.example.chess_tournament.dto.PairingDTO;
import com.example.chess_tournament.dto.StandingDTO;
import com.example.chess_tournament.utils.TournamentToTRF;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/flow")
public class TournamentFlowController {

    private final JaVaFoService javaFoService;
    private final TournamentRepository tournamentRepository;
    private final RecordResultsService resultsService;
    private final StandingsService standingsService;

    private final String TRF_PATH = "output/report.trf";

    public TournamentFlowController(
            JaVaFoService javaFoService,
            TournamentRepository tournamentRepository,
            RecordResultsService resultsService,
            StandingsService standingsService) {
        this.javaFoService = javaFoService;
        this.tournamentRepository = tournamentRepository;
        this.resultsService = resultsService;
        this.standingsService = standingsService;
    }

    // Endpoint: generate TRF from tournament
    @GetMapping("/generate-trf/{tournamentId}")
    public ResponseEntity<?> generateTrf(@PathVariable Long tournamentId) {
        Tournament tournament = tournamentRepository.findById(tournamentId).orElse(null);

        if (tournament == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Tournament not found"));
        }

        try {
            TournamentToTRF.convertToTRF(tournament, "src/main/resources/frame.trf");
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "TRF generated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", "Failed to generate TRF",
                            "details", e.getMessage()));
        }
    }

    // Endpoint: start first round
    @GetMapping("/start")
    public ResponseEntity<?> startFirstRound(
            @RequestParam(required = false) List<String> tiebreakers) {
        File trfFile = new File(TRF_PATH);
        if (!trfFile.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("status", "error", "message", "TRF file not found"));
        }

        try {
            Map<String, Object> result = javaFoService.runPairing(TRF_PATH, tiebreakers);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", "Failed to generate first round",
                            "details", e.getMessage()));
        }
    }

    // Endpoint: generate next reound after recording results
    @PostMapping("/next")
    public ResponseEntity<?> runNextRound(
            @RequestBody List<MatchInfo> matches,
            @RequestParam(required = false) List<String> tiebreakers) {
        File trfFile = new File(TRF_PATH);
        if (!trfFile.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("status", "error", "message", "TRF file not found"));
        }

        // first: record results
        try {
            Map<String, Object> recordResult = resultsService.updateTrfFromResults(matches, TRF_PATH);
            if (!"success".equals(recordResult.get("status"))) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(recordResult);
            }

            // then, generate pairings for next round
            Map<String, Object> pairingResult = javaFoService.runPairing(TRF_PATH, tiebreakers);
            if (!"success".equals(pairingResult.get("status"))) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(pairingResult);
            }

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Results recorded and next round generated"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", "Failed to process round",
                            "details", e.getMessage()));
        }
    }

    // Endpoint: generate pairings manually
    @GetMapping("/generate")
    public ResponseEntity<?> generatePairing(
            @RequestParam(required = false) List<String> tiebreakers) {
        File trfFile = new File(TRF_PATH);
        if (!trfFile.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("status", "error", "message", "TRF file not found"));
        }

        try {
            Map<String, Object> result = javaFoService.runPairing(TRF_PATH, tiebreakers);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", "Failed to generate pairings",
                            "details", e.getMessage()));
        }
    }

    // Endpoint: generate pairings after generating TRF (for first round)
    @GetMapping("/generate2")
    public ResponseEntity<?> generatePairingFromTournament(
            @RequestParam Long tournamentId,
            @RequestParam(required = false) List<String> tiebreakers) {
        Tournament tournament = tournamentRepository.findById(tournamentId).orElse(null);

        if (tournament == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("status", "error", "message", "Tournament not found"));
        }

        try {
            String frameFile = "src/main/resources/frame.trf";
            String trfFile = TournamentToTRF.convertToTRF(tournament, frameFile);

            Map<String, Object> result = javaFoService.runPairing(trfFile, tiebreakers);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", "Failed to generate first round",
                            "details", e.getMessage()));
        }
    }

    // Endpoint: return current pairings
    @GetMapping("/current")
    public ResponseEntity<?> getCurrentPairings() {
        File trfFile = new File(TRF_PATH);
        if (!trfFile.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("status", "error", "message", "TRF file not found"));
        }

        try {
            List<PairingDTO> pairings = javaFoService.getCurrentPairings(TRF_PATH);
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "pairings", pairings));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", "Failed to get current pairings",
                            "details", e.getMessage()));
        }
    }

    // Endpoint: record round results only (without generating next round)
    @PostMapping("/record")
    public ResponseEntity<?> recordResults(
            @RequestBody List<MatchInfo> matches) {
        File trfFile = new File(TRF_PATH);
        if (!trfFile.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("status", "error", "message", "TRF file not found"));
        }

        try {
            Map<String, Object> result = resultsService.updateTrfFromResults(matches, TRF_PATH);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", "Failed to record results",
                            "details", e.getMessage()));
        }
    }

    // Endpoint: return current standings
    @GetMapping("/standings")
    public ResponseEntity<?> getStandings() {
        File trfFile = new File(TRF_PATH);
        if (!trfFile.exists()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("status", "error", "message", "TRF file not found"));
        }

        try {
            Map<String, Object> standings = standingsService.getStandings(TRF_PATH);
            return ResponseEntity.ok(standings);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of(
                            "status", "error",
                            "message", "Failed to get standings",
                            "details", e.getMessage()));
        }
    }
}
