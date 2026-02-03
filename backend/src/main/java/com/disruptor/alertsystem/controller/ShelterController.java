package com.disruptor.alertsystem.controller;

import com.disruptor.alertsystem.model.Shelter;
import com.disruptor.alertsystem.payload.CreateShelterRequest;
import com.disruptor.alertsystem.payload.MessageResponse;
import com.disruptor.alertsystem.service.ShelterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/shelters")
public class ShelterController {

    @Autowired
    private ShelterService shelterService;

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OFFICER')")
    public ResponseEntity<?> createShelter(@RequestBody CreateShelterRequest request) {
        try {
            Shelter shelter = shelterService.createShelter(request);
            return ResponseEntity.ok(shelter);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getShelter(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(shelterService.getShelter(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/state/{state}")
    public ResponseEntity<?> getSheltersByState(@PathVariable String state) {
        try {
            List<Shelter> shelters = shelterService.getSheltersByState(state);
            return ResponseEntity.ok(shelters);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/district/{district}")
    public ResponseEntity<?> getSheltersByDistrict(@PathVariable String district) {
        try {
            List<Shelter> shelters = shelterService.getSheltersByDistrict(district);
            return ResponseEntity.ok(shelters);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/disaster/{disasterId}")
    public ResponseEntity<?> getSheltersByDisaster(@PathVariable Long disasterId) {
        try {
            List<Shelter> shelters = shelterService.getSheltersByDisaster(disasterId);
            return ResponseEntity.ok(shelters);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/available")
    public ResponseEntity<?> getAvailableShelters(@RequestParam String state, @RequestParam String district) {
        try {
            List<Shelter> shelters = shelterService.getAvailableShelters(state, district);
            return ResponseEntity.ok(shelters);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllShelters() {
        try {
            List<Shelter> shelters = shelterService.getAllShelters();
            return ResponseEntity.ok(shelters);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OFFICER')")
    public ResponseEntity<?> updateShelter(@PathVariable Long id, @RequestBody CreateShelterRequest request) {
        try {
            Shelter shelter = shelterService.updateShelter(id, request);
            return ResponseEntity.ok(shelter);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/occupancy")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OFFICER')")
    public ResponseEntity<?> updateOccupancy(@PathVariable Long id, @RequestParam Integer occupancy) {
        try {
            Shelter shelter = shelterService.updateOccupancy(id, occupancy);
            return ResponseEntity.ok(shelter);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OFFICER')")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            Shelter shelter = shelterService.updateStatus(id, status);
            return ResponseEntity.ok(shelter);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteShelter(@PathVariable Long id) {
        try {
            shelterService.deleteShelter(id);
            return ResponseEntity.ok(new MessageResponse("Shelter deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
}
