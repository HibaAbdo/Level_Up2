package com.example.chess_tournament.controller;

import com.example.chess_tournament.dto.StandingDTO;
import com.example.chess_tournament.service.StandingsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/standings")
public class StandingsController {

    private final StandingsService standingsService;

    public StandingsController(StandingsService standingsService) {
        this.standingsService = standingsService;
    }

    // returns current standings from TRF
    @GetMapping
    public List<StandingDTO> getStandings(@RequestParam(defaultValue = "report.trf") String trfFile) {
        return standingsService.getStandings(trfFile);
    }
}
