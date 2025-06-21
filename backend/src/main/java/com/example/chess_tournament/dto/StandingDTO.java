package com.example.chess_tournament.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object to expose player standings to the frontend.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class StandingDTO {
    private int playerId;
    private String name;
    private double score;
    private int rank;
}
