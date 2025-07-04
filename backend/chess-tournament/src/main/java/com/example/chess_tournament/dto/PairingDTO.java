package com.example.chess_tournament.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Data Transfer Object used to expose pairing info to the frontend
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PairingDTO {
    private int tableNumber;
    private String whiteName;
    private String blackName;
    private String result;
}
