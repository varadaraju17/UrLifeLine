package com.disruptor.alertsystem.repository;

import com.disruptor.alertsystem.model.Task;
import com.disruptor.alertsystem.model.TaskStatus;
import com.disruptor.alertsystem.model.TaskType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByAssignedToId(Long officerId);
    List<Task> findByAssignedToIdAndStatus(Long officerId, TaskStatus status);
    List<Task> findByCreatedById(Long adminId);
    List<Task> findByStatus(TaskStatus status);
    List<Task> findByTaskType(TaskType type);
    List<Task> findByLocation(String location);
    List<Task> findByStateAndDistrict(String state, String district);
    List<Task> findByDisasterId(Long disasterId);
}
