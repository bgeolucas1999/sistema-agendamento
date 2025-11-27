package com.reserves.service;

import com.reserves.exception.BadRequestException;
import com.reserves.exception.ResourceNotFoundException;
import com.reserves.model.Space;
import com.reserves.model.SpaceType;
import com.reserves.model.ReservationStatus;
import com.reserves.repository.SpaceRepository;
import com.reserves.repository.ReservationRepository;
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
    private final ReservationRepository reservationRepository;

    public SpaceService(SpaceRepository spaceRepository, ReservationRepository reservationRepository) {
        this.spaceRepository = spaceRepository;
        this.reservationRepository = reservationRepository;
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
        
        // Check for active reservations (not cancelled)
        long activeReservations = reservationRepository.findBySpaceId(id).stream()
                .filter(r -> r.getStatus() != ReservationStatus.CANCELLED)
                .count();
        
        if (activeReservations > 0) {
            throw new BadRequestException("Não é possível excluir um espaço que possui reservas ativas. " +
                    "Existem " + activeReservations + " reserva(s) ativa(s) para este espaço.");
        }
        
        spaceRepository.delete(existing);
    }
}
