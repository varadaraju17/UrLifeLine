package com.disruptor.alertsystem.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "rescue_tasks")
@Data
@NoArgsConstructor
public class RescueTask {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "responder_id")
    private User responder;

    @ManyToOne
    @JoinColumn(name = "disaster_id")
    private Disaster disaster;

    @Enumerated(EnumType.STRING)
    private TaskStatus taskStatus;

    @Column(columnDefinition = "TEXT")
    private String description;

    private LocalDateTime updatedAt;

    public RescueTask(User responder, Disaster disaster, TaskStatus taskStatus, String description, LocalDateTime updatedAt) {
        this.responder = responder;
        this.disaster = disaster;
        this.taskStatus = taskStatus;
        this.description = description;
        this.updatedAt = updatedAt;
    }
}