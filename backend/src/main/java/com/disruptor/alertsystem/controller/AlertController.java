package com.disruptor.alertsystem.controller;

import com.disruptor.alertsystem.model.*;
import com.disruptor.alertsystem.payload.MessageResponse;
import com.disruptor.alertsystem.repository.AlertRepository;
import com.disruptor.alertsystem.repository.DisasterRepository;
import com.disruptor.alertsystem.repository.TaskRepository;
import com.disruptor.alertsystem.repository.UserRepository;
import com.disruptor.alertsystem.security.JwtUtils;
import com.disruptor.alertsystem.service.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private DisasterRepository disasterRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private JwtUtils jwtUtils;

    // Admin endpoint to create an Alert linked to a Disaster
    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createAlert(@RequestParam Long disasterId, @RequestParam String message) {
        Disaster disaster = disasterRepository.findById(disasterId).orElse(null);
        if (disaster == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Disaster not found"));
        }

        // Get current user (admin)
        Authentication authentication = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User createdBy = userRepository.findById(userDetails.getId()).orElse(null);

        Alert alert = new Alert(disaster, message, createdBy, LocalDateTime.now(), "Pending");
        alertRepository.save(alert);

        return ResponseEntity.ok(new MessageResponse("Alert created successfully"));
    }

    // Endpoint for Officers to push notification about a task
    @PostMapping("/push-notification")
    @PreAuthorize("hasRole('OFFICER')")
    public ResponseEntity<?> pushTaskNotification(@RequestParam Long taskId, @RequestParam String message) {
        Authentication authentication = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        Task task = taskRepository.findById(taskId).orElse(null);
        if (task == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Task not found"));
        }

        // Verify officer is assigned to this task
        if (!task.getAssignedTo().getId().equals(userDetails.getId())) {
            return ResponseEntity.badRequest().body(new MessageResponse("You are not assigned to this task"));
        }

        User officer = userRepository.findById(userDetails.getId()).orElse(null);

        Alert alert = new Alert();
        alert.setTitle("Alert from Officer: " + task.getTitle());
        alert.setMessage(message);
        alert.setCreatedBy(officer);
        alert.setDisaster(task.getDisaster());
        alert.setBroadcastTime(LocalDateTime.now());
        alert.setStatus("Sent");
        alert.setState(task.getState());
        alert.setDistrict(task.getDistrict());

        alertRepository.save(alert);

        return ResponseEntity.ok(new MessageResponse(
                "Notification sent to all citizens in " + task.getDistrict() + ", " + task.getState()));
    }

    // Endpoint for Officers to broadcast alert to their district
    @PostMapping("/broadcast")
    @PreAuthorize("hasRole('OFFICER')")
    public ResponseEntity<?> broadcastAlert(@RequestBody com.disruptor.alertsystem.payload.CreateAlertRequest request) {
        Authentication authentication = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        User officer = userRepository.findById(userDetails.getId()).orElse(null);
        if (officer == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Officer not found"));
        }

        Alert alert = new Alert();
        alert.setTitle(request.getTitle());
        alert.setMessage(request.getMessage());
        alert.setCreatedBy(officer);
        alert.setBroadcastTime(LocalDateTime.now());
        alert.setStatus("Sent");

        // Use provided district/state or fallback to officer's location
        // This allows officer to specifically target their district
        if (request.getDistrict() != null && !request.getDistrict().isEmpty()) {
            alert.setDistrict(request.getDistrict());
        } else {
            alert.setDistrict(officer.getDistrict());
        }

        if (request.getState() != null && !request.getState().isEmpty()) {
            alert.setState(request.getState());
        } else {
            alert.setState(officer.getState());
        }

        alertRepository.save(alert);

        return ResponseEntity.ok(new MessageResponse(
                "Alert broadcasted successfully to " + alert.getDistrict() + ", " + alert.getState()));
    }

    // Endpoint for Citizens to fetch active alerts for their region
    @GetMapping("/active")
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<List<Alert>> getActiveAlertsForRegion() {
        Authentication authentication = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User user = userRepository.findById(userDetails.getId()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().build();
        }

        // Filter alerts by State (Region) and District (Location) using logic:
        // Alert match if:
        // 1. Alert State matches User State (Region)
        // 2. AND (Alert District is null/empty OR Alert District matches User District
        // (Location))
        List<Alert> alerts = alertRepository.findAll().stream()
                .filter(alert -> {
                    boolean stateMatch = alert.getState() != null
                            && alert.getState().equalsIgnoreCase(user.getState());
                    boolean districtMatch = alert.getDistrict() == null || alert.getDistrict().isEmpty() ||
                            java.util.Arrays.stream(alert.getDistrict().split(","))
                                    .anyMatch(d -> d.trim().equalsIgnoreCase(user.getDistrict()));

                    return "Sent".equals(alert.getStatus()) && stateMatch && districtMatch;
                })
                .toList();

        return ResponseEntity.ok(alerts);
    }

    // Delete alert - Officer can delete their own alerts
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteAlert(@PathVariable Long id, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User currentUser = userRepository.findById(userDetails.getId()).orElse(null);

        if (currentUser == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("User not found"));
        }

        Alert alert = alertRepository.findById(id).orElse(null);
        if (alert == null) {
            return ResponseEntity.notFound().build();
        }

        // Check if user is the creator or an admin
        if (!alert.getCreatedBy().getId().equals(currentUser.getId()) &&
                currentUser.getRole() != ERole.ROLE_ADMIN) {
            return ResponseEntity.status(403).body(new MessageResponse("You can only delete your own alerts"));
        }

        alertRepository.delete(alert);
        return ResponseEntity.ok(new MessageResponse("Alert deleted successfully"));
    }

    // Get officer's sent alerts history
    @GetMapping("/my-alerts")
    @PreAuthorize("hasRole('OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<?> getMyAlerts(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User currentUser = userRepository.findById(userDetails.getId()).orElse(null);

        if (currentUser == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("User not found"));
        }

        List<Alert> myAlerts = alertRepository.findByCreatedByOrderByBroadcastTimeDesc(currentUser);
        return ResponseEntity.ok(myAlerts);
    }
}