package com.reserves.model;

import javax.persistence.*;
import javax.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entidade que representa uma Reserva no sistema.
 *
 * Observações sobre anotações comuns:
 * - @ManyToOne: relacionamento com Space. FetchType.LAZY para eficiência.
 * - @Enumerated(EnumType.STRING): armazena enums como texto no banco.
 * - Validations (@NotBlank, @Email, @NotNull) garantem integridade antes do serviço persistir.
 */
@Entity
@Table(name = "reservations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Espaço reservado — obrigatório
    @NotNull(message = "Espaço é obrigatório")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "space_id", nullable = false)
    private Space space;

    // Nome do usuário que fez a reserva
    @NotBlank(message = "Nome do usuário é obrigatório")
    @Column(name = "user_name", nullable = false, length = 100)
    private String userName;

    // Email do usuário (validado)
    @NotBlank(message = "Email é obrigatório")
    @Email(message = "Email inválido")
    @Column(name = "user_email", nullable = false, length = 100)
    private String userEmail;

    // Telefone opcional
    @Column(name = "user_phone", length = 20)
    private String userPhone;

    // Horário de início da reserva
    @NotNull(message = "Horário de início é obrigatório")
    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    // Horário de término da reserva
    @NotNull(message = "Horário de término é obrigatório")
    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    // Status da reserva. Default = PENDING para que serviço possa confirmar.
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status = ReservationStatus.PENDING;

    // Preço total calculado no service (horas * pricePerHour)
    @NotNull
    @Column(name = "total_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalPrice;

    // Observações/notes
    @Column(length = 500)
    private String notes;

    // Data de criação da reserva
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
