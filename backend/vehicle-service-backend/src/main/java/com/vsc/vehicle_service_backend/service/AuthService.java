package com.vsc.vehicle_service_backend.service;

import com.vsc.vehicle_service_backend.dto.AuthResponse;
import com.vsc.vehicle_service_backend.dto.LoginRequest;
import com.vsc.vehicle_service_backend.dto.RegisterRequest;
import com.vsc.vehicle_service_backend.entity.User;
import com.vsc.vehicle_service_backend.repository.UserRepository;
import com.vsc.vehicle_service_backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthResponse register(RegisterRequest request) {
        log.info("=== START REGISTER ===");
        log.info("Email: {}", request.getEmail());

        try {
            // Check if user already exists
            boolean exists = userRepository.existsByEmail(request.getEmail());
            log.info("User exists check: {}", exists);

            if (exists) {
                return AuthResponse.builder()
                        .message("Email already registered")
                        .build();
            }

            // Create new user
            User user = new User();
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setEmail(request.getEmail());

            String encodedPassword = passwordEncoder.encode(request.getPassword());
            user.setPassword(encodedPassword);

            user.setPhone(request.getPhone());
            user.setRole("USER");

            User savedUser = userRepository.save(user);
            log.info("User saved with ID: {}", savedUser.getId());

            // Generate token
            String token = jwtUtil.generateToken(user.getEmail());
            log.info("Token generated");

            return AuthResponse.builder()
                    .token(token)
                    .email(user.getEmail())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .role(user.getRole())
                    .message("Registration successful")
                    .build();

        } catch (Exception e) {
            log.error("Register error: ", e);
            throw e;
        }
    }

    public AuthResponse login(LoginRequest request) {
        log.info("=== START LOGIN ===");
        log.info("Email: {}", request.getEmail());

        try {
            // Find user by email
            Optional<User> userOptional = userRepository.findByEmail(request.getEmail());
            log.info("User found: {}", userOptional.isPresent());

            if (userOptional.isEmpty()) {
                return AuthResponse.builder()
                        .message("Invalid email or password")
                        .build();
            }

            User user = userOptional.get();
            log.info("User: {} {}, Password in DB: {}",
                    user.getFirstName(), user.getLastName(),
                    user.getPassword().substring(0, Math.min(20, user.getPassword().length())) + "...");

            // Verify password
            boolean passwordMatches = passwordEncoder.matches(request.getPassword(), user.getPassword());
            log.info("Password matches: {}", passwordMatches);

            if (!passwordMatches) {
                return AuthResponse.builder()
                        .message("Invalid email or password")
                        .build();
            }

            // Generate token
            String token = jwtUtil.generateToken(user.getEmail());
            log.info("Token generated");

            return AuthResponse.builder()
                    .token(token)
                    .email(user.getEmail())
                    .firstName(user.getFirstName())
                    .lastName(user.getLastName())
                    .role(user.getRole())
                    .message("Login successful")
                    .build();

        } catch (Exception e) {
            log.error("Login error: ", e);
            throw e;
        }
    }
}