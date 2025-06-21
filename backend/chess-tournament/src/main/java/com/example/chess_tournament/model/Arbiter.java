package com.example.chess_tournament.model;

import jakarta.persistence.*;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "arbiters")
public class Arbiter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String title; // e.g., IA (International Arbiter)

    @Column(name = "fide_id")
    private long fideId;

}
