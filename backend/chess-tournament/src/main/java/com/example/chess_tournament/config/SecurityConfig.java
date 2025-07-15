package com.example.chess_tournament.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import static org.springframework.security.config.Customizer.withDefaults;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Allow access to the H2 console without authentication
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/h2-console/**").permitAll() // H2 console access (all subpaths)
                        .anyRequest().permitAll() // Temporarily allow all other requests without restrictions
                )

                // Disable CSRF protection to allow POST/PUT from frontend & H2 console to work
                .csrf(csrf -> csrf.disable())

                // Allow H2 console to be displayed inside an iframe (otherwise blocked by
                // default)
                .headers(headers -> headers
                        .frameOptions(frame -> frame.disable()))

                // Enable CORS to accept requests from frontend (e.g. http://localhost:5173)
                .cors(withDefaults());

        return http.build();
    }
}
