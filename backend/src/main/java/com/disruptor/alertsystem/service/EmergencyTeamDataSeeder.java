package com.disruptor.alertsystem.service;

import com.disruptor.alertsystem.model.EmergencyTeam;
import com.disruptor.alertsystem.model.EmergencyTeam.TeamStatus;
import com.disruptor.alertsystem.model.EmergencyTeam.TeamType;
import com.disruptor.alertsystem.repository.EmergencyTeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.util.*;

@Component
@Order(2) // Run after initial user seeding
public class EmergencyTeamDataSeeder implements CommandLineRunner {

        @Autowired
        private EmergencyTeamRepository teamRepository;

        // Major states and their districts
        private static final Map<String, List<String>> STATE_DISTRICTS = new HashMap<>();

        static {
                // Major states with key districts
                STATE_DISTRICTS.put("Maharashtra", Arrays.asList(
                                "Mumbai", "Pune", "Nagpur", "Thane", "Nashik", "Aurangabad", "Solapur", "Kolhapur"));
                STATE_DISTRICTS.put("Karnataka", Arrays.asList(
                                "Bengaluru", "Mysuru", "Mangaluru", "Hubballi", "Belagavi", "Kalaburagi"));
                STATE_DISTRICTS.put("Tamil Nadu", Arrays.asList(
                                "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Tirunelveli"));
                STATE_DISTRICTS.put("Gujarat", Arrays.asList(
                                "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar", "Jamnagar"));
                STATE_DISTRICTS.put("Rajasthan", Arrays.asList(
                                "Jaipur", "Jodhpur", "Udaipur", "Kota", "Ajmer", "Bikaner"));
                STATE_DISTRICTS.put("Uttar Pradesh", Arrays.asList(
                                "Lucknow", "Kanpur", "Ghaziabad", "Agra", "Varanasi", "Meerut", "Prayagraj"));
                STATE_DISTRICTS.put("West Bengal", Arrays.asList(
                                "Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Darjeeling"));
                STATE_DISTRICTS.put("Madhya Pradesh", Arrays.asList(
                                "Indore", "Bhopal", "Jabalpur", "Gwalior", "Ujjain", "Sagar"));
                STATE_DISTRICTS.put("Delhi", Arrays.asList(
                                "Central Delhi", "North Delhi", "South Delhi", "East Delhi", "West Delhi"));
                STATE_DISTRICTS.put("Punjab", Arrays.asList(
                                "Ludhiana", "Amritsar", "Jalandhar", "Patiala", "Bathinda"));
                STATE_DISTRICTS.put("Haryana", Arrays.asList(
                                "Gurgaon", "Faridabad", "Rohtak", "Hisar", "Panipat"));
                STATE_DISTRICTS.put("Kerala", Arrays.asList(
                                "Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam"));
                STATE_DISTRICTS.put("Telangana", Arrays.asList(
                                "Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar"));
                STATE_DISTRICTS.put("Andhra Pradesh", Arrays.asList(
                                "Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Tirupati"));
                STATE_DISTRICTS.put("Odisha", Arrays.asList(
                                "Bhubaneswar", "Cuttack", "Rourkela", "Puri", "Berhampur"));
        }

        @Override
        public void run(String... args) throws Exception {
                // Check if teams already exist
                if (teamRepository.count() > 0) {
                        System.out.println("Emergency teams already seeded. Skipping...");
                        return;
                }

                System.out.println("🚨 Seeding Emergency Teams for all districts...");

                List<EmergencyTeam> teams = new ArrayList<>();
                int teamCount = 0;

                for (Map.Entry<String, List<String>> entry : STATE_DISTRICTS.entrySet()) {
                        String state = entry.getKey();
                        List<String> districts = entry.getValue();

                        for (String district : districts) {
                                // Add Fire Brigade teams
                                teams.addAll(createFireTeams(state, district));

                                // Add Ambulance teams
                                teams.addAll(createAmbulanceTeams(state, district));

                                // Add Police teams
                                teams.addAll(createPoliceTeams(state, district));

                                // Add NDRF teams (major districts only)
                                if (isMajorDistrict(district)) {
                                        teams.add(createNDRFTeam(state, district));
                                }

                                // Add CRPF teams (strategic locations)
                                if (isStrategicLocation(district)) {
                                        teams.add(createCRPFTeam(state, district));
                                }
                        }
                }

                teamRepository.saveAll(teams);
                teamCount = teams.size();

                System.out.println("✅ Successfully seeded " + teamCount + " emergency teams across " +
                                STATE_DISTRICTS.values().stream().mapToInt(List::size).sum() + " districts!");
        }

        private List<EmergencyTeam> createFireTeams(String state, String district) {
                List<EmergencyTeam> teams = new ArrayList<>();

                // Main Fire Station
                EmergencyTeam mainFire = new EmergencyTeam();
                mainFire.setTeamName(district + " Central Fire Station");
                mainFire.setTeamType(TeamType.FIRE);
                mainFire.setDistrict(district);
                mainFire.setPhoneNumber("101");
                mainFire.setPersonnelCount(25);
                mainFire.setContactPerson("Fire Officer");
                mainFire.setNotes("Equipment: 3 Fire Trucks, 2 Water Tenders, Rescue Equipment");
                mainFire.setStatus(TeamStatus.AVAILABLE);
                teams.add(mainFire);

                // Secondary Fire Station
                EmergencyTeam secondaryFire = new EmergencyTeam();
                secondaryFire.setTeamName(district + " Fire Brigade - Unit 2");
                secondaryFire.setTeamType(TeamType.FIRE);
                secondaryFire.setDistrict(district);
                secondaryFire.setPhoneNumber("101");
                secondaryFire.setPersonnelCount(18);
                secondaryFire.setContactPerson("Fire Officer");
                secondaryFire.setNotes("Equipment: 2 Fire Trucks, Ladder Truck");
                secondaryFire.setStatus(TeamStatus.AVAILABLE);
                teams.add(secondaryFire);

                return teams;
        }

