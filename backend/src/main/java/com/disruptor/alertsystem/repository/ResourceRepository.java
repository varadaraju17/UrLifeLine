package com.disruptor.alertsystem.repository;

import com.disruptor.alertsystem.model.Resource;
import com.disruptor.alertsystem.model.ResourceType;
import com.disruptor.alertsystem.model.ResourceStatus;
import com.disruptor.alertsystem.model.Disaster;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    List<Resource> findByDisaster(Disaster disaster);
    List<Resource> findByResourceType(ResourceType type);
    List<Resource> findByStatus(ResourceStatus status);
    List<Resource> findByState(String state);
    List<Resource> findByDistrict(String district);
    List<Resource> findByAssignedOfficerId(Long officerId);
    List<Resource> findByStateAndDistrict(String state, String district);
}
