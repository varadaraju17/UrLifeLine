package com.disruptor.alertsystem;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.disruptor.alertsystem.model.ERole;
import com.disruptor.alertsystem.model.User;
import com.disruptor.alertsystem.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder encoder;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail("varadarajuny@gmail.com")) {
            User admin = new User(
                "Administrator",
                "varadarajuny@gmail.com",
                encoder.encode("Varada883@"),
                ERole.ROLE_ADMIN,
                "admin-phone",
                "Central",
                "HQ"
            );
            userRepository.save(admin);
            System.out.println("Admin user seeded successfully.");
        }
    }
}
