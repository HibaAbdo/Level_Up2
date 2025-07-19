package com.example.chess_tournament.controller;

import com.example.chess_tournament.dto.AddArbiterRequest;
import com.example.chess_tournament.dto.TournamentDTO;
import com.example.chess_tournament.dto.UserSummaryDTO;
import com.example.chess_tournament.model.Organizer;
import com.example.chess_tournament.model.Tournament;
import com.example.chess_tournament.model.UserRef;
import com.example.chess_tournament.repository.OrganizerRepository;
import com.example.chess_tournament.repository.TournamentRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.validation.Valid;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tournaments")
public class TournamentController {

        @Autowired
        private TournamentRepository tournamentRepository;

        @Autowired
        private OrganizerRepository organizerRepository;

        @Autowired
        private EntityManager entityManager;

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
                                .creationDate(LocalDateTime.now())
                                .lastModified(LocalDateTime.now())
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
                t.setLastModified(LocalDateTime.now());

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
                dto.creationDate = t.getCreationDate();
                dto.lastModified = t.getLastModified();
                return dto;
        }

        @PostMapping("/add-arbiter")
        public ResponseEntity<String> addOrCreateArbiter(@RequestBody AddArbiterRequest req) {
                Tournament tournament = tournamentRepository.findById(req.tournamentId).orElseThrow();

                UserRef userRef;

                try {
                        Object result = entityManager
                                        .createQuery("SELECT u.id FROM UserRef u WHERE u.username = :username")
                                        .setParameter("username", req.username)
                                        .getSingleResult();
                        Long userId = (Long) result;
                        userRef = new UserRef(userId, req.username);
                } catch (NoResultException e) {
                        // create new user
                        entityManager.createNativeQuery("INSERT INTO users (username, password, role) VALUES (?, ?, ?)")
                                        .setParameter(1, req.username)
                                        .setParameter(2, req.password)
                                        .setParameter(3, "ARBITER")
                                        .executeUpdate();

                        Object result = entityManager
                                        .createQuery("SELECT u.id FROM UserRef u WHERE u.username = :username")
                                        .setParameter("username", req.username)
                                        .getSingleResult();
                        Long newId = (Long) result;
                        userRef = new UserRef(newId, req.username);
                }

                tournament.getArbiters().add(userRef);
                tournamentRepository.save(tournament);

                return ResponseEntity.ok("Arbiter added");
        }

        @GetMapping("/my-tournaments")
        public ResponseEntity<List<Tournament>> getMyTournaments() {
                return ResponseEntity.ok(tournamentRepository.findAll());
        }

        @DeleteMapping("/{tournamentId}/remove-arbiter/{username}")
        public ResponseEntity<String> removeArbiterFromTournament(
                        @PathVariable Long tournamentId,
                        @PathVariable String username) {

                Tournament tournament = tournamentRepository.findById(tournamentId).orElseThrow();

                // get the arbiter
                List<UserRef> matched = tournament.getArbiters().stream()
                                .filter(a -> a.getUsername().equals(username))
                                .toList();

                if (matched.isEmpty()) {
                        return ResponseEntity.badRequest().body("Arbiter not assigned to tournament");
                }

                // delete the relation only
                tournament.getArbiters().removeAll(matched);
                tournamentRepository.save(tournament);

                return ResponseEntity.ok("Arbiter removed from tournament");
        }

        @GetMapping("/{id}/arbiters")
        public ResponseEntity<List<UserSummaryDTO>> getArbitersForTournament(@PathVariable Long id) {
                Tournament tournament = tournamentRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Tournament not found"));

                List<UserSummaryDTO> arbiters = tournament.getArbiters().stream()
                                .map(user -> new UserSummaryDTO(user.getId(), user.getUsername()))
                                .toList();

                return ResponseEntity.ok(arbiters);
        }

        @PutMapping("/{id}/archive")
        public ResponseEntity<String> archiveTournament(@PathVariable Long id) {
                Tournament t = tournamentRepository.findById(id)
                                .orElseThrow(() -> new RuntimeException("Tournament not found"));
                t.setArchived(true);
                tournamentRepository.save(t);
                return ResponseEntity.ok("Tournament archived");
        }

        @GetMapping("/archived")
        public ResponseEntity<List<Tournament>> getArchivedTournaments(
                        @AuthenticationPrincipal UserDetails userDetails) {
                List<Tournament> archived = tournamentRepository.findByArchivedTrue();
                return ResponseEntity.ok(archived);
        }

}
