package com.disruptor.alertsystem.service;

import com.disruptor.alertsystem.model.*;
import com.disruptor.alertsystem.payload.CreateOfficerRequest;
import com.disruptor.alertsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class UserManagementService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User createOfficer(CreateOfficerRequest request, User adminUser) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        // Use provided password or generate a random one if not provided
        String password = request.getPassword();
        if (password == null || password.trim().isEmpty()) {
            password = UUID.randomUUID().toString().substring(0, 8);
        }

        User officer = new User();
        officer.setName(request.getName());
        officer.setEmail(request.getEmail());
        officer.setPassword(passwordEncoder.encode(password));
        officer.setRole(ERole.ROLE_OFFICER);
        officer.setPhone(request.getPhone());
        officer.setState(request.getState());
        officer.setDistrict(request.getDistrict());
        officer.setLocation(request.getLocation());
        officer.setAssignedAdmin(adminUser);
        officer.setStatus(OfficerStatus.ACTIVE);
        officer.setIsActive(true);

        return userRepository.save(officer);
    }

    public User updateOfficer(Long id, CreateOfficerRequest request) {
        User officer = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Officer not found"));

        officer.setName(request.getName());
        officer.setPhone(request.getPhone());
        officer.setState(request.getState());
        officer.setDistrict(request.getDistrict());
        officer.setLocation(request.getLocation());

        // Update password if provided
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            officer.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        return userRepository.save(officer);
    }

    public User updateOfficerStatus(Long id, String status) {
        User officer = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Officer not found"));

        officer.setStatus(OfficerStatus.valueOf(status));
        return userRepository.save(officer);
    }

    public List<User> getOfficersByAdmin(Long adminId) {
        return userRepository.findByAssignedAdminId(adminId);
    }

    public List<User> getOfficersByState(String state) {
        return userRepository.findByRoleAndState(ERole.ROLE_OFFICER, state);
    }

    public List<User> getOfficersByDistrict(String district) {
        return userRepository.findByRoleAndDistrict(ERole.ROLE_OFFICER, district);
    }

    public Optional<User> getUser(Long id) {
        return userRepository.findById(id);
    }

    public void deactivateOfficer(Long id) {
        User officer = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Officer not found"));
        officer.setIsActive(false);
        userRepository.save(officer);
    }

    public void activateOfficer(Long id) {
        User officer = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Officer not found"));
        officer.setIsActive(true);
        userRepository.save(officer);
    }
}
