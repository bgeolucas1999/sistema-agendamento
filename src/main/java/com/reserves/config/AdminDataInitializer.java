package com.reserves.config;

import com.reserves.model.Role;
import com.reserves.model.User;
import com.reserves.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;

@Component
@Profile("!test")
public class AdminDataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminDataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        String adminEmail = "admin@example.com";
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User admin = new User();
            admin.setName("Administrator");
            admin.setEmail(adminEmail);
            // WARNING: Change this password in production. It's a development convenience.
            admin.setPassword(passwordEncoder.encode("admin123"));
            var roles = new HashSet<Role>();
            roles.add(Role.ROLE_ADMIN);
            roles.add(Role.ROLE_USER);
            admin.setRoles(roles);

            userRepository.save(admin);
            System.out.println("Created default admin user: " + adminEmail + " with password 'admin123'");
        } else {
            System.out.println("Admin user already exists: " + adminEmail);
        }
    }
}
