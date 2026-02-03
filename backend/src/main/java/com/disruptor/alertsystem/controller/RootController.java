package com.disruptor.alertsystem.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
public class RootController {

    @GetMapping("/")
    public ResponseEntity<Map<String, String>> root() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Disaster Management & Alerts System API");
        response.put("version", "1.0.0");
        response.put("status", "Running");
        response.put("baseUrl", "http://localhost:8080/api");
        response.put("h2Console", "http://localhost:8080/api/h2-console");
        response.put("endpoints", "Use /api/auth/signin, /api/auth/signup, /api/disasters, /api/alerts, etc.");
        return ResponseEntity.ok(response);
    }
}
