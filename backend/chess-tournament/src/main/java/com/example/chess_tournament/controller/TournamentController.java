package com.example.chess_tournament.controller;

import com.example.chess_tournament.dto.TournamentDTO;
import com.example.chess_tournament.model.Organizer;
import com.example.chess_tournament.model.Tournament;
import com.example.chess_tournament.repository.OrganizerRepository;
import com.example.chess_tournament.repository.TournamentRepository;

import jakarta.validation.Valid;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tournaments")
public class TournamentController {

        @Autowired
        private TournamentRepository tournamentRepository;

        @Autowired
        private OrganizerRepository organizerRepository;

        @GetMapping
        public ResponseEntity<List<Tournament>> getAllTournaments() {
                return ResponseEntity.ok(tournamentRepository.findAll());
        }

        @PostMapping
        public ResponseEntity<Tournament> createTournament(@Valid @RequestBody TournamentDTO req) {
                Organizer org = Organizer.builder()
                                .name(req.organizerName)
                                .fideId(req.organizerFideId)
                                .build();
                Organizer savedOrg = organizerRepository.save(org);

                Tournament t = Tournament.builder()
                                .name(req.name)
                                .city(req.city)
                                .country(req.country)
                                .startDate(req.startDate)
                                .endDate(req.endDate)
                                .rounds(req.rounds)
                                .numPlayers(req.numPlayers)
                                .type(req.type)
                                .ByeValue(req.byeValue)
                                .tieBreakers(req.tieBreakers)
                                .organizer(savedOrg)
                                .build();
                return ResponseEntity.ok(tournamentRepository.save(t));
        }

        @PutMapping("/{id}")
        public Tournament updateTournament(
                        @PathVariable Long id,
                        @Valid @RequestBody TournamentDTO req) {
                Tournament t = tournamentRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Tournament not found"));

                Organizer org = t.getOrganizer();
                org.setName(req.organizerName);
                org.setFideId(req.organizerFideId);
                organizerRepository.save(org);

                t.setName(req.name);
                t.setCity(req.city);
                t.setCountry(req.country);
                t.setStartDate(req.startDate);
                t.setEndDate(req.endDate);
                t.setRounds(req.rounds);
                t.setNumPlayers(req.numPlayers);
                t.setType(req.type);
                t.setByeValue(req.byeValue);
                t.setTieBreakers(req.tieBreakers);

                return tournamentRepository.save(t);
        }

        @GetMapping("/{id}")
        public TournamentDTO getTournament(@PathVariable Long id) {
                Tournament t = tournamentRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Tournament not found"));

                TournamentDTO dto = new TournamentDTO();
                dto.name = t.getName();
                dto.city = t.getCity();
                dto.country = t.getCountry();
                dto.startDate = t.getStartDate();
                dto.endDate = t.getEndDate();
                dto.rounds = t.getRounds();
                dto.numPlayers = t.getNumPlayers();
                dto.type = t.getType();
                dto.byeValue = t.getByeValue();
                dto.tieBreakers = t.getTieBreakers();
                dto.organizerName = t.getOrganizer().getName();
                dto.organizerFideId = t.getOrganizer().getFideId();
                return dto;
        }

}
