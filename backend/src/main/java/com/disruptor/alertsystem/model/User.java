package com.disruptor.alertsystem.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "users", 
       uniqueConstraints = { 
           @UniqueConstraint(columnNames = "email") 
       })
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NotBlank
  @Size(max = 50)
  private String name;

  @NotBlank
  @Size(max = 50)
  @Email
  private String email;

  @NotBlank
  @Size(max = 120)
  private String password;
  
  @Enumerated(EnumType.STRING)
  private ERole role;
  
  private String phone;
  
  private String region;
  
  private String location;
  
  private String state;
  
  private String district;
  
  // For officers assigned to admin, this stores the admin's user ID
  @ManyToOne
  @JoinColumn(name = "assigned_admin_id")
  private User assignedAdmin;
  
  // For officers to show their status
  @Enumerated(EnumType.STRING)
  private OfficerStatus status;
  
  private LocalDateTime createdAt;
  
  private LocalDateTime updatedAt;
  
  private Boolean isActive = true;

  public User(String name, String email, String password, ERole role, String phone, String region, String location) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.phone = phone;
    this.region = region;
    this.location = location;
    this.createdAt = LocalDateTime.now();
    this.updatedAt = LocalDateTime.now();
    this.isActive = true;
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

