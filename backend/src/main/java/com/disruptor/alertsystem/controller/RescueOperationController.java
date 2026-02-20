package com.disruptor.alertsystem.controller;

import com.disruptor.alertsystem.model.RescueOperation;
import com.disruptor.alertsystem.model.RescueOperation.OperationStatus;
import com.disruptor.alertsystem.model.RescueRequest;
import com.disruptor.alertsystem.model.User;
import com.disruptor.alertsystem.repository.UserRepository;
import com.disruptor.alertsystem.service.RescueOperationService;
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
@RequestMapping("/api/rescue-operations")
@CrossOrigin(origins = "*", maxAge = 3600)
public class RescueOperationController {

    @Autowired
    private RescueOperationService rescueOperationService;

    @Autowired
    private RescueRequestService rescueRequestService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    @PreAuthorize("hasRole('OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<?> createOperation(
            @RequestBody Map<String, Object> operationData,
            Authentication authentication) {
        try {
            String email = authentication.getName();
            User officer = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Officer not found"));

            Long requestId = Long.valueOf(operationData.get("rescueRequestId").toString());
            RescueRequest request = rescueRequestService.getRequestById(requestId)
                    .orElseThrow(() -> new RuntimeException("Rescue request not found"));

            RescueOperation operation = new RescueOperation();
            operation.setRescueRequest(request);
            operation.setDistrict(request.getDistrict());
            operation.setOfficerInCharge(officer);

            if (operationData.containsKey("assignedTeams")) {
                operation.setAssignedTeams((String) operationData.get("assignedTeams"));
            }
            if (operationData.containsKey("assignedVolunteers")) {
                operation.setAssignedVolunteers((String) operationData.get("assignedVolunteers"));
            }
            if (operationData.containsKey("notes")) {
                operation.setNotes((String) operationData.get("notes"));
            }

            RescueOperation createdOperation = rescueOperationService.createOperation(operation);

            // Update rescue request status
            rescueRequestService.updateStatus(requestId, RescueRequest.RequestStatus.IN_PROGRESS);

            return ResponseEntity.status(HttpStatus.CREATED).body(createdOperation);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating operation: " + e.getMessage());
        }
    }

    @GetMapping("/district/{district}")
    @PreAuthorize("hasRole('OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<List<RescueOperation>> getOperationsByDistrict(@PathVariable String district) {
        return ResponseEntity.ok(rescueOperationService.getOperationsByDistrict(district));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<?> getOperationById(@PathVariable Long id) {
        return rescueOperationService.getOperationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateOperation(
            @PathVariable Long id,
            @RequestBody RescueOperation operationDetails) {
        try {
            RescueOperation updatedOperation = rescueOperationService.updateOperation(id, operationDetails);
            return ResponseEntity.ok(updatedOperation);
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
            OperationStatus status = OperationStatus.valueOf(statusMap.get("status"));
            RescueOperation updatedOperation = rescueOperationService.updateStatus(id, status);

            // If operation is completed, update rescue request status
            if (status == OperationStatus.COMPLETED) {
                rescueRequestService.updateStatus(
                        updatedOperation.getRescueRequest().getId(),
                        RescueRequest.RequestStatus.COMPLETED);
            }

            return ResponseEntity.ok(updatedOperation);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/district/{district}/stats")
    @PreAuthorize("hasRole('OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> getDistrictStats(@PathVariable String district) {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalOperations", rescueOperationService.countOperationsByDistrict(district));
        stats.put("activeOperations", rescueOperationService.countActiveOperationsByDistrict(district));
        return ResponseEntity.ok(stats);
    }
}
