package com.reserves.repository;

import com.reserves.model.Reservation;
import com.reserves.model.ReservationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findBySpaceId(Long spaceId);

    List<Reservation> findByStatus(ReservationStatus status);

    List<Reservation> findByUserEmail(String userEmail);

	 @Query("SELECT r FROM Reservation r WHERE " +
		 "r.space.id = :spaceId AND " +
		 "r.status <> com.reserves.model.ReservationStatus.CANCELLED AND " +
		 "r.startTime < :endTime AND " +
		 "r.endTime > :startTime")
	/**
	 * Encontra reservas conflitantes para um espaço:
	 * Critérios de conflito (JPQL): r.startTime < :endTime AND r.endTime > :startTime
	 * - Isso identifica qualquer sobreposição de intervalos.
	 * - Exclui reservas com status CANCELLED.
	 */
	List<Reservation> findConflictingReservations(
	    @Param("spaceId") Long spaceId,
	    @Param("startTime") LocalDateTime startTime,
	    @Param("endTime") LocalDateTime endTime
	);

    @Query("SELECT r FROM Reservation r WHERE " +
	   "(:spaceId IS NULL OR r.space.id = :spaceId) AND " +
	   "(:status IS NULL OR r.status = :status)")
    List<Reservation> findWithFilters(
	    @Param("spaceId") Long spaceId,
	    @Param("status") ReservationStatus status
    );

	// Busca reservas de um espaço criadas depois de uma data
	List<Reservation> findBySpaceIdAndCreatedAtAfter(Long spaceId, LocalDateTime dateTime);
}
