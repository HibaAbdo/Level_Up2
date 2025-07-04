package com.example.chess_tournament.service;

import com.example.chess_tournament.dto.MatchInfo;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class TournamentFlowService {

    private final RecordResultsService resultsService;
    private final JaVaFoService javaFoService;

    public TournamentFlowService(RecordResultsService resultsService, JaVaFoService javaFoService) {
        this.resultsService = resultsService;
        this.javaFoService = javaFoService;
    }

    // record round results and generate next round pairings
    public Map<String, Object> runRound(List<MatchInfo> matches, String trfFile, List<String> tieBreakers) {
        Map<String, Object> recordResult = resultsService.updateTrfFromResults(matches, trfFile);

        if (!"success".equals(recordResult.get("status"))) {
            return recordResult;
        }

        Map<String, Object> pairingResult = javaFoService.runPairing(trfFile, tieBreakers);
        if (!"success".equals(pairingResult.get("status"))) {
            return pairingResult;
        }

        return Map.of(
                "status", "success",
                "message", "Results recorded and next round generated.");
    }

    // starting first round in tournament
    public Map<String, Object> startFirstRound(String trfFile, List<String> tieBreakers) {
        Map<String, Object> result = javaFoService.runPairing(trfFile, tieBreakers);
        return result;
    }
}
