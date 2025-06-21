package com.example.chess_tournament.controller;

import com.example.chess_tournament.model.Tournament;
import com.example.chess_tournament.repository.TournamentRepository;
import com.example.chess_tournament.utils.TournamentToTRF;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/trf")
public class TrfController {

    @Autowired
    private TournamentRepository tournamentRepository;

    // main use in first round
    @GetMapping("/generate/{tournamentId}")
    public String generateTrf(@PathVariable Long tournamentId) {
        Tournament tournament = tournamentRepository.findById(tournamentId).orElse(null);

        if (tournament == null) {
            return "Tournament not found.";
        }

        String framePath = "src/main/resources/frame.trf"; // Adjust path if needed

        String result = TournamentToTRF.convertToTRF(tournament, framePath);

        return result; // either path or error
    }
}
