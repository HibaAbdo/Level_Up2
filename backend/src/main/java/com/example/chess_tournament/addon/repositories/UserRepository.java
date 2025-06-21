package com.example.chess_tournament.addon.repositories;

import com.example.chess_tournament.addon.models.User;
import com.example.chess_tournament.addon.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    List<User> findByRole(Role role);
}
