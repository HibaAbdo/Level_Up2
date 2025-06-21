package com.example.chess_tournament.controller;

import com.example.chess_tournament.service.RecordResultsService;
import com.example.chess_tournament.service.TournamentFlowService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flow")
public class TournamentFlowController {

    private final TournamentFlowService flowService;

    public TournamentFlowController(TournamentFlowService flowService) {
        this.flowService = flowService;
    }

    // starts the first round
    @GetMapping("/start")
    public String startTournament(
            @RequestParam String trfFile,
            @RequestParam(required = false) List<String> tiebreakers) {
        return flowService.startFirstRound(trfFile, tiebreakers);
    }

    // generate next round
    @PostMapping("/next")
    public String runNextRound(
            @RequestBody List<RecordResultsService.MatchInfo> matches,
            @RequestParam String trfFile,
            @RequestParam(required = false) List<String> tiebreakers) {
        return flowService.runRound(matches, trfFile, tiebreakers);
    }

}
