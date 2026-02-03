package com.disruptor.alertsystem.controller;

import com.disruptor.alertsystem.model.*;
import com.disruptor.alertsystem.payload.MessageResponse;
import com.disruptor.alertsystem.repository.DisasterRepository;
import com.disruptor.alertsystem.repository.TaskRepository;
import com.disruptor.alertsystem.repository.UserRepository;
import com.disruptor.alertsystem.service.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/rescue")
public class RescueController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DisasterRepository disasterRepository;

    // Admin endpoint to assign a Task to an Officer
    @PostMapping("/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> assignTask(@RequestParam Long officerId, @RequestParam Long disasterId, @RequestParam String title, @RequestParam String description) {
        User officer = userRepository.findById(officerId).orElse(null);
        if (officer == null || !ERole.ROLE_OFFICER.equals(officer.getRole())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid officer"));
        }

        Disaster disaster = disasterRepository.findById(disasterId).orElse(null);
        if (disaster == null) {
            return ResponseEntity.badRequest().body(new MessageResponse("Disaster not found"));
        }

        Task task = new Task();
        task.setTitle(title);
        task.setDescription(description);
        task.setAssignedTo(officer);
        task.setDisaster(disaster);
        task.setStatus(TaskStatus.ASSIGNED);
        task.setProgressPercentage(0);
        task.setCreatedAt(LocalDateTime.now());
        
        taskRepository.save(task);

        return ResponseEntity.ok(new MessageResponse("Task assigned successfully"));
    }

    // Officer endpoint to view assigned tasks
    @GetMapping("/tasks")
    @PreAuthorize("hasRole('OFFICER')")
    public ResponseEntity<List<Task>> getAssignedTasks() {
        Authentication authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<Task> tasks = taskRepository.findByAssignedToId(userDetails.getId());
        return ResponseEntity.ok(tasks);
    }

    // Officer endpoint to update task status
    @PutMapping("/update/{taskId}")
    @PreAuthorize("hasRole('OFFICER')")
    public ResponseEntity<?> updateTaskStatus(@PathVariable Long taskId, @RequestParam TaskStatus status) {
        Authentication authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        Task task = taskRepository.findById(taskId).orElse(null);
        if (task == null || !task.getAssignedTo().getId().equals(userDetails.getId())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Task not found or not assigned to you"));
        }

        task.setStatus(status);
        task.setUpdatedAt(LocalDateTime.now());
        taskRepository.save(task);

        return ResponseEntity.ok(new MessageResponse("Task status updated"));
    }
}