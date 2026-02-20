package com.disruptor.alertsystem.service;

import com.disruptor.alertsystem.model.RescueRequest;
import com.disruptor.alertsystem.model.RescueRequest.RequestStatus;
import com.disruptor.alertsystem.model.RescueRequest.UrgencyLevel;
import com.disruptor.alertsystem.model.User;
import com.disruptor.alertsystem.repository.RescueRequestRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RescueRequestService {

    @Autowired
    private RescueRequestRepository rescueRequestRepository;

    public RescueRequest createRequest(RescueRequest request) {
        return rescueRequestRepository.save(request);
    }

    public List<RescueRequest> getAllRequests() {
        return rescueRequestRepository.findAll();
    }

    public Optional<RescueRequest> getRequestById(Long id) {
        return rescueRequestRepository.findById(id);
    }

    public List<RescueRequest> getRequestsByDistrict(String district) {
        return rescueRequestRepository.findByDistrictIgnoreCaseOrderByCreatedAtDesc(district);
    }

    public List<RescueRequest> getPendingRequestsByDistrict(String district) {
        return rescueRequestRepository.findByDistrictIgnoreCaseAndStatusOrderByUrgencyLevelDescCreatedAtDesc(
                district, RequestStatus.PENDING);
    }

    public List<RescueRequest> getRequestsByCitizen(User citizen) {
        return rescueRequestRepository.findByCitizen(citizen);
    }

    public List<RescueRequest> getRequestsByOfficer(User officer) {
        return rescueRequestRepository.findByAssignedOfficer(officer);
    }

    public RescueRequest updateRequest(Long id, RescueRequest requestDetails) {
        return rescueRequestRepository.findById(id)
                .map(request -> {
                    request.setLocation(requestDetails.getLocation());
                    request.setLatitude(requestDetails.getLatitude());
                    request.setLongitude(requestDetails.getLongitude());
                    request.setUrgencyLevel(requestDetails.getUrgencyLevel());
                    request.setDescription(requestDetails.getDescription());
                    request.setNumberOfPeople(requestDetails.getNumberOfPeople());
                    request.setSpecialNeeds(requestDetails.getSpecialNeeds());
                    request.setStatus(requestDetails.getStatus());
                    request.setNotes(requestDetails.getNotes());
                    return rescueRequestRepository.save(request);
                })
                .orElseThrow(() -> new RuntimeException("Request not found with id: " + id));
    }

    public RescueRequest assignToOfficer(Long id, User officer) {
        return rescueRequestRepository.findById(id)
                .map(request -> {
                    request.setAssignedOfficer(officer);
                    request.setStatus(RequestStatus.ASSIGNED);
                    request.setRespondedAt(LocalDateTime.now());
                    return rescueRequestRepository.save(request);
                })
                .orElseThrow(() -> new RuntimeException("Request not found with id: " + id));
    }

    public RescueRequest updateStatus(Long id, RequestStatus status) {
        return rescueRequestRepository.findById(id)
                .map(request -> {
                    request.setStatus(status);
                    if (status == RequestStatus.COMPLETED) {
                        request.setCompletedAt(LocalDateTime.now());
                    }
                    return rescueRequestRepository.save(request);
                })
                .orElseThrow(() -> new RuntimeException("Request not found with id: " + id));
    }

    public RescueRequest assignTeams(Long id, String teamIds) {
        return rescueRequestRepository.findById(id)
                .map(request -> {
                    request.setAssignedTeamIds(teamIds);
                    return rescueRequestRepository.save(request);
                })
                .orElseThrow(() -> new RuntimeException("Request not found with id: " + id));
    }

    @Autowired
    private com.disruptor.alertsystem.repository.AlertRepository alertRepository;

    @Autowired
    private com.disruptor.alertsystem.repository.UserRepository userRepository;

    public RescueRequest notifyVolunteers(Long id, String volunteerIds) {
        return rescueRequestRepository.findById(id)
                .map(request -> {
                    request.setNotifiedVolunteerIds(volunteerIds);

                    // Create an Alert for the volunteers
                    try {
                        com.disruptor.alertsystem.model.Alert alert = new com.disruptor.alertsystem.model.Alert();
                        alert.setTitle("URGENT: Rescue Assistance Needed");
                        alert.setMessage("Volunteer assistance requested for " + request.getRescueType() + " at "
                                + request.getLocation() + ". " + request.getDescription());
                        alert.setDistrict(request.getDistrict());
                        alert.setState(request.getState());
                        alert.setBroadcastTime(LocalDateTime.now());
                        alert.setStatus("Sent");

                        // Set creator as the assigned officer or the system admin if none
                        if (request.getAssignedOfficer() != null) {
                            alert.setCreatedBy(request.getAssignedOfficer());
                        } else {
                            // Fallback to finding an admin or leaving null (depending on constraints)
                            userRepository.findByEmail("varadarajuny@gmail.com").ifPresent(alert::setCreatedBy);
                        }

                        alertRepository.save(alert);
                    } catch (Exception e) {
                        System.err.println("Failed to create alert for volunteers: " + e.getMessage());
                        // Continue execution, don't fail the request update
                    }

                    return rescueRequestRepository.save(request);
                })
                .orElseThrow(() -> new RuntimeException("Request not found with id: " + id));
    }

    public void deleteRequest(Long id) {
        rescueRequestRepository.deleteById(id);
    }

    public long countRequestsByDistrict(String district) {
        return rescueRequestRepository.countByDistrictIgnoreCase(district);
    }

    public long countPendingRequestsByDistrict(String district) {
        return rescueRequestRepository.countByDistrictIgnoreCaseAndStatus(district, RequestStatus.PENDING);
    }

    public long countAllRequests() {
        return rescueRequestRepository.count();
    }
}
