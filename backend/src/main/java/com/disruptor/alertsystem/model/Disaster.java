package com.disruptor.alertsystem.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "disasters")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Disaster {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type;

    private String severity;

    private String status;

    private String region;
    
    private String district;
    
    private String state;
    
    private Double latitude;
    
    private Double longitude;

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDateTime timestamp;
    
    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
    
    @ManyToOne
    @JoinColumn(name = "created_by_id")
    private User createdBy;
    
    private Integer estimatedAffectedPopulation;

    public Disaster(String type, String severity, String status, String region, String description, LocalDateTime timestamp) {
        this.type = type;
        this.severity = severity;
        this.status = status;
        this.region = region;
        this.description = description;
        this.timestamp = timestamp;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
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
