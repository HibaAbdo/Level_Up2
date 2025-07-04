package com.example.chess_tournament.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class AttendanceRequest {
    @NotEmpty(message = "playerIds must not be empty")
    public List<Long> playerIds;
}
