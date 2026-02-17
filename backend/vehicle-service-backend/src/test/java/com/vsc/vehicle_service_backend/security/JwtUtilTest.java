package com.vsc.vehicle_service_backend.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class JwtUtilTest {

    private JwtUtil jwtUtil;

    private final String testEmail = "test@example.com";
    private final String secret = "mySuperSecretKeyForJWTTokenGeneration1234567890ABCDEFGH";
    private final Long expiration = 86400000L; // 24 hours

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        ReflectionTestUtils.setField(jwtUtil, "secret", secret);
        ReflectionTestUtils.setField(jwtUtil, "expiration", expiration);
    }

    @Test
    void generateToken_ShouldCreateValidToken() {
        // Act
        String token = jwtUtil.generateToken(testEmail);

        // Assert
        assertThat(token).isNotNull();
        assertThat(token).isNotEmpty();
    }

    @Test
    void extractUsername_ShouldReturnCorrectEmail() {
        // Arrange
        String token = jwtUtil.generateToken(testEmail);

        // Act
        String extractedEmail = jwtUtil.extractUsername(token);

        // Assert
        assertThat(extractedEmail).isEqualTo(testEmail);
    }

    @Test
    void validateToken_WithValidToken_ShouldReturnTrue() {
        // Arrange
        String token = jwtUtil.generateToken(testEmail);

        // Act
        Boolean isValid = jwtUtil.validateToken(token, testEmail);

        // Assert
        assertThat(isValid).isTrue();
    }

    @Test
    void validateToken_WithWrongUsername_ShouldReturnFalse() {
        // Arrange
        String token = jwtUtil.generateToken(testEmail);
        String wrongEmail = "wrong@example.com";

        // Act
        Boolean isValid = jwtUtil.validateToken(token, wrongEmail);

        // Assert
        assertThat(isValid).isFalse();
    }

    @Test
    void extractExpiration_ShouldReturnFutureDate() {
        // Arrange
        String token = jwtUtil.generateToken(testEmail);

        // Act
        var expirationDate = jwtUtil.extractExpiration(token);

        // Assert
        assertThat(expirationDate).isAfter(new java.util.Date());
    }
}