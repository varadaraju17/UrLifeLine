package com.disruptor.alertsystem.repository;

import com.disruptor.alertsystem.model.Disaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisasterRepository extends JpaRepository<Disaster, Long> {
    List<Disaster> findByRegion(String region);
    List<Disaster> findByStatus(String status);
}