package com.disruptor.alertsystem.service;

import com.disruptor.alertsystem.model.EmergencyTeam;
import com.disruptor.alertsystem.model.EmergencyTeam.TeamStatus;
import com.disruptor.alertsystem.model.EmergencyTeam.TeamType;
import com.disruptor.alertsystem.repository.EmergencyTeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmergencyTeamService {

    @Autowired
    private EmergencyTeamRepository emergencyTeamRepository;

    public EmergencyTeam createTeam(EmergencyTeam team) {
        return emergencyTeamRepository.save(team);
    }

    public List<EmergencyTeam> getAllTeams() {
        return emergencyTeamRepository.findAll();
    }

    public Optional<EmergencyTeam> getTeamById(Long id) {
        return emergencyTeamRepository.findById(id);
    }

    public List<EmergencyTeam> getTeamsByDistrict(String district) {
        return emergencyTeamRepository.findByDistrictIgnoreCase(district);
    }

    public List<EmergencyTeam> getAvailableTeamsByDistrict(String district) {
        return emergencyTeamRepository.findByDistrictIgnoreCaseAndStatus(district, TeamStatus.AVAILABLE);
    }

    public List<EmergencyTeam> getTeamsByDistrictAndType(String district, TeamType teamType) {
        return emergencyTeamRepository.findByDistrictIgnoreCaseAndTeamType(district, teamType);
    }

    public EmergencyTeam updateTeam(Long id, EmergencyTeam teamDetails) {
        return emergencyTeamRepository.findById(id)
                .map(team -> {
                    team.setTeamName(teamDetails.getTeamName());
                    team.setTeamType(teamDetails.getTeamType());
                    team.setDistrict(teamDetails.getDistrict());
                    team.setContactPerson(teamDetails.getContactPerson());
                    team.setPhoneNumber(teamDetails.getPhoneNumber());
                    team.setEmail(teamDetails.getEmail());
                    team.setVehicleCount(teamDetails.getVehicleCount());
                    team.setPersonnelCount(teamDetails.getPersonnelCount());
                    team.setStatus(teamDetails.getStatus());
                    team.setBaseLocation(teamDetails.getBaseLocation());
                    team.setLatitude(teamDetails.getLatitude());
                    team.setLongitude(teamDetails.getLongitude());
                    team.setNotes(teamDetails.getNotes());
                    return emergencyTeamRepository.save(team);
                })
                .orElseThrow(() -> new RuntimeException("Team not found with id: " + id));
    }

    public EmergencyTeam updateTeamStatus(Long id, TeamStatus status) {
        return emergencyTeamRepository.findById(id)
                .map(team -> {
                    team.setStatus(status);
                    return emergencyTeamRepository.save(team);
                })
                .orElseThrow(() -> new RuntimeException("Team not found with id: " + id));
    }

    public void deleteTeam(Long id) {
        emergencyTeamRepository.deleteById(id);
    }

    public long countTeamsByDistrict(String district) {
        return emergencyTeamRepository.countByDistrictIgnoreCase(district);
    }

    public long countAvailableTeamsByDistrict(String district) {
        return emergencyTeamRepository.countByDistrictIgnoreCaseAndStatus(district, TeamStatus.AVAILABLE);
    }

    public long countAllTeams() {
        return emergencyTeamRepository.count();
    }
}
