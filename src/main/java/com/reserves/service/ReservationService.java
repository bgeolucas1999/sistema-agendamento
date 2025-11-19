package com.reserves.service;

import com.reserves.exception.BadRequestException;
import com.reserves.exception.ResourceNotFoundException;
import com.reserves.model.Reservation;
import com.reserves.model.ReservationStatus;
import com.reserves.model.Space;
import com.reserves.repository.ReservationRepository;
import com.reserves.repository.SpaceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Serviço que contém toda a lógica de negócio relacionada a Reservas.
 *
 * - Valida horários (start < end, não no passado)
 * - Verifica conflitos de horário (não permite sobreposição)
 * - Calcula preço baseado em horas (arredondando para cima)
 * - Marca status e persiste alterações em transação
+ */
@Service
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final SpaceRepository spaceRepository;
    private static final Logger logger = LoggerFactory.getLogger(ReservationService.class);

    public ReservationService(ReservationRepository reservationRepository, SpaceRepository spaceRepository) {
        this.reservationRepository = reservationRepository;
        this.spaceRepository = spaceRepository;
    }

    public List<Reservation> findAll() {
        return reservationRepository.findAll();
    }

    public Reservation findById(Long id) {
        return reservationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Reserva não encontrada: " + id));
    }

    public List<Reservation> findByUserEmail(String email) {
        return reservationRepository.findByUserEmail(email);
    }

    @Transactional
    public Reservation create(Reservation reservation) {
        validateTimes(reservation);

        // Verifica espaço existe
        Space space = spaceRepository.findById(reservation.getSpace().getId())
                .orElseThrow(() -> new ResourceNotFoundException("Espaço não encontrado"));

        // Verifica se espaço está marcado como disponível
        if (space.getAvailable() != null && !space.getAvailable()) {
            throw new BadRequestException("Este espaço não está disponível para reservas.");
        }

        // Verifica conflitos (criação: não precisa excluir nenhum id)
        checkConflicts(space.getId(), reservation.getStartTime(), reservation.getEndTime(), null);

        // Calcula preço e define status
        reservation.setTotalPrice(calculatePrice(space.getPricePerHour(), reservation));
        reservation.setStatus(ReservationStatus.CONFIRMED);

        // Ensure we attach the managed Space entity to the reservation
        reservation.setSpace(space);

        logger.info("Creating reservation for spaceId={} userEmail={} start={} end={}",
            space.getId(), reservation.getUserEmail(), reservation.getStartTime(), reservation.getEndTime());

        return reservationRepository.save(reservation);
    }

    @Transactional
    public Reservation update(Long id, Reservation update) {
        Reservation existing = findById(id);

        validateTimes(update);

        // Ao verificar conflitos, excluir a própria reserva atual (para não conflitar consigo mesma)
        checkConflicts(existing.getSpace().getId(), update.getStartTime(), update.getEndTime(), existing.getId());

        existing.setUserName(update.getUserName());
        existing.setUserEmail(update.getUserEmail());
        existing.setUserPhone(update.getUserPhone());
        existing.setStartTime(update.getStartTime());
        existing.setEndTime(update.getEndTime());
        existing.setNotes(update.getNotes());

        existing.setTotalPrice(
                calculatePrice(existing.getSpace().getPricePerHour(), update)
        );

        logger.info("Updating reservation id={} userEmail={} start={} end={}", existing.getId(), existing.getUserEmail(), existing.getStartTime(), existing.getEndTime());
        return reservationRepository.save(existing);
    }

    @Transactional
    public Reservation cancel(Long id) {
        Reservation existing = findById(id);
        existing.setStatus(ReservationStatus.CANCELLED);
        logger.info("Cancelling reservation id={} userEmail={}", existing.getId(), existing.getUserEmail());
        return reservationRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        reservationRepository.delete(findById(id));
    }

    // ------------------- HELPERS -------------------

    private void validateTimes(Reservation r) {
        LocalDateTime now = LocalDateTime.now();
        if (r.getStartTime() == null || r.getEndTime() == null) {
            throw new BadRequestException("Horários de início e término são obrigatórios.");
        }
        if (!r.getEndTime().isAfter(r.getStartTime())) {
            throw new BadRequestException("Horário final deve ser após o horário inicial.");
        }
        if (r.getStartTime().isBefore(now)) {
            throw new BadRequestException("Não é possível criar/atualizar uma reserva no passado.");
        }
    }

    private void checkConflicts(Long spaceId,
                                LocalDateTime start,
                                LocalDateTime end,
                                Long excludeReservationId) {

        List<Reservation> conflicts = reservationRepository
                .findConflictingReservations(spaceId, start, end);

        // Se for uma atualização, ignorar conflito consigo mesmo
        if (excludeReservationId != null) {
            conflicts = conflicts.stream()
                    .filter(r -> !r.getId().equals(excludeReservationId))
                    .collect(Collectors.toList());
        }

        if (!conflicts.isEmpty()) {
            throw new BadRequestException("Este espaço já está reservado nesse horário.");
        }
    }

    private BigDecimal calculatePrice(BigDecimal pricePerHour, Reservation r) {
        long minutes = Duration.between(r.getStartTime(), r.getEndTime()).toMinutes();
        double hours = Math.ceil(minutes / 60.0); // arredonda para cima
        if (hours < 1) hours = 1;
        return pricePerHour.multiply(BigDecimal.valueOf((long) hours));
    }
}
