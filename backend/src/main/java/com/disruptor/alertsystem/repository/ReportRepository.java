package com.disruptor.alertsystem.repository;

import com.disruptor.alertsystem.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByDisasterId(Long disasterId);
    List<Report> findByResponderId(Long responderId);
}