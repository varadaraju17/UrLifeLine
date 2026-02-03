package com.disruptor.alertsystem.service;

import com.disruptor.alertsystem.model.*;
import com.disruptor.alertsystem.payload.CreateAffectedAreaRequest;
import com.disruptor.alertsystem.repository.AffectedAreaRepository;
import com.disruptor.alertsystem.repository.DisasterRepository;
import com.disruptor.alertsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class AffectedAreaService {
    private final AffectedAreaRepository affectedAreaRepository;
    private final DisasterRepository disasterRepository;
    private final UserRepository userRepository;

    public AffectedArea createAffectedArea(CreateAffectedAreaRequest request) {
        Disaster disaster = disasterRepository.findById(request.getDisasterId())
                .orElseThrow(() -> new RuntimeException("Disaster not found"));

        AffectedArea affectedArea = new AffectedArea();
        affectedArea.setDisaster(disaster);
        affectedArea.setAreaName(request.getAreaName());
        affectedArea.setAddress(request.getAddress());
        affectedArea.setDistrict(request.getDistrict());
        affectedArea.setState(request.getState());
        affectedArea.setPincode(request.getPincode());
        affectedArea.setLatitude(request.getLatitude());
        affectedArea.setLongitude(request.getLongitude());
        affectedArea.setSeverity(AffectedAreaSeverity.valueOf(request.getSeverity()));
        affectedArea.setEstimatedAffectedPopulation(request.getEstimatedAffectedPopulation());
        affectedArea.setDamageDescription(request.getDamageDescription());
        affectedArea.setStatus(AffectedAreaStatus.IDENTIFIED);

        return affectedAreaRepository.save(affectedArea);
    }

    public AffectedArea updateAffectedArea(Long id, CreateAffectedAreaRequest request) {
        AffectedArea affectedArea = affectedAreaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Affected Area not found"));

        affectedArea.setAreaName(request.getAreaName());
        affectedArea.setAddress(request.getAddress());
        affectedArea.setDistrict(request.getDistrict());
        affectedArea.setState(request.getState());
        affectedArea.setPincode(request.getPincode());
        affectedArea.setLatitude(request.getLatitude());
        affectedArea.setLongitude(request.getLongitude());
        affectedArea.setSeverity(AffectedAreaSeverity.valueOf(request.getSeverity()));
        affectedArea.setEstimatedAffectedPopulation(request.getEstimatedAffectedPopulation());
        affectedArea.setDamageDescription(request.getDamageDescription());

        return affectedAreaRepository.save(affectedArea);
    }

    public AffectedArea assignOfficer(Long areaId, Long officerId) {
        AffectedArea affectedArea = affectedAreaRepository.findById(areaId)
                .orElseThrow(() -> new RuntimeException("Affected Area not found"));
        User officer = userRepository.findById(officerId)
                .orElseThrow(() -> new RuntimeException("Officer not found"));

        if (!officer.getRole().equals(ERole.ROLE_OFFICER)) {
            throw new RuntimeException("User is not an officer");
        }

        affectedArea.setAssignedOfficer(officer);
        affectedArea.setStatus(AffectedAreaStatus.UNDER_ASSESSMENT);
        return affectedAreaRepository.save(affectedArea);
    }

    public AffectedArea updateStatus(Long id, String status) {
        AffectedArea affectedArea = affectedAreaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Affected Area not found"));
        affectedArea.setStatus(AffectedAreaStatus.valueOf(status));
        return affectedAreaRepository.save(affectedArea);
    }

    public Optional<AffectedArea> getAffectedArea(Long id) {
        return affectedAreaRepository.findById(id);
    }

    public List<AffectedArea> getAffectedAreasByDisaster(Long disasterId) {
        Disaster disaster = disasterRepository.findById(disasterId)
                .orElseThrow(() -> new RuntimeException("Disaster not found"));
        return affectedAreaRepository.findByDisaster(disaster);
    }

    public List<AffectedArea> getAffectedAreasByState(String state) {
        return affectedAreaRepository.findByState(state);
    }

    public List<AffectedArea> getAffectedAreasByDistrict(String district) {
        return affectedAreaRepository.findByDistrict(district);
    }

    public List<AffectedArea> getAffectedAreasByOfficer(Long officerId) {
        return affectedAreaRepository.findByAssignedOfficerId(officerId);
    }

    public List<AffectedArea> getAffectedAreasByStateAndDistrict(String state, String district) {
        return affectedAreaRepository.findByStateAndDistrict(state, district);
    }

    public List<AffectedArea> getAllAffectedAreas() {
        return affectedAreaRepository.findAll();
    }

    public void deleteAffectedArea(Long id) {
        affectedAreaRepository.deleteById(id);
    }
}
