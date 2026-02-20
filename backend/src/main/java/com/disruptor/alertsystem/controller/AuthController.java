package com.disruptor.alertsystem.controller;

import java.util.List;
import java.util.stream.Collectors;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.disruptor.alertsystem.model.ERole;
import com.disruptor.alertsystem.model.User;
import com.disruptor.alertsystem.payload.JwtResponse;
import com.disruptor.alertsystem.payload.LoginRequest;
import com.disruptor.alertsystem.payload.MessageResponse;
import com.disruptor.alertsystem.payload.SignupRequest;
import com.disruptor.alertsystem.repository.UserRepository;
import com.disruptor.alertsystem.security.JwtUtils;
import com.disruptor.alertsystem.service.UserDetailsImpl;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UserRepository userRepository;

  @Autowired
  PasswordEncoder encoder;

  @Autowired
  JwtUtils jwtUtils;

  @org.springframework.web.bind.annotation.GetMapping("/test")
  public ResponseEntity<String> testEndpoint() {
    return ResponseEntity.ok("Backend is running");
  }

  @PostMapping("/signin")
  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
    System.out.println("Login info: Processing login request for " + loginRequest.getEmail());
    try {
      Authentication authentication = authenticationManager.authenticate(
          new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

      SecurityContextHolder.getContext().setAuthentication(authentication);
      String jwt = jwtUtils.generateJwtToken(authentication);

      UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
      List<String> roles = userDetails.getAuthorities().stream()
          .map(item -> item.getAuthority())
          .collect(Collectors.toList());

      return ResponseEntity.ok(new JwtResponse(jwt,
          userDetails.getId(),
          userDetails.getName(),
          userDetails.getEmail(),
          userDetails.getDistrict(),
          roles));
    } catch (BadCredentialsException e) {
      System.out.println("Authentication failed: Bad Credentials");
      e.printStackTrace();
      return ResponseEntity
          .status(HttpStatus.UNAUTHORIZED)
          .body(new MessageResponse("Error: Invalid email or password!"));
    } catch (Exception e) {
      System.out.println("Authentication failed: General Error");
      e.printStackTrace();
      return ResponseEntity
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new MessageResponse("Error: Authentication failed. Please try again."));
    }
  }

  @PostMapping("/signup")
  public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
    try {
      if (userRepository.existsByEmail(signUpRequest.getEmail())) {
        return ResponseEntity
            .badRequest()
            .body(new MessageResponse("Error: Email is already in use!"));
      }

      // Strict: Always create CITIZEN account for public registration
      ERole role = ERole.ROLE_CITIZEN;

      User user = new User(signUpRequest.getName(),
          signUpRequest.getEmail(),
          encoder.encode(signUpRequest.getPassword()),
          role,
          signUpRequest.getPhone(),
          null, // Region deprecated
          signUpRequest.getLocation());

      user.setState(signUpRequest.getState());
      user.setDistrict(signUpRequest.getDistrict());

      // Handle volunteer registration
      if (signUpRequest.getIsVolunteer() != null && signUpRequest.getIsVolunteer()) {
        user.setIsVolunteer(true);
        user.setVolunteerSkills(signUpRequest.getVolunteerSkills());
        user.setVolunteerAvailability(signUpRequest.getVolunteerAvailability());
      }

      userRepository.save(user);

      return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    } catch (Exception e) {
      return ResponseEntity
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(new MessageResponse("Error: Registration failed. Please try again."));
    }
  }
}
