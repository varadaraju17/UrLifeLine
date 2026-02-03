package com.disruptor.alertsystem.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateResourceRequest {
    private String resourceType;
    private String resourceName;
    private String description;
    private Integer totalQuantity;
    private String unit;
    private String location;
    private String address;
    private String district;
    private String state;
    private String pincode;
    private Double latitude;
    private Double longitude;
    private String manager;
    private String phoneNumber;
    private String email;
    private Long disasterId;
    private String priority;
}
