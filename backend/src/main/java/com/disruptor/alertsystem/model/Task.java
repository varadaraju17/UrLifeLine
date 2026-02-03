package com.disruptor.alertsystem.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Task {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String title;
  private String description;

  // Assignment information
  @ManyToOne
  @JoinColumn(name = "assigned_to_id", nullable = false)
  private User assignedTo; // Officer who is assigned

  @ManyToOne
  @JoinColumn(name = "created_by_id", nullable = false)
  private User createdBy; // Admin who created the task

  // Location and area information
  private String location;
  private String district;
  private String state;
  private Double latitude;
  private Double longitude;

  // Task details
  @Enumerated(EnumType.STRING)
  private TaskStatus status;

  @Enumerated(EnumType.STRING)
  private TaskPriority priority;

  @Enumerated(EnumType.STRING)
  private TaskType taskType;

  // Associated disaster
  @ManyToOne
  @JoinColumn(name = "disaster_id")
  private Disaster disaster;

  // Associated affected area
  @ManyToOne
  @JoinColumn(name = "affected_area_id")
  private AffectedArea affectedArea;

  // Timeline
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
  private LocalDateTime dueDate;
  private LocalDateTime completedAt;

  // Progress and notes
  private Integer progressPercentage;
  private String notes;
  private String updateLog;

  @PrePersist
  public void prePersist() {
    createdAt = LocalDateTime.now();
    updatedAt = LocalDateTime.now();
    progressPercentage = progressPercentage == null ? 0 : progressPercentage;
  }

  @PreUpdate
  public void preUpdate() {
    updatedAt = LocalDateTime.now();
  }
}
