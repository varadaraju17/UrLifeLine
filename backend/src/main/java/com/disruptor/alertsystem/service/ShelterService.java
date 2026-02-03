package com.disruptor.alertsystem.service;

import com.disruptor.alertsystem.model.*;
import com.disruptor.alertsystem.payload.CreateShelterRequest;
import com.disruptor.alertsystem.repository.ShelterRepository;
import com.disruptor.alertsystem.repository.DisasterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class ShelterService {
    private final ShelterRepository shelterRepository;
    private final DisasterRepository disasterRepository;

    public Shelter createShelter(CreateShelterRequest request) {
        Disaster disaster = null;
        if (request.getDisasterId() != null) {
            disaster = disasterRepository.findById(request.getDisasterId())
                    .orElseThrow(() -> new RuntimeException("Disaster not found"));
        }

        Shelter shelter = new Shelter();
        shelter.setName(request.getName());
        shelter.setAddress(request.getAddress());
        shelter.setDistrict(request.getDistrict());
        shelter.setState(request.getState());
        shelter.setPincode(request.getPincode());
        shelter.setLatitude(request.getLatitude());
        shelter.setLongitude(request.getLongitude());
        shelter.setTotalCapacity(request.getTotalCapacity());
        shelter.setCurrentOccupancy(0);
        shelter.setInChargeOfficer(request.getInChargeOfficer());
        shelter.setPhoneNumber(request.getPhoneNumber());
        shelter.setEmail(request.getEmail());
        shelter.setHasWater(request.getHasWater() != null ? request.getHasWater() : false);
        shelter.setHasFood(request.getHasFood() != null ? request.getHasFood() : false);
        shelter.setHasMedical(request.getHasMedical() != null ? request.getHasMedical() : false);
        shelter.setHasElectricity(request.getHasElectricity() != null ? request.getHasElectricity() : false);
        shelter.setHasSanitation(request.getHasSanitation() != null ? request.getHasSanitation() : false);
        shelter.setAdditionalFacilities(request.getAdditionalFacilities());
        shelter.setStatus(ShelterStatus.OPERATIONAL);
        shelter.setDisaster(disaster);

        return shelterRepository.save(shelter);
    }

    public Shelter updateShelter(Long id, CreateShelterRequest request) {
        Shelter shelter = shelterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shelter not found"));

        shelter.setName(request.getName());
        shelter.setAddress(request.getAddress());
        shelter.setDistrict(request.getDistrict());
        shelter.setState(request.getState());
        shelter.setPincode(request.getPincode());
        shelter.setLatitude(request.getLatitude());
        shelter.setLongitude(request.getLongitude());
        shelter.setTotalCapacity(request.getTotalCapacity());
        shelter.setInChargeOfficer(request.getInChargeOfficer());
        shelter.setPhoneNumber(request.getPhoneNumber());
        shelter.setEmail(request.getEmail());
        shelter.setHasWater(request.getHasWater());
        shelter.setHasFood(request.getHasFood());
        shelter.setHasMedical(request.getHasMedical());
        shelter.setHasElectricity(request.getHasElectricity());
        shelter.setHasSanitation(request.getHasSanitation());
        shelter.setAdditionalFacilities(request.getAdditionalFacilities());

        return shelterRepository.save(shelter);
    }

    public Shelter updateOccupancy(Long id, Integer newOccupancy) {
        Shelter shelter = shelterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shelter not found"));

        if (newOccupancy > shelter.getTotalCapacity()) {
            throw new RuntimeException("Occupancy cannot exceed total capacity");
        }

        shelter.setCurrentOccupancy(newOccupancy);

        if (newOccupancy >= shelter.getTotalCapacity()) {
            shelter.setStatus(ShelterStatus.FULL);
        } else if (shelter.getStatus().equals(ShelterStatus.FULL)) {
            shelter.setStatus(ShelterStatus.OPERATIONAL);
        }

        return shelterRepository.save(shelter);
    }

    public Shelter updateStatus(Long id, String status) {
        Shelter shelter = shelterRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shelter not found"));
        shelter.setStatus(ShelterStatus.valueOf(status));
        return shelterRepository.save(shelter);
    }

    public Optional<Shelter> getShelter(Long id) {
        return shelterRepository.findById(id);
    }

    public List<Shelter> getSheltersByState(String state) {
        return shelterRepository.findByState(state);
    }

    public List<Shelter> getSheltersByDistrict(String district) {
        return shelterRepository.findByDistrict(district);
    }

    public List<Shelter> getSheltersByDisaster(Long disasterId) {
        Disaster disaster = disasterRepository.findById(disasterId)
                .orElseThrow(() -> new RuntimeException("Disaster not found"));
        return shelterRepository.findByDisaster(disaster);
    }

    public List<Shelter> getAvailableShelters(String state, String district) {
        return shelterRepository.findByStatusAndCurrentOccupancyLessThan(ShelterStatus.OPERATIONAL, Integer.MAX_VALUE);
    }

    public List<Shelter> getAllShelters() {
        return shelterRepository.findAll();
    }

    public void deleteShelter(Long id) {
        shelterRepository.deleteById(id);
    }
}
