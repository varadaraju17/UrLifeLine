package com.disruptor.alertsystem.controller;

import com.disruptor.alertsystem.model.Resource;
import com.disruptor.alertsystem.payload.CreateResourceRequest;
import com.disruptor.alertsystem.payload.MessageResponse;
import com.disruptor.alertsystem.service.ResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/resources")
public class ResourceController {

    @Autowired
    private ResourceService resourceService;

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OFFICER')")
    public ResponseEntity<?> createResource(@RequestBody CreateResourceRequest request) {
        try {
            Resource resource = resourceService.createResource(request);
            return ResponseEntity.ok(resource);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getResource(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(resourceService.getResource(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<?> getResourcesByType(@PathVariable String type) {
        try {
            List<Resource> resources = resourceService.getResourcesByType(type);
            return ResponseEntity.ok(resources);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/disaster/{disasterId}")
    public ResponseEntity<?> getResourcesByDisaster(@PathVariable Long disasterId) {
        try {
            List<Resource> resources = resourceService.getResourcesByDisaster(disasterId);
            return ResponseEntity.ok(resources);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/available")
    public ResponseEntity<?> getAvailableResources() {
        try {
            List<Resource> resources = resourceService.getAvailableResources();
            return ResponseEntity.ok(resources);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/state/{state}")
    public ResponseEntity<?> getResourcesByState(@PathVariable String state) {
        try {
            List<Resource> resources = resourceService.getResourcesByState(state);
            return ResponseEntity.ok(resources);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OFFICER')")
    public ResponseEntity<?> updateResource(@PathVariable Long id, @RequestBody CreateResourceRequest request) {
        try {
            Resource resource = resourceService.updateResource(id, request);
            return ResponseEntity.ok(resource);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/quantity")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OFFICER')")
    public ResponseEntity<?> updateQuantity(@PathVariable Long id, @RequestParam Integer quantity) {
        try {
            Resource resource = resourceService.updateAvailableQuantity(id, quantity);
            return ResponseEntity.ok(resource);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteResource(@PathVariable Long id) {
        try {
            resourceService.deleteResource(id);
            return ResponseEntity.ok(new MessageResponse("Resource deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
}
