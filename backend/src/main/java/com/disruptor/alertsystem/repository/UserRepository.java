package com.disruptor.alertsystem.repository;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.disruptor.alertsystem.model.User;
import com.disruptor.alertsystem.model.ERole;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByEmail(String email);
  Boolean existsByEmail(String email);
  List<User> findByRole(ERole role);
  List<User> findByRegion(String region);
  List<User> findByAssignedAdminId(Long adminId);
  List<User> findByRoleAndState(ERole role, String state);
  List<User> findByRoleAndDistrict(ERole role, String district);
  List<User> findByStateAndDistrict(String state, String district);
}
