package com.disruptor.alertsystem.controller;

import com.disruptor.alertsystem.model.RescueRequest;
import com.disruptor.alertsystem.model.RescueRequest.RequestStatus;
import com.disruptor.alertsystem.model.User;
import com.disruptor.alertsystem.repository.UserRepository;
import com.disruptor.alertsystem.service.RescueRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/rescue-requests")
@CrossOrigin(origins = "*", maxAge = 3600)
public class RescueRequestController {

    @Autowired
    private RescueRequestService rescueRequestService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<?> createRequest(
            @RequestBody RescueRequest request,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            User citizen = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            request.setCitizen(citizen);
            // Use the district from the request if provided, otherwise use citizen's
            // district
            if (request.getDistrict() == null || request.getDistrict().trim().isEmpty()) {
                request.setDistrict(citizen.getDistrict());
            }
            RescueRequest createdRequest = rescueRequestService.createRequest(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdRequest);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating rescue request: " + e.getMessage());
        }
    }

    @GetMapping("/district/{district}")
    @PreAuthorize("hasRole('OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<List<RescueRequest>> getRequestsByDistrict(@PathVariable String district) {
        return ResponseEntity.ok(rescueRequestService.getRequestsByDistrict(district));
    }

    @GetMapping("/district/{district}/pending")
    @PreAuthorize("hasRole('OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<List<RescueRequest>> getPendingRequestsByDistrict(@PathVariable String district) {
        return ResponseEntity.ok(rescueRequestService.getPendingRequestsByDistrict(district));
    }

    @GetMapping("/my-requests")
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<?> getMyRequests(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .map(citizen -> ResponseEntity.ok(rescueRequestService.getRequestsByCitizen(citizen)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('CITIZEN') or hasRole('OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<?> getRequestById(@PathVariable Long id) {
        return rescueRequestService.getRequestById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/assign")
    @PreAuthorize("hasRole('OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<?> assignRequest(
            @PathVariable Long id,
            @RequestBody Map<String, Object> assignmentData,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            User officer = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Officer not found"));

            RescueRequest updatedRequest = rescueRequestService.assignToOfficer(id, officer);

            // Assign teams if provided
            if (assignmentData.containsKey("teamIds")) {
                String teamIds = (String) assignmentData.get("teamIds");
                updatedRequest = rescueRequestService.assignTeams(id, teamIds);
            }

            // Notify volunteers if provided
            if (assignmentData.containsKey("volunteerIds")) {
                String volunteerIds = (String) assignmentData.get("volunteerIds");
                updatedRequest = rescueRequestService.notifyVolunteers(id, volunteerIds);
            }

            return ResponseEntity.ok(updatedRequest);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusMap) {
        try {
            RequestStatus status = RequestStatus.valueOf(statusMap.get("status"));
            RescueRequest updatedRequest = rescueRequestService.updateStatus(id, status);
            return ResponseEntity.ok(updatedRequest);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateRequest(
            @PathVariable Long id,
            @RequestBody RescueRequest requestDetails) {
        try {
            RescueRequest updatedRequest = rescueRequestService.updateRequest(id, requestDetails);
            return ResponseEntity.ok(updatedRequest);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteRequest(@PathVariable Long id) {
        try {
            rescueRequestService.deleteRequest(id);
            return ResponseEntity.ok().body("Request deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting request: " + e.getMessage());
        }
    }

    @GetMapping("/district/{district}/stats")
    @PreAuthorize("hasRole('OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> getDistrictStats(@PathVariable String district) {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalRequests", rescueRequestService.countRequestsByDistrict(district));
        stats.put("pendingRequests", rescueRequestService.countPendingRequestsByDistrict(district));
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/all/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> getGlobalRequestCount() {
        return ResponseEntity.ok(rescueRequestService.countAllRequests());
    }
}
