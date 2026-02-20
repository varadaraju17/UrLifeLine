package com.disruptor.alertsystem.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "rescue_operations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RescueOperation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "rescue_request_id", nullable = false)
    private RescueRequest rescueRequest;

    @NotBlank
    @Size(max = 100)
    private String district;

    @Column(length = 1000)
    private String assignedTeams; // Comma-separated EmergencyTeam IDs

    @Column(length = 1000)
    private String assignedVolunteers; // Comma-separated User IDs

    @ManyToOne
    @JoinColumn(name = "officer_in_charge_id", nullable = false)
    private User officerInCharge;

    @Enumerated(EnumType.STRING)
    private OperationStatus status = OperationStatus.INITIATED;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private Integer peopleRescued = 0;

    @Column(length = 2000)
    private String notes;

    @Column(length = 500)
    private String resourcesUsed; // e.g., "2 Ambulances, 1 Fire Truck, 5 Volunteers"

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (startTime == null) {
            startTime = LocalDateTime.now();
        }
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum OperationStatus {
        INITIATED,
        IN_PROGRESS,
        COMPLETED,
        FAILED,
        CANCELLED
    }
}
