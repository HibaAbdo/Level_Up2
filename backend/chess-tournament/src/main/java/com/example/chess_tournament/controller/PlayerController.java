package com.example.chess_tournament.controller;

import com.example.chess_tournament.model.Player;
import com.example.chess_tournament.model.Tournament;
import com.example.chess_tournament.repository.PlayerRepository;
import com.example.chess_tournament.repository.TournamentRepository;

import com.example.chess_tournament.dto.PlayerRequest;
import com.example.chess_tournament.dto.PlayerListRequest;
import com.example.chess_tournament.dto.AttendanceRequest;

import java.util.LinkedList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/players")
public class PlayerController {

    @Autowired
    private PlayerRepository playerRepository;

    @Autowired
    private TournamentRepository tournamentRepository;

    // Create or edit one player
 @PostMapping("/bulk")
    public List<Player> addPlayersBulk(@RequestBody PlayerListRequest request) {
        Tournament tournament = tournamentRepository.findById(request.tournamentId).orElse(null);
        if (tournament == null)
            return null;
        List<Player> players = new LinkedList<>();
        for (String name : request.names) {
            Player player = new Player();
            player.setName(name);
            player.setCountry("ISR");
            player.setBirthYear(2005);
            player.setRating(1200);
            player.setGender("m");
            player.setFideId(0);
            player.setConfirmAttendance(0);
            player.setTournament(tournament);
            players.add(player);
        }
        return playerRepository.saveAll(players);

//        return "" + request.names.size() + " players were added successfully";
    }

    // Confirm players' attendance
    @PutMapping("/attendance")
    public String confirmAttendance(@RequestBody AttendanceRequest request) {
        for (Long playerId : request.playerIds) {
            Player player = playerRepository.findById(playerId).orElse(null);
            if (player != null) {
                player.setConfirmAttendance(1);
                playerRepository.save(player);
            }
        }
        return "attendance for" + request.playerIds.size() + " players was updated";
    }
// جلب اللاعبين حسب البطولة
@GetMapping
public List<Player> getPlayersByTournament(@RequestParam Long tournamentId) {
    return playerRepository.findByTournamentId(tournamentId);
}



}
