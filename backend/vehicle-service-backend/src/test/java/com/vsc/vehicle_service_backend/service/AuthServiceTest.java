package com.vsc.vehicle_service_backend.service;

import com.vsc.vehicle_service_backend.dto.AuthResponse;
import com.vsc.vehicle_service_backend.dto.LoginRequest;
import com.vsc.vehicle_service_backend.dto.RegisterRequest;
import com.vsc.vehicle_service_backend.entity.User;
import com.vsc.vehicle_service_backend.repository.UserRepository;
import com.vsc.vehicle_service_backend.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private User testUser;
    private final String testEmail = "test@example.com";
    private final String testPassword = "password123";
    private final String encodedPassword = "$2a$10$encodedPasswordHash";
    private final String testToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.token";

    @BeforeEach
    void setUp() {
        // Setup Register Request
        registerRequest = new RegisterRequest();
        registerRequest.setFirstName("John");
        registerRequest.setLastName("Doe");
        registerRequest.setEmail(testEmail);
        registerRequest.setPassword(testPassword);
        registerRequest.setPhone("1234567890");

        // Setup Login Request
        loginRequest = new LoginRequest();
        loginRequest.setEmail(testEmail);
        loginRequest.setPassword(testPassword);

        // Setup Test User
        testUser = new User();
        testUser.setId(1L);
        testUser.setFirstName("John");
        testUser.setLastName("Doe");
        testUser.setEmail(testEmail);
        testUser.setPassword(encodedPassword);
        testUser.setPhone("1234567890");
        testUser.setRole("USER");
    }

    @Test
    void register_WithValidData_ShouldRegisterUserAndReturnToken() {
        // Arrange
        when(userRepository.existsByEmail(testEmail)).thenReturn(false);
        when(passwordEncoder.encode(testPassword)).thenReturn(encodedPassword);
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtUtil.generateToken(testEmail)).thenReturn(testToken);

        // Act
        AuthResponse response = authService.register(registerRequest);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getToken()).isEqualTo(testToken);
        assertThat(response.getEmail()).isEqualTo(testEmail);
        assertThat(response.getFirstName()).isEqualTo("John");
        assertThat(response.getLastName()).isEqualTo("Doe");
        assertThat(response.getRole()).isEqualTo("USER");
        assertThat(response.getMessage()).isEqualTo("Registration successful");

        verify(userRepository, times(1)).existsByEmail(testEmail);
        verify(passwordEncoder, times(1)).encode(testPassword);
        verify(userRepository, times(1)).save(any(User.class));
        verify(jwtUtil, times(1)).generateToken(testEmail);
    }

    @Test
    void register_WithExistingEmail_ShouldReturnErrorMessage() {
        // Arrange
        when(userRepository.existsByEmail(testEmail)).thenReturn(true);

        // Act
        AuthResponse response = authService.register(registerRequest);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getToken()).isNull();
        assertThat(response.getMessage()).isEqualTo("Email already registered");

        verify(userRepository, times(1)).existsByEmail(testEmail);
        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, never()).save(any(User.class));
        verify(jwtUtil, never()).generateToken(anyString());
    }

    @Test
    void register_WhenExceptionOccurs_ShouldThrowException() {
        // Arrange
        when(userRepository.existsByEmail(testEmail)).thenThrow(new RuntimeException("Database error"));

        // Act & Assert
        assertThatThrownBy(() -> authService.register(registerRequest))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Database error");

        verify(userRepository, times(1)).existsByEmail(testEmail);
        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void login_WithValidCredentials_ShouldReturnToken() {
        // Arrange
        when(userRepository.findByEmail(testEmail)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(testPassword, encodedPassword)).thenReturn(true);
        when(jwtUtil.generateToken(testEmail)).thenReturn(testToken);

        // Act
        AuthResponse response = authService.login(loginRequest);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getToken()).isEqualTo(testToken);
        assertThat(response.getEmail()).isEqualTo(testEmail);
        assertThat(response.getFirstName()).isEqualTo("John");
        assertThat(response.getLastName()).isEqualTo("Doe");
        assertThat(response.getRole()).isEqualTo("USER");
        assertThat(response.getMessage()).isEqualTo("Login successful");

        verify(userRepository, times(1)).findByEmail(testEmail);
        verify(passwordEncoder, times(1)).matches(testPassword, encodedPassword);
        verify(jwtUtil, times(1)).generateToken(testEmail);
    }

    @Test
    void login_WithNonExistentEmail_ShouldReturnErrorMessage() {
        // Arrange
        when(userRepository.findByEmail(testEmail)).thenReturn(Optional.empty());

        // Act
        AuthResponse response = authService.login(loginRequest);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getToken()).isNull();
        assertThat(response.getMessage()).isEqualTo("Invalid email or password");

        verify(userRepository, times(1)).findByEmail(testEmail);
        verify(passwordEncoder, never()).matches(anyString(), anyString());
        verify(jwtUtil, never()).generateToken(anyString());
    }

    @Test
    void login_WithInvalidPassword_ShouldReturnErrorMessage() {
        // Arrange
        when(userRepository.findByEmail(testEmail)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches(testPassword, encodedPassword)).thenReturn(false);

        // Act
        AuthResponse response = authService.login(loginRequest);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.getToken()).isNull();
        assertThat(response.getMessage()).isEqualTo("Invalid email or password");

        verify(userRepository, times(1)).findByEmail(testEmail);
        verify(passwordEncoder, times(1)).matches(testPassword, encodedPassword);
        verify(jwtUtil, never()).generateToken(anyString());
    }

    @Test
    void login_WhenExceptionOccurs_ShouldThrowException() {
        // Arrange
        when(userRepository.findByEmail(testEmail)).thenThrow(new RuntimeException("Database error"));

        // Act & Assert
        assertThatThrownBy(() -> authService.login(loginRequest))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Database error");

        verify(userRepository, times(1)).findByEmail(testEmail);
        verify(passwordEncoder, never()).matches(anyString(), anyString());
        verify(jwtUtil, never()).generateToken(anyString());
    }
}