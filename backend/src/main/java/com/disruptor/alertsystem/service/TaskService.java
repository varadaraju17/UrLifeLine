package com.disruptor.alertsystem.service;

import com.disruptor.alertsystem.model.*;
import com.disruptor.alertsystem.payload.CreateTaskRequest;
import com.disruptor.alertsystem.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class TaskService {
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final DisasterRepository disasterRepository;
    private final AffectedAreaRepository affectedAreaRepository;

    public Task createTask(CreateTaskRequest request, User adminUser) {
        User assignedOfficer = userRepository.findById(request.getAssignedToId())
                .orElseThrow(() -> new RuntimeException("Officer not found"));

        if (!assignedOfficer.getRole().equals(ERole.ROLE_OFFICER)) {
            throw new RuntimeException("User must be an officer");
        }

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setAssignedTo(assignedOfficer);
        task.setCreatedBy(adminUser);
        task.setLocation(request.getLocation());
        task.setDistrict(request.getDistrict());
        task.setState(request.getState());
        task.setLatitude(request.getLatitude());
        task.setLongitude(request.getLongitude());
        task.setTaskType(TaskType.valueOf(request.getTaskType()));
        task.setPriority(TaskPriority.valueOf(request.getPriority()));
        task.setStatus(TaskStatus.ASSIGNED);
        task.setProgressPercentage(0);

        if (request.getDisasterId() != null) {
            Disaster disaster = disasterRepository.findById(request.getDisasterId())
                    .orElseThrow(() -> new RuntimeException("Disaster not found"));
            task.setDisaster(disaster);
        }

        if (request.getAffectedAreaId() != null) {
            AffectedArea area = affectedAreaRepository.findById(request.getAffectedAreaId())
                    .orElseThrow(() -> new RuntimeException("Affected Area not found"));
            task.setAffectedArea(area);
        }

        if (request.getDueDate() != null) {
            DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
            task.setDueDate(LocalDateTime.parse(request.getDueDate(), formatter));
        }

        return taskRepository.save(task);
    }

    public Task updateTaskStatus(Long id, String status) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setStatus(TaskStatus.valueOf(status));
        return taskRepository.save(task);
    }

    public Task updateTaskProgress(Long id, Integer progress, String notes) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setProgressPercentage(progress);
        task.setNotes(notes);

        if (progress >= 100) {
            task.setStatus(TaskStatus.COMPLETED);
            task.setCompletedAt(LocalDateTime.now());
        } else if (!task.getStatus().equals(TaskStatus.IN_PROGRESS)) {
            task.setStatus(TaskStatus.IN_PROGRESS);
        }

        return taskRepository.save(task);
    }

    public Optional<Task> getTask(Long id) {
        return taskRepository.findById(id);
    }

    public List<Task> getTasksByOfficer(Long officerId) {
        return taskRepository.findByAssignedToId(officerId);
    }

    public List<Task> getTasksByOfficerAndStatus(Long officerId, String status) {
        return taskRepository.findByAssignedToIdAndStatus(officerId, TaskStatus.valueOf(status));
    }

    public List<Task> getTasksByAdmin(Long adminId) {
        return taskRepository.findByCreatedById(adminId);
    }

    public List<Task> getTasksByDisaster(Long disasterId) {
        return taskRepository.findByDisasterId(disasterId);
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}
