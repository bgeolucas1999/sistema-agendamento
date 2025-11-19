package com.reserves.controller;

import com.reserves.model.Space;
import com.reserves.model.SpaceType;
import com.reserves.dto.SpaceDTO;
import com.reserves.service.SpaceService;
import javax.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/spaces")
public class SpaceController {

    private final SpaceService spaceService;

    public SpaceController(SpaceService spaceService) {
        this.spaceService = spaceService;
    }

    @GetMapping
    public List<SpaceDTO> getAll() {
        return spaceService.findAll().stream().map(this::toDTO).toList();
    }

    @GetMapping("/{id}")
    public SpaceDTO getById(@PathVariable Long id) {
        return toDTO(spaceService.findById(id));
    }

    @GetMapping("/available")
    public List<SpaceDTO> getAvailable(
            @RequestParam(required = false) SpaceType type,
            @RequestParam(required = false) Integer minCapacity,
            @RequestParam(required = false) BigDecimal maxPrice
    ) {
        return spaceService.findAvailableWithFilters(type, minCapacity, maxPrice)
                .stream().map(this::toDTO).toList();
    }

    @PostMapping
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public SpaceDTO create(@Valid @RequestBody SpaceDTO dto) {
        Space s = fromDTO(dto);
        return toDTO(spaceService.create(s));
    }

    @PutMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public SpaceDTO update(@PathVariable Long id, @Valid @RequestBody SpaceDTO dto) {
        Space s = fromDTO(dto);
        return toDTO(spaceService.update(id, s));
    }

    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public void delete(@PathVariable Long id) {
        spaceService.delete(id);
    }

    // --- Mapping helpers ---
    private SpaceDTO toDTO(Space s) {
        SpaceDTO dto = new SpaceDTO();
        dto.setId(s.getId());
        dto.setName(s.getName());
        dto.setDescription(s.getDescription());
        dto.setType(s.getType() != null ? s.getType().name() : null);
        dto.setCapacity(s.getCapacity());
        dto.setPricePerHour(s.getPricePerHour());
        dto.setAmenities(s.getAmenities());
        dto.setImageUrl(s.getImageUrl());
        dto.setAvailable(s.getAvailable());
        dto.setFloor(s.getFloor());
        dto.setLocation(s.getLocation());
        dto.setCreatedAt(s.getCreatedAt());
        return dto;
    }

    private Space fromDTO(SpaceDTO dto) {
        Space s = new Space();
        s.setName(dto.getName());
        s.setDescription(dto.getDescription());
        s.setType(dto.getType() != null ? com.reserves.model.SpaceType.valueOf(dto.getType()) : null);
        s.setCapacity(dto.getCapacity());
        s.setPricePerHour(dto.getPricePerHour());
        s.setAmenities(dto.getAmenities());
        s.setImageUrl(dto.getImageUrl());
        s.setAvailable(dto.getAvailable() != null ? dto.getAvailable() : true);
        s.setFloor(dto.getFloor());
        s.setLocation(dto.getLocation());
        return s;
    }
}
