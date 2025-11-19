package com.reserves.service;

import com.reserves.exception.BadRequestException;
import com.reserves.exception.ResourceNotFoundException;
import com.reserves.model.Space;
import com.reserves.model.SpaceType;
import com.reserves.repository.SpaceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

/**
 * Serviço para operações relacionadas a Espaços.
 *
 * - Responsável por regras simples de negócio relacionadas a spaces
 * - Métodos que alteram o estado do banco possuem @Transactional
 */
@Service
public class SpaceService {

    private final SpaceRepository spaceRepository;

    public SpaceService(SpaceRepository spaceRepository) {
        this.spaceRepository = spaceRepository;
    }

    public List<Space> findAll() {
        return spaceRepository.findAll();
    }

    public Space findById(Long id) {
        return spaceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Espaço não encontrado: " + id));
    }

    public List<Space> findAvailableWithFilters(SpaceType type, Integer minCapacity, BigDecimal maxPrice) {
        return spaceRepository.findAvailableSpacesWithFilters(type, minCapacity, maxPrice);
    }

    @Transactional
    public Space create(Space space) {
        // Validações básicas antes de salvar
        if (space.getCapacity() != null && space.getCapacity() < 1) {
            throw new BadRequestException("Capacidade deve ser pelo menos 1.");
        }
        if (space.getPricePerHour() != null && space.getPricePerHour().compareTo(BigDecimal.ZERO) <= 0) {
            throw new BadRequestException("Preço por hora deve ser maior que zero.");
        }

        return spaceRepository.save(space);
    }

    @Transactional
    public Space update(Long id, Space spaceUpdate) {
        Space existing = findById(id);

        existing.setName(spaceUpdate.getName());
        existing.setDescription(spaceUpdate.getDescription());
        existing.setType(spaceUpdate.getType());
        existing.setCapacity(spaceUpdate.getCapacity());
        existing.setPricePerHour(spaceUpdate.getPricePerHour());
        existing.setAmenities(spaceUpdate.getAmenities());
        existing.setImageUrl(spaceUpdate.getImageUrl());
        existing.setAvailable(spaceUpdate.getAvailable());
        existing.setFloor(spaceUpdate.getFloor());
        existing.setLocation(spaceUpdate.getLocation());

        return spaceRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        Space existing = findById(id);
        spaceRepository.delete(existing);
    }
}
