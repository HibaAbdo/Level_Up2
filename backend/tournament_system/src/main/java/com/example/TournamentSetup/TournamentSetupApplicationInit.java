// package com.example.TournamentSetup;

// import com.example.TournamentSetup.models.Role;
// import com.example.TournamentSetup.models.User;
// import com.example.TournamentSetup.repositories.UserRepository;
// import org.springframework.boot.CommandLineRunner;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.crypto.password.PasswordEncoder;

// @Configuration
// public class TournamentSetupApplicationInit {

// @Bean
// public CommandLineRunner initializeOrganizer(UserRepository userRepository,
// PasswordEncoder passwordEncoder) {
// return args -> {
// String defaultUsername = "organizer";
// String defaultPassword = "org123";

// boolean organizerExists =
// userRepository.findByUsername(defaultUsername).isPresent();

// if (!organizerExists) {
// User organizer = new User(defaultUsername,
// passwordEncoder.encode(defaultPassword), Role.ORGANIZER);
// userRepository.save(organizer);
// System.out.println("✅ Default organizer created: organizer / org123");
// } else {
// System.out.println("ℹ️ Organizer already exists.");
// }
// };
// }
// }
