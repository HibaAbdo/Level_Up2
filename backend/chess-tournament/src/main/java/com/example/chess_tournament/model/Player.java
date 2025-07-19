package com.example.chess_tournament.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Player {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String country;
    private int birthYear;
    private int rating;
    private String gender;
    private Long fideId;
    private String email;
    private int kFactor;
    private int extraPoints;
    private boolean disabled;

    // 0 = not confirmed, 1 = confirmed
    private int confirmAttendance;
    @JsonIgnore

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tournament_id", nullable = false)
    private Tournament tournament;
}
