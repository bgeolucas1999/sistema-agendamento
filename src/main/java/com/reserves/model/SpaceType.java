package com.reserves.model;

/**
 * Enum que representa os tipos de espaço disponíveis.
 * Usamos enums para garantir valores válidos e legíveis no banco (por isso usamos STRING).
 */
public enum SpaceType {
    MEETING_ROOM,
    EVENT_HALL,
    COWORKING_SPACE,
    CONFERENCE_ROOM,
    TRAINING_ROOM,
    AUDITORIUM,
    OTHER
}
