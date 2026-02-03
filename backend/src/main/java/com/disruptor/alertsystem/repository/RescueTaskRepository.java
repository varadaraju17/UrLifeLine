package com.disruptor.alertsystem.repository;

import com.disruptor.alertsystem.model.RescueTask;
import com.disruptor.alertsystem.model.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RescueTaskRepository extends JpaRepository<RescueTask, Long> {
    List<RescueTask> findByResponderId(Long responderId);
    List<RescueTask> findByTaskStatus(TaskStatus taskStatus);
    List<RescueTask> findByDisasterId(Long disasterId);
}