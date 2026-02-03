package com.disruptor.alertsystem.controller;

import com.disruptor.alertsystem.model.User;
import com.disruptor.alertsystem.payload.CreateOfficerRequest;
import com.disruptor.alertsystem.payload.MessageResponse;
import com.disruptor.alertsystem.repository.UserRepository;
import com.disruptor.alertsystem.service.UserDetailsImpl;
import com.disruptor.alertsystem.service.UserManagementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminDashboardController {

    @Autowired
    private UserManagementService userManagementService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/create-officer")
    public ResponseEntity<?> createOfficer(@jakarta.validation.Valid @RequestBody CreateOfficerRequest request, Authentication authentication) {
        try {
            if (request.getName() == null || request.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Name is required"));
            }
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is required"));
            }
            if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Password is required"));
            }
            if (request.getPassword().length() < 6) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Password must be at least 6 characters"));
            }
            
            Object principal = authentication.getPrincipal();
            if (!(principal instanceof UserDetailsImpl)) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid authentication. Principal type: " + principal.getClass().getName()));
            }
            
            UserDetailsImpl userDetails = (UserDetailsImpl) principal;
            User adminUser = userRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new RuntimeException("Admin user not found"));
            User officer = userManagementService.createOfficer(request, adminUser);
            String message = "Officer created successfully! Email: " + officer.getEmail();
            if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
                message += " | Password has been set. Officer can login immediately.";
            }
            return ResponseEntity.ok(new MessageResponse(message));
        } catch (ClassCastException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Authentication type mismatch. Please logout and login again."));
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage() + " - " + e.getClass().getSimpleName()));
        }
    }

    @GetMapping("/officers")
    public ResponseEntity<?> getOfficers(Authentication authentication) {
        try {
            Object principal = authentication.getPrincipal();
            if (!(principal instanceof UserDetailsImpl)) {
                return ResponseEntity.badRequest().body(new MessageResponse("Error: Invalid authentication. Principal type: " + principal.getClass().getName()));
            }
            
            UserDetailsImpl userDetails = (UserDetailsImpl) principal;
            User adminUser = userRepository.findById(userDetails.getId())
                    .orElseThrow(() -> new RuntimeException("Admin user not found"));
            List<User> officers = userManagementService.getOfficersByAdmin(adminUser.getId());
            return ResponseEntity.ok(officers != null ? officers : java.util.Collections.emptyList());
        } catch (ClassCastException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Authentication type mismatch. Please logout and login again."));
        } catch (RuntimeException e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage() + " - " + e.getClass().getSimpleName()));
        }
    }

    @PutMapping("/officers/{id}")
    public ResponseEntity<?> updateOfficer(@PathVariable Long id, @RequestBody CreateOfficerRequest request) {
        try {
            User officer = userManagementService.updateOfficer(id, request);
            return ResponseEntity.ok(officer);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PutMapping("/officers/{id}/status")
    public ResponseEntity<?> updateOfficerStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            User officer = userManagementService.updateOfficerStatus(id, status);
            return ResponseEntity.ok(officer);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PutMapping("/officers/{id}/deactivate")
    public ResponseEntity<?> deactivateOfficer(@PathVariable Long id) {
        try {
            userManagementService.deactivateOfficer(id);
            return ResponseEntity.ok(new MessageResponse("Officer deactivated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PutMapping("/officers/{id}/activate")
    public ResponseEntity<?> activateOfficer(@PathVariable Long id) {
        try {
            userManagementService.activateOfficer(id);
            return ResponseEntity.ok(new MessageResponse("Officer activated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
}
