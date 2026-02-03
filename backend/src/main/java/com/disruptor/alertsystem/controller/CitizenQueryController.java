package com.disruptor.alertsystem.controller;

import com.disruptor.alertsystem.model.CitizenQuery;
import com.disruptor.alertsystem.model.User;
import com.disruptor.alertsystem.payload.CreateQueryRequest;
import com.disruptor.alertsystem.payload.MessageResponse;
import com.disruptor.alertsystem.repository.UserRepository;
import com.disruptor.alertsystem.service.CitizenQueryService;
import com.disruptor.alertsystem.service.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/queries")
public class CitizenQueryController {

    @Autowired
    private CitizenQueryService queryService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/create")
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<?> createQuery(@RequestBody CreateQueryRequest request, Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            CitizenQuery query = queryService.createQuery(userDetails.getId(), request);
            return ResponseEntity.ok(query);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getQuery(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(queryService.getQuery(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/citizen/my-queries")
    @PreAuthorize("hasRole('CITIZEN')")
    public ResponseEntity<?> getMyQueries(Authentication authentication) {
        try {
            UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
            List<CitizenQuery> queries = queryService.getQueriesByCitizen(userDetails.getId());
            return ResponseEntity.ok(queries);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/officer/{officerId}")
    @PreAuthorize("hasRole('OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<?> getQueriesByOfficer(@PathVariable Long officerId) {
        try {
            List<CitizenQuery> queries = queryService.getQueriesByOfficer(officerId);
            return ResponseEntity.ok(queries);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/disaster/{disasterId}")
    public ResponseEntity<?> getQueriesByDisaster(@PathVariable Long disasterId) {
        try {
            List<CitizenQuery> queries = queryService.getQueriesByDisaster(disasterId);
            return ResponseEntity.ok(queries);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/open")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OFFICER')")
    public ResponseEntity<?> getOpenQueries() {
        try {
            List<CitizenQuery> queries = queryService.getOpenQueries();
            return ResponseEntity.ok(queries);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllQueries() {
        try {
            List<CitizenQuery> queries = queryService.getAllQueries();
            return ResponseEntity.ok(queries);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/assign/{officerId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('OFFICER')")
    public ResponseEntity<?> assignOfficer(@PathVariable Long id, @PathVariable Long officerId) {
        try {
            CitizenQuery query = queryService.assignOfficer(id, officerId);
            return ResponseEntity.ok(query);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @PutMapping("/{id}/respond")
    @PreAuthorize("hasRole('OFFICER') or hasRole('ADMIN')")
    public ResponseEntity<?> respondToQuery(@PathVariable Long id, @RequestParam String response) {
        try {
            CitizenQuery query = queryService.respondToQuery(id, response);
            return ResponseEntity.ok(query);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteQuery(@PathVariable Long id) {
        try {
            queryService.deleteQuery(id);
            return ResponseEntity.ok(new MessageResponse("Query deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
}
