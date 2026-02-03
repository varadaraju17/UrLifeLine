package com.disruptor.alertsystem.controller;

import com.disruptor.alertsystem.model.Disaster;
import com.disruptor.alertsystem.repository.DisasterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/disasters")
public class DisasterController {

    @Autowired
    private DisasterRepository disasterRepository;

    // Get all active disasters
    @GetMapping("/active")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OFFICER') or hasRole('CITIZEN')")
    public ResponseEntity<List<Disaster>> getActiveDisasters() {
        List<Disaster> disasters = disasterRepository.findByStatus("Active");
        return ResponseEntity.ok(disasters);
    }

    // Get disasters by region
    @GetMapping("/region/{region}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OFFICER') or hasRole('CITIZEN')")
    public ResponseEntity<List<Disaster>> getDisastersByRegion(@PathVariable String region) {
        List<Disaster> disasters = disasterRepository.findByRegion(region);
        return ResponseEntity.ok(disasters);
    }
}