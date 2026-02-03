package com.disruptor.alertsystem.repository;

import com.disruptor.alertsystem.model.CitizenQuery;
import com.disruptor.alertsystem.model.QueryStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CitizenQueryRepository extends JpaRepository<CitizenQuery, Long> {
    List<CitizenQuery> findByCitizenId(Long citizenId);
    List<CitizenQuery> findByStatus(QueryStatus status);
    List<CitizenQuery> findByAssignedOfficerId(Long officerId);
    List<CitizenQuery> findByDisasterId(Long disasterId);
    List<CitizenQuery> findByState(String state);
    List<CitizenQuery> findByDistrict(String district);
    List<CitizenQuery> findByStateAndDistrict(String state, String district);
}
