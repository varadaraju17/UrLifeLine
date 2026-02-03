package com.disruptor.alertsystem.controller;

import com.disruptor.alertsystem.model.AffectedArea;
import com.disruptor.alertsystem.payload.CreateAffectedAreaRequest;
import com.disruptor.alertsystem.payload.MessageResponse;
import com.disruptor.alertsystem.service.AffectedAreaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/affected-areas")
public class AffectedAreaController {

    @Autowired
    private AffectedAreaService affectedAreaService;

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OFFICER')")
    public ResponseEntity<?> createAffectedArea(@RequestBody CreateAffectedAreaRequest request) {
        try {
            AffectedArea area = affectedAreaService.createAffectedArea(request);
            return ResponseEntity.ok(area);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getAffectedArea(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(affectedAreaService.getAffectedArea(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/disaster/{disasterId}")
    public ResponseEntity<?> getAffectedAreasByDisaster(@PathVariable Long disasterId) {
        try {
            List<AffectedArea> areas = affectedAreaService.getAffectedAreasByDisaster(disasterId);
            return ResponseEntity.ok(areas);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/state/{state}")
    public ResponseEntity<?> getAffectedAreasByState(@PathVariable String state) {
        try {
            List<AffectedArea> areas = affectedAreaService.getAffectedAreasByState(state);
            return ResponseEntity.ok(areas);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/district/{district}")
    public ResponseEntity<?> getAffectedAreasByDistrict(@PathVariable String district) {
        try {
            List<AffectedArea> areas = affectedAreaService.getAffectedAreasByDistrict(district);
            return ResponseEntity.ok(areas);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/state/{state}/district/{district}")
    public ResponseEntity<?> getAffectedAreasByStateAndDistrict(@PathVariable String state, @PathVariable String district) {
        try {
            List<AffectedArea> areas = affectedAreaService.getAffectedAreasByStateAndDistrict(state, district);
            return ResponseEntity.ok(areas);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OFFICER')")
    public ResponseEntity<?> updateAffectedArea(@PathVariable Long id, @RequestBody CreateAffectedAreaRequest request) {
        try {
            AffectedArea area = affectedAreaService.updateAffectedArea(id, request);
            return ResponseEntity.ok(area);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/assign-officer/{officerId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> assignOfficer(@PathVariable Long id, @PathVariable Long officerId) {
        try {
            AffectedArea area = affectedAreaService.assignOfficer(id, officerId);
            return ResponseEntity.ok(area);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OFFICER')")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        try {
            AffectedArea area = affectedAreaService.updateStatus(id, status);
            return ResponseEntity.ok(area);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteAffectedArea(@PathVariable Long id) {
        try {
            affectedAreaService.deleteAffectedArea(id);
            return ResponseEntity.ok(new MessageResponse("Affected area deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    @GetMapping("/all")
    public ResponseEntity<?> getAllAffectedAreas() {
        try {
            List<AffectedArea> areas = affectedAreaService.getAllAffectedAreas();
            return ResponseEntity.ok(areas);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
}
