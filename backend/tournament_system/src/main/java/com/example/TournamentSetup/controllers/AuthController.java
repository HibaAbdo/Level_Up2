package com.example.TournamentSetup.controllers;

import com.example.TournamentSetup.models.User;
import com.example.TournamentSetup.repositories.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {

        // look for the user in DB
        Optional<User> optionalUser = userRepository.findByUsername(user.getUsername());
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(404).body("User not found");
        }

        User foundUser = optionalUser.get();

        // Check if password is encrypted
        if (!passwordEncoder.matches(user.getPassword(), foundUser.getPassword())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        // Prepare JSON response
        Map<String, Object> response = new HashMap<>();
        response.put("username", foundUser.getUsername());
        response.put("role", foundUser.getRole());

        return ResponseEntity.ok(response);

    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        // check if username already exists
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists");
        }

        // Encrypt password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // save user in DB
        User saved = userRepository.save(user);

        // return response with user data
        return ResponseEntity.ok(saved);
    }

}