package com.example.chess_tournament.dto;

import jakarta.validation.constraints.*;

public class PlayerRequest {
    public Long id;

    @NotNull(message = "tournamentId is required")
    public Long tournamentId;

    @NotBlank(message = "name is required")
    public String name;
    public String country;
    public int birthYear;
    public int rating;
    public String gender;
    public long fideId;
    public String email;
    public int kFactor;
    public int extraPoints;
    public boolean disabled;
}
