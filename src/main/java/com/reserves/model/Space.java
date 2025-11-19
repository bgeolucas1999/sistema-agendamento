package com.reserves.model;

import javax.persistence.*;
import javax.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entidade que representa um Espaço (Room, Auditório, etc).
 *
 * Comentários:
 * - @Entity: indica que a classe é uma entidade JPA mapeada para uma tabela.
 * - @Table: nome da tabela no banco.
 * - Lombok (@Data, @NoArgsConstructor, @AllArgsConstructor) reduz boilerplate
 */
@Entity
@Table(name = "spaces")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Space {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nome do espaço (obrigatório)
    @NotBlank(message = "Nome é obrigatório")
    @Column(nullable = false, length = 100)
    private String name;

    // Descrição opcional
    @Column(length = 1000)
    private String description;

    // Tipo do espaço (enum) — armazenado como STRING
    @NotNull(message = "Tipo é obrigatório")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SpaceType type;

    // Capacidade mínima 1
    @NotNull(message = "Capacidade é obrigatória")
    @Min(value = 1, message = "Capacidade deve ser pelo menos 1")
    @Column(nullable = false)
    private Integer capacity;

    // Preço por hora — deve ser maior que zero
    @NotNull(message = "Preço por hora é obrigatório")
    @DecimalMin(value = "0.01", message = "Preço por hora deve ser maior que zero")
    @Column(name = "price_per_hour", nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerHour;

    // Lista de comodidades (element collection armazena em tabela separada)
    @ElementCollection
    @CollectionTable(name = "space_amenities", joinColumns = @JoinColumn(name = "space_id"))
    @Column(name = "amenity")
    private List<String> amenities = new ArrayList<>();

    // URL para imagem do espaço
    @Column(name = "image_url", length = 500)
    private String imageUrl;

    // Indica se o espaço está disponível para reservas
    @Column(nullable = false)
    private Boolean available = true;

    // Andar ou identificação física
    @Column(length = 50)
    private String floor;

    // Localização mais detalhada (ex: Bloco A, Prédio X)
    @Column(length = 100)
    private String location;

    // Data de criação — preenchida automaticamente antes do persist
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
