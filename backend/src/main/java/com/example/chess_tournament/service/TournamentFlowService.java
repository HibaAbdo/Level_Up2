package com.example.chess_tournament.service;

import com.example.chess_tournament.service.RecordResultsService.MatchInfo;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TournamentFlowService {

    private final RecordResultsService resultsService;
    private final JaVaFoService javaFoService;

    public TournamentFlowService(RecordResultsService resultsService, JaVaFoService javaFoService) {
        this.resultsService = resultsService;
        this.javaFoService = javaFoService;
    }

    // record round results and generate next round pairings
    public String runRound(List<MatchInfo> matches, String trfFile, List<String> tieBreakers) {
        String recordResult = resultsService.updateTrfFromResults(matches, trfFile);
        if (!recordResult.startsWith("R") && !recordResult.startsWith("Results"))
            return recordResult;

        String pairingResult = javaFoService.runPairing(trfFile, tieBreakers);
        return recordResult + "\n" + pairingResult;
    }

    // starting first round in tournament
    public String startFirstRound(String trfFile, List<String> tieBreakers) {
        return javaFoService.runPairing(trfFile, tieBreakers);
    }
}
