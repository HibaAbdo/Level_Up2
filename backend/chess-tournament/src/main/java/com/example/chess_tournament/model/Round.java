package com.example.chess_tournament.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "rounds")
public class Round {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "round_number")
    private int roundNumber;

    @Column(name = "round_completed")
    private boolean completed;

    @OneToMany(mappedBy = "round", cascade = CascadeType.ALL)
    private List<Match> matches;

    @ManyToOne
    @JoinColumn(name = "tournament_id")
    private Tournament tournament;
}
