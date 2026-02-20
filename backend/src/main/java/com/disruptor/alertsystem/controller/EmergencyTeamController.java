package com.disruptor.alertsystem.controller;

import com.disruptor.alertsystem.model.EmergencyTeam;
import com.disruptor.alertsystem.model.EmergencyTeam.TeamStatus;
import com.disruptor.alertsystem.model.EmergencyTeam.TeamType;
import com.disruptor.alertsystem.service.EmergencyTeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/emergency-teams")
@CrossOrigin(origins = "*", maxAge = 3600)
public class EmergencyTeamController {

    @Autowired
    private EmergencyTeamService emergencyTeamService;

    @PostMapping
    @PreAuthorize("hasRole('OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<?> createTeam(@RequestBody EmergencyTeam team) {
        try {
            EmergencyTeam createdTeam = emergencyTeamService.createTeam(team);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdTeam);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error creating team: " + e.getMessage());
        }
    }

    @GetMapping
    @PreAuthorize("hasRole('OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<List<EmergencyTeam>> getAllTeams() {
        return ResponseEntity.ok(emergencyTeamService.getAllTeams());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<?> getTeamById(@PathVariable Long id) {
        return emergencyTeamService.getTeamById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/district/{district}")
    @PreAuthorize("hasRole('OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<List<EmergencyTeam>> getTeamsByDistrict(@PathVariable String district) {
        return ResponseEntity.ok(emergencyTeamService.getTeamsByDistrict(district));
    }

    @GetMapping("/district/{district}/available")
    @PreAuthorize("hasRole('OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<List<EmergencyTeam>> getAvailableTeamsByDistrict(@PathVariable String district) {
        return ResponseEntity.ok(emergencyTeamService.getAvailableTeamsByDistrict(district));
    }

    @GetMapping("/district/{district}/type/{teamType}")
    @PreAuthorize("hasRole('OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<List<EmergencyTeam>> getTeamsByDistrictAndType(
            @PathVariable String district,
            @PathVariable TeamType teamType) {
        return ResponseEntity.ok(emergencyTeamService.getTeamsByDistrictAndType(district, teamType));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateTeam(@PathVariable Long id, @RequestBody EmergencyTeam teamDetails) {
        try {
            EmergencyTeam updatedTeam = emergencyTeamService.updateTeam(id, teamDetails);
            return ResponseEntity.ok(updatedTeam);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<?> updateTeamStatus(@PathVariable Long id, @RequestBody Map<String, String> statusMap) {
        try {
            TeamStatus status = TeamStatus.valueOf(statusMap.get("status"));
            EmergencyTeam updatedTeam = emergencyTeamService.updateTeamStatus(id, status);
            return ResponseEntity.ok(updatedTeam);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteTeam(@PathVariable Long id) {
        try {
            emergencyTeamService.deleteTeam(id);
            return ResponseEntity.ok().body("Team deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error deleting team: " + e.getMessage());
        }
    }

    @GetMapping("/district/{district}/stats")
    @PreAuthorize("hasRole('OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> getDistrictStats(@PathVariable String district) {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalTeams", emergencyTeamService.countTeamsByDistrict(district));
        stats.put("availableTeams", emergencyTeamService.countAvailableTeamsByDistrict(district));
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/all/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> getGlobalTeamCount() {
        return ResponseEntity.ok(emergencyTeamService.countAllTeams());
    }
}
