package com.example.chess_tournament.controller;

import org.springframework.web.bind.annotation.*;

import com.example.chess_tournament.service.RecordResultsService;
import com.example.chess_tournament.service.RecordResultsService.MatchInfo;

import java.util.List;

@RestController
@RequestMapping("/api/results")
public class ResultsController {

    private final RecordResultsService resultsService;

    public ResultsController(RecordResultsService resultsService) {
        this.resultsService = resultsService;
    }

    // record round results to TRF
    @PostMapping("/record")
    public String recordResults(
            @RequestBody List<MatchInfo> matches,
            @RequestParam(defaultValue = "report.trf") String trfFile) {
        return resultsService.updateTrfFromResults(matches, trfFile);
    }

}
