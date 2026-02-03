package com.disruptor.alertsystem.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateQueryRequest {
    private String subject;
    private String message;
    private String category;
    private String location;
    private String district;
    private String state;
    private Long disasterId;
}
