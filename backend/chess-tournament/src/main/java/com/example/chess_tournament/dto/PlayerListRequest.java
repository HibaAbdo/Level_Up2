package com.example.chess_tournament.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class PlayerListRequest {
    @NotNull(message = "tournamentId is required")
    public Long tournamentId;

    @NotEmpty(message = "names list must not be empty")
    public List<String> names;
}
