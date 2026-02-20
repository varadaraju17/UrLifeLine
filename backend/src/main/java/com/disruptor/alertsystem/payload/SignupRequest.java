package com.disruptor.alertsystem.payload;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class SignupRequest {
  @NotBlank
  @Size(min = 3, max = 50)
  private String name;

  @NotBlank
  @Size(max = 50)
  @Email
  private String email;

  private String role;

  @NotBlank
  @Size(min = 6, max = 40)
  private String password;

  private String phone;

  private String region;

  private String location; // Address

  private String state;

  private String district;

  // Volunteer fields
  private Boolean isVolunteer = false;

  private String volunteerSkills;

  private String volunteerAvailability;
}
