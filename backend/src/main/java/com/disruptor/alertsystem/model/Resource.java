package com.disruptor.alertsystem.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "resources")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Resource {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Enumerated(EnumType.STRING)
  private ResourceType resourceType;

  private String resourceName;
  private String description;

  // Quantity information
  private Integer totalQuantity;
  private Integer availableQuantity;
  private String unit; // kg, liters, units, etc.

  // Location information
  private String location;
  private String address;
  private String district;
  private String state;
  private String pincode;

  // Geolocation
  private Double latitude;
  private Double longitude;

  // Contact information
  private String manager;
  private String phoneNumber;
  private String email;

  // Associated disaster
  @ManyToOne
  @JoinColumn(name = "disaster_id")
  private Disaster disaster;

  // Assigned officer
  @ManyToOne
  @JoinColumn(name = "assigned_officer_id")
  private User assignedOfficer;

  // Status
  @Enumerated(EnumType.STRING)
  private ResourceStatus status;

  // Priority level
  @Enumerated(EnumType.STRING)
  private ResourcePriority priority;

  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  @PrePersist
  public void prePersist() {
    createdAt = LocalDateTime.now();
    updatedAt = LocalDateTime.now();
    availableQuantity = availableQuantity == null ? totalQuantity : availableQuantity;
  }

  @PreUpdate
  public void preUpdate() {
    updatedAt = LocalDateTime.now();
  }
}
