package com.disruptor.alertsystem.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTaskRequest {
    private String title;
    private String description;
    private Long assignedToId;
    private String location;
    private String district;
    private String state;
    private Double latitude;
    private Double longitude;
    private String taskType;
    private String priority;
    private Long affectedAreaId;
    private Long disasterId;
    private String dueDate;
}
