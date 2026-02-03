package com.disruptor.alertsystem.controller;

import com.disruptor.alertsystem.model.Disaster;
import com.disruptor.alertsystem.model.Report;
import com.disruptor.alertsystem.model.User;
import com.disruptor.alertsystem.payload.MessageResponse;
import com.disruptor.alertsystem.repository.DisasterRepository;
import com.disruptor.alertsystem.repository.ReportRepository;
import com.disruptor.alertsystem.repository.UserRepository;
import com.disruptor.alertsystem.service.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private ReportRepository reportRepository;

    @Autowired
    private DisasterRepository disasterRepository;

    @Autowired
    private UserRepository userRepository;

    // Responder endpoint to submit incident report
    @PostMapping("/submit")
    @PreAuthorize("hasRole('RESPONDER')")
    public ResponseEntity<?> submitReport(@RequestParam Long disasterId, @RequestParam String details) {
        Disaster disaster = disasterRepository.findById(disasterId).orElse(null);
        if (disaster == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Disaster not found"));
        }

        Authentication authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        User responder = userRepository.findById(userDetails.getId()).orElse(null);

        Report report = new Report(disaster, responder, details, LocalDateTime.now());
        reportRepository.save(report);

        return ResponseEntity.ok(new MessageResponse("Report submitted successfully"));
    }

    // Admin endpoint to view reports
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllReports() {
        return ResponseEntity.ok(reportRepository.findAll());
    }
}