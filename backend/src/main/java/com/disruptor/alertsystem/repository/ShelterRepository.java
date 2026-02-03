package com.disruptor.alertsystem.repository;

import com.disruptor.alertsystem.model.Shelter;
import com.disruptor.alertsystem.model.ShelterStatus;
import com.disruptor.alertsystem.model.Disaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShelterRepository extends JpaRepository<Shelter, Long> {
    List<Shelter> findByDisaster(Disaster disaster);
    List<Shelter> findByState(String state);
    List<Shelter> findByDistrict(String district);
    List<Shelter> findByStatus(ShelterStatus status);
    List<Shelter> findByStateAndDistrict(String state, String district);
    List<Shelter> findByStatusAndCurrentOccupancyLessThan(ShelterStatus status, Integer capacity);
}
