package com.disruptor.alertsystem.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "affected_areas")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AffectedArea {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "disaster_id")
  private Disaster disaster;

  private String areaName;
  private String address;
  private String district;
  private String state;
  private String pincode;

  // Geolocation
  private Double latitude;
  private Double longitude;
  private Double radius; // Radius in meters

  // Severity and impact
  @Enumerated(EnumType.STRING)
  private AffectedAreaSeverity severity;

  private Integer estimatedAffectedPopulation;
  private String damageDescription;

  // Status
  @Enumerated(EnumType.STRING)
  private AffectedAreaStatus status;

  // Assigned officer
  @ManyToOne
  @JoinColumn(name = "assigned_officer_id")
  private User assignedOfficer;

  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

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
