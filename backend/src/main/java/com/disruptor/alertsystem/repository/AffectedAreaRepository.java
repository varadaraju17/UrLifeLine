package com.disruptor.alertsystem.repository;

import com.disruptor.alertsystem.model.AffectedArea;
import com.disruptor.alertsystem.model.AffectedAreaSeverity;
import com.disruptor.alertsystem.model.Disaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AffectedAreaRepository extends JpaRepository<AffectedArea, Long> {
    List<AffectedArea> findByDisaster(Disaster disaster);
    List<AffectedArea> findByDisasterIdAndSeverity(Long disasterId, AffectedAreaSeverity severity);
    List<AffectedArea> findByState(String state);
    List<AffectedArea> findByDistrict(String district);
    List<AffectedArea> findByAssignedOfficerId(Long officerId);
    List<AffectedArea> findByStateAndDistrict(String state, String district);
}
