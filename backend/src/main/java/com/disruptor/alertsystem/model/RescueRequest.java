package com.disruptor.alertsystem.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "rescue_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RescueRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "citizen_id", nullable = false)
    private User citizen;

    @NotBlank
    @Size(max = 100)
    private String district;

    @NotBlank
    @Size(max = 50)
    private String state;

    @NotBlank
    @Size(max = 50)
    private String rescueType;

    @Column(length = 500)
    private String location;

    private Double latitude;

    private Double longitude;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private UrgencyLevel urgencyLevel;

    @Column(length = 1000)
    private String description;

    private Integer numberOfPeople = 1;

    @Column(length = 500)
    private String specialNeeds; // e.g., "Elderly, Medical Emergency, Children"

    @Enumerated(EnumType.STRING)
    private RequestStatus status = RequestStatus.PENDING;

    @ManyToOne
    @JoinColumn(name = "assigned_officer_id")
    private User assignedOfficer;

    @Column(length = 1000)
    private String assignedTeamIds; // Comma-separated list of EmergencyTeam IDs

    @Column(length = 1000)
    private String notifiedVolunteerIds; // Comma-separated list of User IDs

    @Column(length = 1000)
    private String notes;

    private LocalDateTime createdAt;

    private LocalDateTime respondedAt;

    private LocalDateTime completedAt;

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

    public enum UrgencyLevel {
        LOW,
        MEDIUM,
        HIGH,
        CRITICAL
    }

    public enum RequestStatus {
        PENDING,
        ASSIGNED,
        IN_PROGRESS,
        COMPLETED,
        CANCELLED
    }
}
