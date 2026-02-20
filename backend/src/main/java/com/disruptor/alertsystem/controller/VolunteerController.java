package com.disruptor.alertsystem.controller;

import com.disruptor.alertsystem.model.User;
import com.disruptor.alertsystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/volunteers")
@CrossOrigin(origins = "*", maxAge = 3600)
public class VolunteerController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/district/{district}")
    @PreAuthorize("hasRole('OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<List<User>> getVolunteersByDistrict(@PathVariable String district) {
        List<User> volunteers = userRepository.findByDistrictIgnoreCaseAndIsVolunteer(district, true);
        return ResponseEntity.ok(volunteers);
    }

    @GetMapping("/me")
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<?> getMyVolunteerProfile(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .map(user -> {
                    Map<String, Object> profile = new HashMap<>();
                    profile.put("isVolunteer", user.getIsVolunteer());
                    profile.put("volunteerSkills", user.getVolunteerSkills());
                    profile.put("volunteerAvailability", user.getVolunteerAvailability());
                    return ResponseEntity.ok(profile);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<?> updateVolunteerProfile(
            Authentication authentication,
            @RequestBody Map<String, Object> volunteerData) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .map(user -> {
                    if (volunteerData.containsKey("isVolunteer")) {
                        user.setIsVolunteer((Boolean) volunteerData.get("isVolunteer"));
                    }
                    if (volunteerData.containsKey("volunteerSkills")) {
                        user.setVolunteerSkills((String) volunteerData.get("volunteerSkills"));
                    }
                    if (volunteerData.containsKey("volunteerAvailability")) {
                        user.setVolunteerAvailability((String) volunteerData.get("volunteerAvailability"));
                    }
                    User updatedUser = userRepository.save(user);

                    Map<String, Object> response = new HashMap<>();
                    response.put("message", "Volunteer profile updated successfully");
                    response.put("isVolunteer", updatedUser.getIsVolunteer());
                    response.put("volunteerSkills", updatedUser.getVolunteerSkills());
                    response.put("volunteerAvailability", updatedUser.getVolunteerAvailability());

                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/district/{district}/count")
    @PreAuthorize("hasRole('OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, Long>> getVolunteerCount(@PathVariable String district) {
        long count = userRepository.countByDistrictIgnoreCaseAndIsVolunteer(district, true);
        Map<String, Long> response = new HashMap<>();
        response.put("count", count);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all/count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> getGlobalVolunteerCount() {
        return ResponseEntity.ok(userRepository.countByIsVolunteer(true));
    }
}
