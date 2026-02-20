package com.disruptor.alertsystem.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "emergency_teams")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmergencyTeam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Size(max = 100)
    private String teamName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TeamType teamType;

    @NotBlank
    @Size(max = 100)
    private String district;

    @NotBlank
    @Size(max = 100)
    private String contactPerson;

    @NotBlank
    @Size(max = 15)
    private String phoneNumber;

    @Size(max = 100)
    private String email;

    private Integer vehicleCount = 0;

    private Integer personnelCount = 0;

    @Enumerated(EnumType.STRING)
    private TeamStatus status = TeamStatus.AVAILABLE;

    @Column(length = 500)
    private String baseLocation;

    private Double latitude;

    private Double longitude;

    @Column(length = 1000)
    private String notes;

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

    public enum TeamType {
        AMBULANCE,
        FIRE,
        NDRF,
        POLICE,
        MEDICAL,
        SEARCH_RESCUE,
        CIVIL_DEFENSE,
        OTHER
    }

    public enum TeamStatus {
        AVAILABLE,
        DEPLOYED,
        UNAVAILABLE,
        MAINTENANCE
    }
}