        private List<EmergencyTeam> createAmbulanceTeams(String state, String district) {
                List<EmergencyTeam> teams = new ArrayList<>();

                // Primary Ambulance Service
                EmergencyTeam ambulance1 = new EmergencyTeam();
                ambulance1.setTeamName(district + " Emergency Medical Services");
                ambulance1.setTeamType(TeamType.AMBULANCE);
                ambulance1.setDistrict(district);
                ambulance1.setPhoneNumber("108");
                ambulance1.setPersonnelCount(30);
                ambulance1.setContactPerson("Medical Officer");
                ambulance1.setNotes("Equipment: 10 ALS Ambulances, 5 BLS Ambulances, Cardiac Equipment");
                ambulance1.setStatus(TeamStatus.AVAILABLE);
                teams.add(ambulance1);

                // Secondary Ambulance Unit
                EmergencyTeam ambulance2 = new EmergencyTeam();
                ambulance2.setTeamName(district + " Rapid Response Ambulance");
                ambulance2.setTeamType(TeamType.AMBULANCE);
                ambulance2.setDistrict(district);
                ambulance2.setPhoneNumber("108");
                ambulance2.setPersonnelCount(20);
                ambulance2.setContactPerson("Medical Officer");
                ambulance2.setNotes("Equipment: 5 ALS Ambulances, Trauma Care Equipment");
                ambulance2.setStatus(TeamStatus.AVAILABLE);
                teams.add(ambulance2);

                return teams;
        }

        private List<EmergencyTeam> createPoliceTeams(String state, String district) {
                List<EmergencyTeam> teams = new ArrayList<>();

                // Main Police Station
                EmergencyTeam police1 = new EmergencyTeam();
                police1.setTeamName(district + " Police Control Room");
                police1.setTeamType(TeamType.POLICE);
                police1.setDistrict(district);
                police1.setPhoneNumber("100");
                police1.setPersonnelCount(50);
                police1.setContactPerson("Police Officer");
                police1.setNotes("Equipment: 10 Patrol Vehicles, Communication Systems, Law Enforcement Gear");
                police1.setStatus(TeamStatus.AVAILABLE);
                teams.add(police1);

                // Emergency Response Unit
                EmergencyTeam police2 = new EmergencyTeam();
                police2.setTeamName(district + " Emergency Response Squad");
                police2.setTeamType(TeamType.POLICE);
                police2.setDistrict(district);
                police2.setPhoneNumber("100");
                police2.setPersonnelCount(35);
                police2.setContactPerson("Police Officer");
                police2.setNotes("Equipment: 5 Rapid Response Vehicles, Tactical Equipment");
                police2.setStatus(TeamStatus.AVAILABLE);
                teams.add(police2);

                return teams;
        }

        private EmergencyTeam createNDRFTeam(String state, String district) {
                EmergencyTeam ndrf = new EmergencyTeam();
                ndrf.setTeamName("NDRF " + district + " Battalion");
                ndrf.setTeamType(TeamType.NDRF);
                ndrf.setDistrict(district);
                ndrf.setPhoneNumber("9711077372");
                ndrf.setPersonnelCount(45);
                ndrf.setContactPerson("NDRF Commander");
                ndrf.setNotes("Equipment: Rescue Boats, Helicopters, Search & Rescue Equipment, Medical Kits");
                ndrf.setStatus(TeamStatus.AVAILABLE);
                return ndrf;
        }

        private EmergencyTeam createCRPFTeam(String state, String district) {
                EmergencyTeam crpf = new EmergencyTeam();
                crpf.setTeamName("CRPF " + district + " Unit");
                crpf.setTeamType(TeamType.POLICE); // Using POLICE type as CRPF is not in enum
                crpf.setDistrict(district);
                crpf.setPhoneNumber("011-24363144");
                crpf.setPersonnelCount(40);
                crpf.setContactPerson("CRPF Commander");
                crpf.setNotes("CRPF Unit - Equipment: Armed Vehicles, Communication Systems, Security Equipment");
                crpf.setStatus(TeamStatus.AVAILABLE);
                return crpf;
        }

        private boolean isMajorDistrict(String district) {
                // Major cities where NDRF teams are typically stationed
                List<String> majorCities = Arrays.asList(
                                "Mumbai", "Delhi", "Bengaluru", "Chennai", "Kolkata", "Hyderabad",
                                "Pune", "Ahmedabad", "Surat", "Jaipur", "Lucknow", "Kanpur");
                return majorCities.contains(district);
        }

        private boolean isStrategicLocation(String district) {
                // Strategic locations for CRPF deployment
                List<String> strategicLocations = Arrays.asList(
                                "Mumbai", "Delhi", "Srinagar", "Jammu", "Amritsar", "Guwahati",
                                "Imphal", "Kolkata", "Chennai", "Hyderabad", "Bengaluru");
                return strategicLocations.contains(district);
        }
}
