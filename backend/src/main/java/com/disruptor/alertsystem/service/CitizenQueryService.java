package com.disruptor.alertsystem.service;

import com.disruptor.alertsystem.model.*;
import com.disruptor.alertsystem.payload.CreateQueryRequest;
import com.disruptor.alertsystem.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class CitizenQueryService {
    private final CitizenQueryRepository queryRepository;
    private final UserRepository userRepository;
    private final DisasterRepository disasterRepository;

    public CitizenQuery createQuery(Long citizenId, CreateQueryRequest request) {
        User citizen = userRepository.findById(citizenId)
                .orElseThrow(() -> new RuntimeException("Citizen not found"));

        CitizenQuery query = new CitizenQuery();
        query.setCitizen(citizen);
        query.setSubject(request.getSubject());
        query.setMessage(request.getMessage());
        query.setCategory(request.getCategory());
        query.setLocation(request.getLocation());
        query.setDistrict(request.getDistrict());
        query.setState(request.getState());
        query.setStatus(QueryStatus.OPEN);
        query.setPriorityLevel(3); // Default medium priority

        if (request.getDisasterId() != null) {
            Disaster disaster = disasterRepository.findById(request.getDisasterId())
                    .orElseThrow(() -> new RuntimeException("Disaster not found"));
            query.setDisaster(disaster);
        }

        return queryRepository.save(query);
    }

    public CitizenQuery assignOfficer(Long queryId, Long officerId) {
        CitizenQuery query = queryRepository.findById(queryId)
                .orElseThrow(() -> new RuntimeException("Query not found"));
        User officer = userRepository.findById(officerId)
                .orElseThrow(() -> new RuntimeException("Officer not found"));

        if (!officer.getRole().equals(ERole.ROLE_OFFICER)) {
            throw new RuntimeException("User is not an officer");
        }

        query.setAssignedOfficer(officer);
        query.setStatus(QueryStatus.ASSIGNED);
        return queryRepository.save(query);
    }

    public CitizenQuery respondToQuery(Long queryId, String response) {
        CitizenQuery query = queryRepository.findById(queryId)
                .orElseThrow(() -> new RuntimeException("Query not found"));
        query.setResponse(response);
        query.setResponseDate(LocalDateTime.now());
        query.setStatus(QueryStatus.RESOLVED);
        return queryRepository.save(query);
    }

    public Optional<CitizenQuery> getQuery(Long id) {
        return queryRepository.findById(id);
    }

    public List<CitizenQuery> getQueriesByCitizen(Long citizenId) {
        return queryRepository.findByCitizenId(citizenId);
    }

    public List<CitizenQuery> getQueriesByOfficer(Long officerId) {
        return queryRepository.findByAssignedOfficerId(officerId);
    }

    public List<CitizenQuery> getQueriesByDisaster(Long disasterId) {
        return queryRepository.findByDisasterId(disasterId);
    }

    public List<CitizenQuery> getOpenQueries() {
        return queryRepository.findByStatus(QueryStatus.OPEN);
    }

    public List<CitizenQuery> getAllQueries() {
        return queryRepository.findAll();
    }

    public void deleteQuery(Long id) {
        queryRepository.deleteById(id);
    }
}
