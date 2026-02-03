package com.disruptor.alertsystem.service;

import com.disruptor.alertsystem.model.*;
import com.disruptor.alertsystem.payload.CreateResourceRequest;
import com.disruptor.alertsystem.repository.ResourceRepository;
import com.disruptor.alertsystem.repository.DisasterRepository;
import com.disruptor.alertsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ResourceService {
    private final ResourceRepository resourceRepository;
    private final DisasterRepository disasterRepository;
    private final UserRepository userRepository;

    public Resource createResource(CreateResourceRequest request) {
        Disaster disaster = null;
        if (request.getDisasterId() != null) {
            disaster = disasterRepository.findById(request.getDisasterId())
                    .orElseThrow(() -> new RuntimeException("Disaster not found"));
        }

        Resource resource = new Resource();
        resource.setResourceType(ResourceType.valueOf(request.getResourceType()));
        resource.setResourceName(request.getResourceName());
        resource.setDescription(request.getDescription());
        resource.setTotalQuantity(request.getTotalQuantity());
        resource.setAvailableQuantity(request.getTotalQuantity());
        resource.setUnit(request.getUnit());
        resource.setLocation(request.getLocation());
        resource.setAddress(request.getAddress());
        resource.setDistrict(request.getDistrict());
        resource.setState(request.getState());
        resource.setPincode(request.getPincode());
        resource.setLatitude(request.getLatitude());
        resource.setLongitude(request.getLongitude());
        resource.setManager(request.getManager());
        resource.setPhoneNumber(request.getPhoneNumber());
        resource.setEmail(request.getEmail());
        resource.setDisaster(disaster);
        resource.setStatus(ResourceStatus.AVAILABLE);
        resource.setPriority(ResourcePriority.valueOf(request.getPriority() != null ? request.getPriority() : "MEDIUM"));

        return resourceRepository.save(resource);
    }

    public Resource updateResource(Long id, CreateResourceRequest request) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));

        resource.setResourceName(request.getResourceName());
        resource.setDescription(request.getDescription());
        resource.setTotalQuantity(request.getTotalQuantity());
        resource.setUnit(request.getUnit());
        resource.setLocation(request.getLocation());
        resource.setAddress(request.getAddress());
        resource.setDistrict(request.getDistrict());
        resource.setState(request.getState());
        resource.setPincode(request.getPincode());
        resource.setLatitude(request.getLatitude());
        resource.setLongitude(request.getLongitude());
        resource.setManager(request.getManager());
        resource.setPhoneNumber(request.getPhoneNumber());
        resource.setEmail(request.getEmail());

        return resourceRepository.save(resource);
    }

    public Resource updateAvailableQuantity(Long id, Integer quantity) {
        Resource resource = resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));
        resource.setAvailableQuantity(quantity);
        if (quantity <= 0) {
            resource.setStatus(ResourceStatus.DEPLETED);
        } else if (resource.getStatus().equals(ResourceStatus.DEPLETED)) {
            resource.setStatus(ResourceStatus.AVAILABLE);
        }
        return resourceRepository.save(resource);
    }

    public Optional<Resource> getResource(Long id) {
        return resourceRepository.findById(id);
    }

    public List<Resource> getResourcesByType(String type) {
        return resourceRepository.findByResourceType(ResourceType.valueOf(type));
    }

    public List<Resource> getResourcesByDisaster(Long disasterId) {
        Disaster disaster = disasterRepository.findById(disasterId)
                .orElseThrow(() -> new RuntimeException("Disaster not found"));
        return resourceRepository.findByDisaster(disaster);
    }

    public List<Resource> getAvailableResources() {
        return resourceRepository.findByStatus(ResourceStatus.AVAILABLE);
    }

    public List<Resource> getResourcesByState(String state) {
        return resourceRepository.findByState(state);
    }

    public void deleteResource(Long id) {
        resourceRepository.deleteById(id);
    }
}
