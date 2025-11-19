package com.reserves.model;

/**
 * Enum com os possíveis status de uma reserva.
 * - PENDING: aguardando confirmação
 * - CONFIRMED: reserva confirmada
 * - CANCELLED: cancelada
 * - COMPLETED: já ocorrida
 */
public enum ReservationStatus {
    PENDING,
    CONFIRMED,
    CANCELLED,
    COMPLETED
}
