package com.reserves.controller;

import com.reserves.model.Reservation;
import com.reserves.repository.ReservationRepository;
import com.reserves.repository.SpaceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class DebugController {

    private final ReservationRepository reservationRepository;
    private final SpaceRepository spaceRepository;

    public DebugController(ReservationRepository reservationRepository, SpaceRepository spaceRepository) {
        this.reservationRepository = reservationRepository;
        this.spaceRepository = spaceRepository;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "sistema-agendamento");
        health.put("timestamp", LocalDateTime.now());
        
        // Check database connectivity
        try {
            // Simple query to test database connection
            reservationRepository.count();
            spaceRepository.count();
            health.put("database", "UP");
            
            // Additional metrics
            Map<String, Object> metrics = new HashMap<>();
            metrics.put("totalSpaces", spaceRepository.count());
            metrics.put("totalReservations", reservationRepository.count());
            health.put("metrics", metrics);
        } catch (Exception e) {
            health.put("database", "DOWN");
            health.put("databaseError", e.getMessage());
            health.put("status", "DOWN");
            return ResponseEntity.status(503).body(health);
        }
        
        return ResponseEntity.ok(health);
    }

    @GetMapping("/debug/reservations")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Reservation>> debugReservations() {
        return ResponseEntity.ok(reservationRepository.findAll());
    }
}
