package com.reserves.converter;

import com.reserves.model.SpaceType;
import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter(autoApply = true)
public class SpaceTypeConverter implements AttributeConverter<SpaceType, String> {

    @Override
    public String convertToDatabaseColumn(SpaceType attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.name();
    }

    @Override
    public SpaceType convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return null;
        }
        try {
            return SpaceType.valueOf(dbData);
        } catch (IllegalArgumentException e) {
            // Map invalid enum values to valid ones
            String upper = dbData.toUpperCase();
            if (upper.contains("SALA") || upper.contains("REUNIAO") || upper.contains("MEETING")) {
                return SpaceType.MEETING_ROOM;
            }
            if (upper.contains("AUDITORIO") || upper.contains("AUDITORIUM")) {
                return SpaceType.AUDITORIUM;
            }
            if (upper.contains("COWORKING") || upper.contains("COWORK")) {
                return SpaceType.COWORKING_SPACE;
            }
            if (upper.contains("TREINAMENTO") || upper.contains("TRAINING")) {
                return SpaceType.TRAINING_ROOM;
            }
            if (upper.contains("EVENTO") || upper.contains("EVENT")) {
                return SpaceType.EVENT_HALL;
            }
            if (upper.contains("CONFERENCIA") || upper.contains("CONFERENCE")) {
                return SpaceType.CONFERENCE_ROOM;
            }
            // Default to OTHER for unknown values
            return SpaceType.OTHER;
        }
    }
}

