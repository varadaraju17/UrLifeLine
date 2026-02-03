package com.disruptor.alertsystem.service;

import com.disruptor.alertsystem.model.Disaster;
import com.disruptor.alertsystem.repository.DisasterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
public class DisasterMonitoringService {

    @Autowired
    private DisasterRepository disasterRepository;

    // Placeholder method to simulate fetching external disaster data
    public List<Map<String, Object>> fetchExternalDisasterData() {
        // Simulate data from OpenWeather or NDMA API
        // In real implementation, use RestTemplate or WebClient to call external API
        return List.of(
            Map.of("type", "Flood", "severity", "High", "region", "Delhi", "description", "Heavy rainfall causing floods"),
            Map.of("type", "Earthquake", "severity", "Moderate", "region", "Mumbai", "description", "Minor tremors detected")
        );
    }

    // Auto-categorize and save incoming data into Disaster table
    public void processAndSaveDisasterData() {
        List<Map<String, Object>> externalData = fetchExternalDisasterData();
        for (Map<String, Object> data : externalData) {
            Disaster disaster = new Disaster();
            disaster.setType((String) data.get("type"));
            disaster.setSeverity((String) data.get("severity"));
            disaster.setStatus("Active");
            disaster.setRegion((String) data.get("region"));
            disaster.setDescription((String) data.get("description"));
            disaster.setTimestamp(LocalDateTime.now());
            disasterRepository.save(disaster);
        }
    }
}