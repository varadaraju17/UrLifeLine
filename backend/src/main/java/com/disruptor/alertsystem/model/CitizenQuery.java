package com.disruptor.alertsystem.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "citizen_queries")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CitizenQuery {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "citizen_id", nullable = false)
  private User citizen;

  private String subject;
  private String message;
  private String category;

  // Location information
  private String location;
  private String district;
  private String state;

  // Status and response
  @Enumerated(EnumType.STRING)
  private QueryStatus status;

  @ManyToOne
  @JoinColumn(name = "assigned_officer_id")
  private User assignedOfficer;

  private String response;
  private LocalDateTime responseDate;

  // Related disaster
  @ManyToOne
  @JoinColumn(name = "disaster_id")
  private Disaster disaster;

  // Timeline
  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;
  private Integer priorityLevel;

  @PrePersist
  public void prePersist() {
    createdAt = LocalDateTime.now();
    updatedAt = LocalDateTime.now();
  }

  @PreUpdate
  public void preUpdate() {
    updatedAt = LocalDateTime.now();
  }
}
