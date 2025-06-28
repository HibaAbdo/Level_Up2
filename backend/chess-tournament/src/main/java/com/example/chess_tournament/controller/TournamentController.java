// src/main/java/com/example/chess_tournament/controller/TournamentController.java
package com.example.chess_tournament.controller;

import com.example.chess_tournament.dto.TournamentDTO;
import com.example.chess_tournament.model.Arbiter;
import com.example.chess_tournament.model.Tournament;
import com.example.chess_tournament.repository.ArbiterRepository;
import com.example.chess_tournament.repository.TournamentRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tournaments")
public class TournamentController {

    @Autowired
    private TournamentRepository tournamentRepository;

    @Autowired
    private ArbiterRepository arbiterRepository;

    @PostMapping
    public Tournament createTournament(@RequestBody TournamentDTO req) {
        Arbiter arb = Arbiter.builder()
                .name(req.arbiterName)
                .fideId(req.arbiterFideId)
                .build();
        Arbiter savedArb = arbiterRepository.save(arb);

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
                .tieBreakers(req.tieBreakers.toArray(new String[0]))
                .arbiter(savedArb)
                .build();
        return tournamentRepository.save(t);
    }

    @PutMapping("/{id}")
    public Tournament updateTournament(
            @PathVariable Long id,
            @RequestBody TournamentDTO req) {
        Tournament t = tournamentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));

        Arbiter arb = t.getArbiter();
        arb.setName(req.arbiterName);
        arb.setFideId(req.arbiterFideId);
        arbiterRepository.save(arb);

        t.setName(req.name);
        t.setCity(req.city);
        t.setCountry(req.country);
        t.setStartDate(req.startDate);
        t.setEndDate(req.endDate);
        t.setRounds(req.rounds);
        t.setNumPlayers(req.numPlayers);
        t.setType(req.type);
        t.setByeValue(req.byeValue);
        t.setTieBreakers(req.tieBreakers.toArray(new String[0]));

        return tournamentRepository.save(t);
    }
}
 //   @GetMapping("/{id}")
//     public TournamentDTO getTournament(@PathVariable Long id) {
//         Tournament t = tournamentRepository.findById(id)
//                 .orElseThrow(() -> new RuntimeException("Tournament not found"));

//         TournamentDTO dto = new TournamentDTO();
//         dto.name = t.getName();
//         dto.city = t.getCity();
//         dto.country = t.getCountry();
//         dto.startDate = t.getStartDate();
//         dto.endDate = t.getEndDate();
//         dto.rounds = t.getRounds();
//         dto.numPlayers = t.getNumPlayers();
//         dto.type = t.getType();
//         dto.byeValue = t.getByeValue();
//         dto.tieBreakers = List.of(t.getTieBreakers());
//         dto.arbiterName = t.getArbiter().getName();
//         dto.arbiterFideId = t.getArbiter().getFideId();
//         return dto;
//     }
// }