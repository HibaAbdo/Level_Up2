package com.example.chess_tournament.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class MatchInfo {
    @NotNull(message = "whiteId is required")
    public Integer whiteId;

    @NotNull(message = "blackId is required")
    public Integer blackId;

    @NotNull(message = "result is required")
    public String result;
}
