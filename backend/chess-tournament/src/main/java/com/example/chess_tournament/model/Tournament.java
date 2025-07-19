package com.example.chess_tournament.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "tournaments")
public class Tournament {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String country;
    private String city;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    private int rounds;

    private String status;

    @Column(name = "number_of_players")
    private int numPlayers;

    private String type; // e.g., "Individual Swiss Dutch"

    @Column(name = "bye_value")
    private float ByeValue;

    @ElementCollection
    @CollectionTable(name = "tournament_tie_breakers", joinColumns = @JoinColumn(name = "tournament_id"))
    @Column(name = "tie_breakers")
    private List<String> tieBreakers;

    @ManyToOne
    @JoinColumn(name = "organizer_id")
    private Organizer organizer;

    @OneToMany(mappedBy = "tournament", cascade = CascadeType.ALL)
    private List<Player> players;

    @OneToMany(mappedBy = "tournament", cascade = CascadeType.ALL)
    private List<Round> roundsList;

    @ManyToMany
    @JoinTable(name = "tournament_arbiters", joinColumns = @JoinColumn(name = "tournament_id"), inverseJoinColumns = @JoinColumn(name = "user_id"))
    private Set<UserRef> arbiters = new HashSet<>();

    @Column(name = "archived")
    private Boolean archived = false;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")

    @Column(name = "creation_date")
    private LocalDateTime creationDate;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm")

    @Column(name = "last_modified")
    private LocalDateTime lastModified;

}
