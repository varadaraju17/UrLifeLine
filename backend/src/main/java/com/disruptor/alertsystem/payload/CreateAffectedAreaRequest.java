package com.disruptor.alertsystem.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateAffectedAreaRequest {
    private Long disasterId;
    private String areaName;
    private String address;
    private String district;
    private String state;
    private String pincode;
    private Double latitude;
    private Double longitude;
    private String severity;
    private Integer estimatedAffectedPopulation;
    private String damageDescription;
}
