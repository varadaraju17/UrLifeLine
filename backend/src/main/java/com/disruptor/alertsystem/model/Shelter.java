package com.disruptor.alertsystem.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "shelters")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Shelter {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String name;
  private String address;
  private String district;
  private String state;
  private String pincode;

  // Geolocation
  private Double latitude;
  private Double longitude;

  // Capacity and current occupancy
  private Integer totalCapacity;
  private Integer currentOccupancy;

  // Contact information
  private String inChargeOfficer;
  private String phoneNumber;
  private String email;

  // Facilities available
  private Boolean hasWater;
  private Boolean hasFood;
  private Boolean hasMedical;
  private Boolean hasElectricity;
  private Boolean hasSanitation;

  // Additional facilities
  private String additionalFacilities;

  // Status
  @Enumerated(EnumType.STRING)
  private ShelterStatus status;

  // Associated disaster
  @ManyToOne
  @JoinColumn(name = "disaster_id")
  private Disaster disaster;

  private LocalDateTime createdAt;
  private LocalDateTime updatedAt;

  @PrePersist
  public void prePersist() {
    createdAt = LocalDateTime.now();
    updatedAt = LocalDateTime.now();
    currentOccupancy = currentOccupancy == null ? 0 : currentOccupancy;
  }

  @PreUpdate
  public void preUpdate() {
    updatedAt = LocalDateTime.now();
  }
}
