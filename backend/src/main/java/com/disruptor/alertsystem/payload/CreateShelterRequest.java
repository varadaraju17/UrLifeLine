package com.disruptor.alertsystem.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateShelterRequest {
    private String name;
    private String address;
    private String district;
    private String state;
    private String pincode;
    private Double latitude;
    private Double longitude;
    private Integer totalCapacity;
    private String inChargeOfficer;
    private String phoneNumber;
    private String email;
    private Boolean hasWater;
    private Boolean hasFood;
    private Boolean hasMedical;
    private Boolean hasElectricity;
    private Boolean hasSanitation;
    private String additionalFacilities;
    private Long disasterId;
}
