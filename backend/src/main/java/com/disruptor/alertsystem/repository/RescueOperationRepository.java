package com.disruptor.alertsystem.repository;

import com.disruptor.alertsystem.model.RescueOperation;
import com.disruptor.alertsystem.model.RescueOperation.OperationStatus;
import com.disruptor.alertsystem.model.RescueRequest;
import com.disruptor.alertsystem.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RescueOperationRepository extends JpaRepository<RescueOperation, Long> {
    List<RescueOperation> findByDistrict(String district);

    List<RescueOperation> findByDistrictAndStatus(String district, OperationStatus status);

    Optional<RescueOperation> findByRescueRequest(RescueRequest rescueRequest);

    List<RescueOperation> findByOfficerInCharge(User officer);

    List<RescueOperation> findByStatus(OperationStatus status);

    List<RescueOperation> findByDistrictOrderByCreatedAtDesc(String district);

    long countByDistrict(String district);

    long countByDistrictAndStatus(String district, OperationStatus status);
}
