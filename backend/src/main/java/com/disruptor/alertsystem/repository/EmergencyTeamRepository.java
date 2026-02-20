package com.disruptor.alertsystem.repository;

import com.disruptor.alertsystem.model.EmergencyTeam;
import com.disruptor.alertsystem.model.EmergencyTeam.TeamStatus;
import com.disruptor.alertsystem.model.EmergencyTeam.TeamType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmergencyTeamRepository extends JpaRepository<EmergencyTeam, Long> {
    List<EmergencyTeam> findByDistrictIgnoreCase(String district);

    List<EmergencyTeam> findByDistrictIgnoreCaseAndStatus(String district, TeamStatus status);

    List<EmergencyTeam> findByDistrictIgnoreCaseAndTeamType(String district, TeamType teamType);

    List<EmergencyTeam> findByStatus(TeamStatus status);

    List<EmergencyTeam> findByTeamType(TeamType teamType);

    long countByDistrictIgnoreCase(String district);

    long countByDistrictIgnoreCaseAndStatus(String district, TeamStatus status);
}
