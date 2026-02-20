package com.disruptor.alertsystem.repository;

import com.disruptor.alertsystem.model.RescueRequest;
import com.disruptor.alertsystem.model.RescueRequest.RequestStatus;
import com.disruptor.alertsystem.model.RescueRequest.UrgencyLevel;
import com.disruptor.alertsystem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RescueRequestRepository extends JpaRepository<RescueRequest, Long> {
    List<RescueRequest> findByDistrictIgnoreCase(String district);

    List<RescueRequest> findByDistrictIgnoreCaseAndStatus(String district, RequestStatus status);

    List<RescueRequest> findByCitizen(User citizen);

    List<RescueRequest> findByAssignedOfficer(User officer);

    List<RescueRequest> findByStatus(RequestStatus status);

    List<RescueRequest> findByDistrictIgnoreCaseAndUrgencyLevel(String district, UrgencyLevel urgencyLevel);

    List<RescueRequest> findByDistrictIgnoreCaseOrderByCreatedAtDesc(String district);

    List<RescueRequest> findByDistrictIgnoreCaseAndStatusOrderByUrgencyLevelDescCreatedAtDesc(String district,
            RequestStatus status);

    long countByDistrictIgnoreCase(String district);

    long countByDistrictIgnoreCaseAndStatus(String district, RequestStatus status);
}
