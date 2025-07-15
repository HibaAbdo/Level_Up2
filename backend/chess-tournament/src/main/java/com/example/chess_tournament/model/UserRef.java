package com.example.chess_tournament.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "users") // the same name of the entity in tournament_system
public class UserRef {
    @Id
    private Long id;

    private String username;
}
