package com.example.chess_tournament.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "players")
public class Player {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // database id

    @Column(name = "player_id")
    private int playerId; // player's number in TRF

    private String gender;

    private String name;

    private int rating;

    @Column(name = "birth_year")
    private int birthYear;

    private String country;

    @Column(name = "fide_id")
    private long fideId;

    @Column(name = "total_score")
    private double score;

    private int rank;

    @ManyToOne
    @JoinColumn(name = "tournament_id")
    private Tournament tournament;

    @OneToMany(mappedBy = "whitePlayer", cascade = CascadeType.ALL)
    private List<Match> matchesAsWhite;

    @OneToMany(mappedBy = "blackPlayer", cascade = CascadeType.ALL)
    private List<Match> matchesAsBlack;

}
