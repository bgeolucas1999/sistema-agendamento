package com.reserves.repository;

import com.reserves.model.Space;
import com.reserves.model.SpaceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface SpaceRepository extends JpaRepository<Space, Long> {

    /**
     * Busca espaços por disponibilidade.
     * @param available true/false
     */
    List<Space> findByAvailable(Boolean available);

    /**
     * Busca espaços por tipo (enum).
     */
    List<Space> findByType(SpaceType type);

    /**
     * Query que encontra espaços disponíveis aplicando filtros opcionais:
     * - type: filtra por tipo quando informado
     * - minCapacity: filtra por capacidade mínima quando informado
     * - maxPrice: filtra por preço por hora máximo quando informado
     *
     * Observação: usamos parâmetros opcionais (IS NULL) para tornar os filtros combináveis.
     */
    @Query("SELECT s FROM Space s WHERE " +
	    "(:type IS NULL OR s.type = :type) AND " +
	    "(:minCapacity IS NULL OR s.capacity >= :minCapacity) AND " +
	    "(:maxPrice IS NULL OR s.pricePerHour <= :maxPrice) AND " +
	    "s.available = true")
    List<Space> findAvailableSpacesWithFilters(
	    @Param("type") SpaceType type,
	    @Param("minCapacity") Integer minCapacity,
	    @Param("maxPrice") BigDecimal maxPrice
    );
}
