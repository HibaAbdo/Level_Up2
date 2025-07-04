package com.example.TournamentSetup.service;

import com.example.TournamentSetup.models.Role;
import com.example.TournamentSetup.models.User;
import com.example.TournamentSetup.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // bring all users
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // Bring users depending on their role
    public List<User> getAllUsersByRole(Role role) {
        return userRepository.findByRole(role);
    }

    // add general user (used by other functions)
    public void saveUser(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    // delete user dependings on ID
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    // add organizer
    public void addOrganizer(User organizer) {
        organizer.setPassword(passwordEncoder.encode(organizer.getPassword()));
        organizer.setRole(Role.ORGANIZER);
        userRepository.save(organizer);
    }

    // add arbiter
    public void addArbiter(User arbiter) {
        arbiter.setPassword(passwordEncoder.encode(arbiter.getPassword()));
        arbiter.setRole(Role.ARBITER);
        userRepository.save(arbiter);
    }

    // temp users (temp function for testing)
    @PostConstruct
    public void initTempUsers() {
        if (userRepository.findByUsername("admin").isEmpty()) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("adm123"));
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
            System.out.println("Temp Admin Created: admin/adm123");
        }

        if (userRepository.findByUsername("organizer").isEmpty()) {
            User organizer = new User();
            organizer.setUsername("organizer");
            organizer.setPassword(passwordEncoder.encode("org123"));
            organizer.setRole(Role.ORGANIZER);
            userRepository.save(organizer);
            System.out.println("Temp Organizer Created: organizer/org123");
        }

        if (userRepository.findByUsername("arbiter").isEmpty()) {
            User arbiter = new User();
            arbiter.setUsername("arbiter");
            arbiter.setPassword(passwordEncoder.encode("arb123"));
            arbiter.setRole(Role.ARBITER);
            userRepository.save(arbiter);
            System.out.println("Temp Arbiter Created: arbiter/arb123");
        }
    }
}
