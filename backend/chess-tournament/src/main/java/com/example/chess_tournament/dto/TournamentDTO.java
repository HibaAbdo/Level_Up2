package com.example.chess_tournament.dto;

import jakarta.persistence.Column;
import jakarta.validation.constraints.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;

public class TournamentDTO {

    @NotBlank(message = "name is required")
    public String name;

    @NotBlank(message = "city is required")
    public String city;

    @NotBlank(message = "country is required")
    public String country;

    @JsonFormat(pattern = "yyyy-MM-dd")
    public LocalDate startDate;

    @JsonFormat(pattern = "yyyy-MM-dd")
    public LocalDate endDate;

    @Min(value = 1, message = "rounds must be at least 1")
    public int rounds;

    @Min(value = 1, message = "numPlayers must be at least 1")
    public int numPlayers;

    public String type;
    public float byeValue;
    public List<String> tieBreakers;

    @NotBlank(message = "organizerName is required")
    public String organizerName;
    public Long organizerFideId;

    public LocalDateTime creationDate;

    public LocalDateTime lastModified;

    public Boolean archived;

}
