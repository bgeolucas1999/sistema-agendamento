package com.reserves.controller;

import com.reserves.dto.LoginRequest;
import com.reserves.dto.RegisterRequest;
import com.reserves.model.Role;
import com.reserves.model.User;
import com.reserves.repository.UserRepository;
import com.reserves.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            var userDetails = auth.getPrincipal();
            String token = jwtUtil.generateToken((org.springframework.security.core.userdetails.UserDetails) userDetails);

            var user = userRepository.findByEmail(request.getEmail()).orElse(null);

            var roles = user != null ? user.getRoles().stream().map(Enum::name).collect(Collectors.toList()) : Collections.emptyList();

            java.util.Map<String, Object> body = new java.util.HashMap<>();
            body.put("token", token);
            body.put("type", "Bearer");
            body.put("id", user != null ? user.getId() : null);
            body.put("email", request.getEmail());
            body.put("name", user != null ? user.getName() : null);
            body.put("roles", roles);

            return ResponseEntity.ok(body);
        } catch (BadCredentialsException ex) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered");
        }

        User u = new User();
        u.setName(request.getName());
        u.setEmail(request.getEmail());
        u.setPhone(request.getPhone());
        u.setPassword(passwordEncoder.encode(request.getPassword()));
        u.setRoles(Collections.singleton(Role.ROLE_USER));

        userRepository.save(u);

        // Auto-login after registration - authenticate and return JWT
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            var userDetails = auth.getPrincipal();
            String token = jwtUtil.generateToken((org.springframework.security.core.userdetails.UserDetails) userDetails);

            var roles = u.getRoles().stream().map(Enum::name).collect(Collectors.toList());

            java.util.Map<String, Object> body = new java.util.HashMap<>();
            body.put("token", token);
            body.put("type", "Bearer");
            body.put("id", u.getId());
            body.put("email", u.getEmail());
            body.put("name", u.getName());
            body.put("roles", roles);

            return ResponseEntity.ok(body);
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("User registered but failed to generate token");
        }
    }
}
