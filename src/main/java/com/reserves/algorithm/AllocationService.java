package com.reserves.algorithm;

import com.reserves.model.Reservation;
import com.reserves.model.Space;
import com.reserves.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * AllocationService - Implementação de algoritmos de alocação otimizada
 * 
 * Disciplinas envolvidas:
 * - Estrutura de Dados: Heaps, Priority Queues, Range Trees
 * - Pesquisa Operacional: Programação inteira, algoritmos gulosos
 * - Algoritmos: Busca, ordenação, detecção de conflitos
 * 
 * Complexidades:
 * - Best Fit Decreasing: O(n log n)
 * - Conflict Detection: O(log n)
 * - Optimal Allocation: O(n²) worst case, O(n) average
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AllocationService {
    
    private final ReservationRepository reservationRepository;
    
    /**
     * Algoritmo 1: Best Fit Decreasing (BFD)
     * 
     * Encontra o espaço mais apropriado para uma reserva
     * usando critérios de capacidade e preço
     * 
     * @param candidateSpaces Lista de espaços candidatos
     * @param requiredCapacity Capacidade mínima necessária
     * @param maxPrice Preço máximo aceitável por hora
     * @return Top 5 espaços ordenados por melhor ajuste
     * 
     * Complexidade: O(n log n) - dominado pela ordenação
     */
    public List<Space> bestFitDecreasing(
            List<Space> candidateSpaces,
            int requiredCapacity,
            BigDecimal maxPrice
    ) {
        log.info("BFD: Iniciando busca com {} candidatos, capacidade={}, maxPrice={}",
                candidateSpaces.size(), requiredCapacity, maxPrice);
        
        return candidateSpaces.stream()
                // Filtro 1: Capacidade suficiente
                .filter(space -> space.getCapacity() >= requiredCapacity)
                // Filtro 2: Preço dentro do orçamento
                .filter(space -> space.getPricePerHour().compareTo(maxPrice) <= 0)
                // Ordenação: Preço (ascending) → Capacidade (descending)
                // Critério: Espaço que custa menos e é mais justo
                .sorted(Comparator
                        .comparing(Space::getPricePerHour)
                        .thenComparingInt((Space s) -> s.getCapacity()).reversed()
                )
                // Top 5 resultados
                .limit(5)
                .collect(Collectors.toList());
    }
    
    /**
     * Algoritmo 2: Detecção de Conflitos com Range Tree
     * 
     * Verifica se existe conflito de agendamento para um espaço
     * em um intervalo de tempo específico
     * 
     * @param space Espaço a verificar
     * @param startTime Início do intervalo (inclusivo)
     * @param endTime Fim do intervalo (exclusivo)
     * @return true se existe conflito, false se disponível
     * 
     * Complexidade: O(log n + k) onde k = número de conflitos encontrados
     * 
     * SQL Query otimizado com índices:
     * CREATE INDEX idx_reservations_time ON reservations(start_time, end_time);
     * CREATE INDEX idx_reservations_space ON reservations(space_id);
     */
    public boolean hasConflict(
            Space space,
            LocalDateTime startTime,
            LocalDateTime endTime
    ) {
        log.debug("Verificando conflito para espaço {}, intervalo [{}, {})",
                space.getId(), startTime, endTime);
        
        // Query com Range Tree emulado pelo BD
        List<Reservation> conflicts = reservationRepository.findConflictingReservations(
                space.getId(),
                startTime,
                endTime
            );
        
        boolean hasConflict = !conflicts.isEmpty();
        if (hasConflict) {
            log.warn("Conflito detectado! Espaço {} tem {} reservas conflitantes",
                    space.getId(), conflicts.size());
        }
        
        return hasConflict;
    }
    
    /**
     * Algoritmo 3: Merge Intervals & Sweep Line
     * 
     * Encontra slots de tempo disponíveis em um dia
     * usando algoritmo de sweep line
     * 
     * @param space Espaço a consultar
     * @param startTime Início do dia
     * @param endTime Fim do dia
     * @return Lista de intervalos livres
     * 
     * Complexidade: O(n log n) - dominado pela ordenação
     * 
     * Exemplo:
     * Reservas: [9:00-10:00], [11:00-12:00]
     * Retorna: [10:00-11:00], [12:00-18:00]
     */
    public List<TimeSlot> getAvailableSlots(
            Space space,
            LocalDateTime startTime,
            LocalDateTime endTime
    ) {
        log.info("Buscando slots livres para espaço {} em [{}, {})",
                space.getId(), startTime, endTime);
        
        // 1. Buscar todas as reservas que conflitam (já exclui CANCELLED)
        List<Reservation> reservations = reservationRepository.findConflictingReservations(
                space.getId(),
                startTime,
                endTime
            );
        
        // 2. Converter para TimeSlots e ordenar
        List<TimeSlot> occupied = reservations.stream()
                .map(r -> new TimeSlot(r.getStartTime(), r.getEndTime()))
                .sorted(Comparator.comparing(TimeSlot::getStart))
                .collect(Collectors.toList());
        
        // 3. Merge overlapping intervals
        List<TimeSlot> merged = mergeIntervals(occupied);
        
        // 4. Calcular gaps (slots livres)
        List<TimeSlot> gaps = calculateGaps(merged, startTime, endTime);
        
        log.debug("Encontrados {} slots livres de um total de {} horas",
                gaps.size(), Duration.between(startTime, endTime).toHours());
        
        return gaps;
    }
    
    /**
     * Merge Intervals - Auxiliar para sweep line
     * 
     * Combina intervalos sobrepostos
     * 
     * Exemplo:
     * Input: [[1,3], [2,6], [8,10]]
     * Output: [[1,6], [8,10]]
     * 
     * Complexidade: O(n)
     */
    private List<TimeSlot> mergeIntervals(List<TimeSlot> intervals) {
        if (intervals.isEmpty()) {
            return new ArrayList<>();
        }
        
        List<TimeSlot> merged = new ArrayList<>();
        TimeSlot current = intervals.get(0);
        
        for (int i = 1; i < intervals.size(); i++) {
            TimeSlot next = intervals.get(i);
            
            if (current.getEnd().isAfter(next.getStart()) || 
                current.getEnd().equals(next.getStart())) {
                // Sobrepõe - estender o intervalo atual
                current = new TimeSlot(
                    current.getStart(),
                    current.getEnd().isAfter(next.getEnd()) ? 
                        current.getEnd() : next.getEnd()
                );
            } else {
                // Não sobrepõe - adicionar corrente e começar nova
                merged.add(current);
                current = next;
            }
        }
        
        merged.add(current);
        return merged;
    }
    
    /**
     * Calculate Gaps - Encontra intervalos livres
     * 
     * Complexidade: O(n)
     */
    private List<TimeSlot> calculateGaps(
            List<TimeSlot> occupied,
            LocalDateTime dayStart,
            LocalDateTime dayEnd
    ) {
        List<TimeSlot> gaps = new ArrayList<>();
        LocalDateTime current = dayStart;
        
        for (TimeSlot slot : occupied) {
            if (current.isBefore(slot.getStart())) {
                gaps.add(new TimeSlot(current, slot.getStart()));
            }
            current = slot.getEnd();
        }
        
        if (current.isBefore(dayEnd)) {
            gaps.add(new TimeSlot(current, dayEnd));
        }
        
        return gaps;
    }
    
    /**
     * Algoritmo 4: Optimal Allocation (Greedy + Validation)
     * 
     * Aloca espaço com mínimo custo total,
     * verificando disponibilidade
     * 
     * @param candidates Espaços candidatos (já filtrados por BFD)
     * @param startTime Início da reserva
     * @param endTime Fim da reserva
     * @return Espaço alocado ou null se nenhum disponível
     * 
     * Complexidade: O(n) onde n = número de candidatos (pequeno, ≤5)
     */
    public Space allocateOptimal(
            List<Space> candidates,
            LocalDateTime startTime,
            LocalDateTime endTime
    ) {
        log.info("Alocação ótima: {} candidatos para intervalo [{}, {})",
                candidates.size(), startTime, endTime);
        
        // Ordenar por custo total (ascending)
        List<Space> sorted = candidates.stream()
                .sorted(Comparator.comparing(
                    space -> calculateTotalCost(space, startTime, endTime)
                ))
                .collect(Collectors.toList());
        
        // Verificar disponibilidade e alocar o primeiro
        for (Space space : sorted) {
            if (!hasConflict(space, startTime, endTime)) {
                log.info("Espaço alocado: {} (Custo: R$ {})",
                        space.getName(),
                        calculateTotalCost(space, startTime, endTime));
                return space;
            }
        }
        
        log.warn("Nenhum espaço disponível após alocação ótima");
        return null;
    }
    
    /**
     * Calcular custo total de uma reserva
     * 
     * @param space Espaço
     * @param startTime Início
     * @param endTime Fim
     * @return Custo em BigDecimal
     */
    public BigDecimal calculateTotalCost(
            Space space,
            LocalDateTime startTime,
            LocalDateTime endTime
    ) {
        long hours = Duration.between(startTime, endTime).toHours();
        if (hours == 0) hours = 1; // Mínimo 1 hora
        
        return space.getPricePerHour()
                .multiply(BigDecimal.valueOf(hours));
    }
    
    /**
     * Algoritmo 5: Occupancy Score
     * 
     * Calcula métrica de ocupação de um espaço
     * 0.0 = vazio, 1.0 = lotado
     * 
     * @param space Espaço
     * @return Score de ocupação (0.0 - 1.0)
     */
    public double calculateOccupancyScore(Space space) {
        // Dias de análise: últimos 30 dias
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        
        List<Reservation> reservations = reservationRepository
                .findBySpaceIdAndCreatedAtAfter(
                    space.getId(),
                    thirtyDaysAgo
                );
        
        // Horas totais possíveis: 30 dias * 12 horas/dia
        long totalPossibleHours = 30 * 12;
        
        // Horas reservadas
        long reservedHours = reservations.stream()
                .mapToLong(r -> Duration.between(r.getStartTime(), r.getEndTime()).toHours())
                .sum();
        
        return Math.min(1.0, (double) reservedHours / totalPossibleHours);
    }
    
    /**
     * Inner class: TimeSlot
     * Representa um intervalo de tempo
     */
    public static class TimeSlot {
        private final LocalDateTime start;
        private final LocalDateTime end;
        
        public TimeSlot(LocalDateTime start, LocalDateTime end) {
            this.start = start;
            this.end = end;
        }
        
        public LocalDateTime getStart() { return start; }
        public LocalDateTime getEnd() { return end; }
        
        public long getDurationMinutes() {
            return Duration.between(start, end).toMinutes();
        }
        
        @Override
        public String toString() {
            return String.format("[%s - %s] (%d min)",
                start.toLocalTime(), end.toLocalTime(), getDurationMinutes());
        }
    }
}
