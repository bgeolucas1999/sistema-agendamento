package com.reserves.controller;

import com.reserves.model.Reservation;
import com.reserves.service.ReservationService;
import com.reserves.dto.ReservationDTO;
import com.reserves.dto.ReservationCreateRequest;
import com.reserves.dto.ReservationUpdateRequest;
import com.reserves.repository.UserRepository;
import com.reserves.model.User;
import javax.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService service;
    private final UserRepository userRepository;

    public ReservationController(ReservationService service, UserRepository userRepository) {
        this.service = service;
        this.userRepository = userRepository;
    }

    @GetMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public List<ReservationDTO> getAll(
            @RequestParam(required = false) Long spaceId,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate
    ) {
        // For simplicity we return all reservations; filtering can be added to service later
        return service.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @GetMapping("/my")
    public List<ReservationDTO> getMyReservations() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth != null ? auth.getName() : null;
        if (email == null) return List.of();
        return service.findByUserEmail(email).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ReservationDTO getReservationById(@PathVariable Long id) {
        return toDTO(service.findById(id));
    }

    @PostMapping
    public ReservationDTO createReservation(@Valid @RequestBody ReservationCreateRequest request) {
        // Build Reservation entity from request
        Reservation r = new Reservation();
        com.reserves.model.Space sp = new com.reserves.model.Space();
        sp.setId(request.getSpaceId());
        r.setSpace(sp);

        // If authenticated, prefer authenticated user's email
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth != null ? auth.getName() : null;
        if (email != null) {
            r.setUserEmail(email);
            // try get name from user repository
            User u = userRepository.findByEmail(email).orElse(null);
            r.setUserName(u != null ? u.getName() : request.getUserName());
        } else {
            r.setUserEmail(request.getUserEmail());
            r.setUserName(request.getUserName());
        }

        r.setUserPhone(request.getUserPhone());
        r.setStartTime(request.getStartTime());
        r.setEndTime(request.getEndTime());
        r.setNotes(request.getNotes());

        Reservation created = service.create(r);
        return toDTO(created);
    }

    @PostMapping("/{id}/cancel")
    public ReservationDTO cancelReservation(@PathVariable Long id) {
        return toDTO(service.cancel(id));
    }

    @PutMapping("/{id}")
    public ReservationDTO updateReservation(@PathVariable Long id, @Valid @RequestBody ReservationUpdateRequest request) {
        Reservation r = new Reservation();
        r.setUserName(request.getUserName());
        r.setUserEmail(request.getUserEmail());
        r.setUserPhone(request.getUserPhone());
        r.setStartTime(request.getStartTime());
        r.setEndTime(request.getEndTime());
        r.setNotes(request.getNotes());

        Reservation updated = service.update(id, r);
        return toDTO(updated);
    }

    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    private ReservationDTO toDTO(Reservation r) {
        ReservationDTO dto = new ReservationDTO();
        dto.setId(r.getId());
        dto.setSpaceId(r.getSpace() != null ? r.getSpace().getId() : null);
        dto.setSpaceName(r.getSpace() != null ? r.getSpace().getName() : null);
        dto.setUserName(r.getUserName());
        dto.setUserEmail(r.getUserEmail());
        dto.setStartTime(r.getStartTime());
        dto.setEndTime(r.getEndTime());
        dto.setStatus(r.getStatus() != null ? r.getStatus().name() : null);
        dto.setTotalPrice(r.getTotalPrice());
        dto.setNotes(r.getNotes());
        dto.setCreatedAt(r.getCreatedAt());
        return dto;
    }
}
