package com.disruptor.alertsystem.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "alerts")
@Data
@NoArgsConstructor
public class Alert {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "disaster_id")
    private Disaster disaster;

    @Column(columnDefinition = "TEXT")
    private String message;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    private LocalDateTime broadcastTime;

    private String status; // Sent/Pending

    private String title;
    private String state;
    private String district;

    public Alert(Disaster disaster, String message, User createdBy, LocalDateTime broadcastTime, String status) {
        this.disaster = disaster;
        this.message = message;
        this.createdBy = createdBy;
        this.broadcastTime = broadcastTime;
        this.status = status;
    }
}