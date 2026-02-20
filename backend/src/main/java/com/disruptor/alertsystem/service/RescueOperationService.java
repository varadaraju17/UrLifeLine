package com.disruptor.alertsystem.service;

import com.disruptor.alertsystem.model.RescueOperation;
import com.disruptor.alertsystem.model.RescueOperation.OperationStatus;
import com.disruptor.alertsystem.model.RescueRequest;
import com.disruptor.alertsystem.model.User;
import com.disruptor.alertsystem.repository.RescueOperationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RescueOperationService {

    @Autowired
    private RescueOperationRepository rescueOperationRepository;

    public RescueOperation createOperation(RescueOperation operation) {
        return rescueOperationRepository.save(operation);
    }

    public List<RescueOperation> getAllOperations() {
        return rescueOperationRepository.findAll();
    }

    public Optional<RescueOperation> getOperationById(Long id) {
        return rescueOperationRepository.findById(id);
    }

    public List<RescueOperation> getOperationsByDistrict(String district) {
        return rescueOperationRepository.findByDistrictOrderByCreatedAtDesc(district);
    }

    public Optional<RescueOperation> getOperationByRequest(RescueRequest request) {
        return rescueOperationRepository.findByRescueRequest(request);
    }

    public List<RescueOperation> getOperationsByOfficer(User officer) {
        return rescueOperationRepository.findByOfficerInCharge(officer);
    }

    public RescueOperation updateOperation(Long id, RescueOperation operationDetails) {
        return rescueOperationRepository.findById(id)
                .map(operation -> {
                    operation.setAssignedTeams(operationDetails.getAssignedTeams());
                    operation.setAssignedVolunteers(operationDetails.getAssignedVolunteers());
                    operation.setStatus(operationDetails.getStatus());
                    operation.setPeopleRescued(operationDetails.getPeopleRescued());
                    operation.setNotes(operationDetails.getNotes());
                    operation.setResourcesUsed(operationDetails.getResourcesUsed());
                    return rescueOperationRepository.save(operation);
                })
                .orElseThrow(() -> new RuntimeException("Operation not found with id: " + id));
    }

    public RescueOperation updateStatus(Long id, OperationStatus status) {
        return rescueOperationRepository.findById(id)
                .map(operation -> {
                    operation.setStatus(status);
                    if (status == OperationStatus.COMPLETED || status == OperationStatus.FAILED) {
                        operation.setEndTime(LocalDateTime.now());
                    }
                    return rescueOperationRepository.save(operation);
                })
                .orElseThrow(() -> new RuntimeException("Operation not found with id: " + id));
    }

    public void deleteOperation(Long id) {
        rescueOperationRepository.deleteById(id);
    }

    public long countOperationsByDistrict(String district) {
        return rescueOperationRepository.countByDistrict(district);
    }

    public long countActiveOperationsByDistrict(String district) {
        return rescueOperationRepository.countByDistrictAndStatus(district, OperationStatus.IN_PROGRESS);
    }
}
