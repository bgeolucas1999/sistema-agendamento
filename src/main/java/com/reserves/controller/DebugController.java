package com.reserves.controller;

import com.reserves.model.Reservation;
import com.reserves.repository.ReservationRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class DebugController {

    private final ReservationRepository reservationRepository;

    public DebugController(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> m = new HashMap<>();
        m.put("status", "ok");
        m.put("service", "sistema-agendamento");
        return ResponseEntity.ok(m);
    }

    @GetMapping("/debug/reservations")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Reservation>> debugReservations() {
        return ResponseEntity.ok(reservationRepository.findAll());
    }
}
