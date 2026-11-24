package com.faltometro.faltometro.repository;

import com.faltometro.faltometro.model.Falta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface FaltaRepository extends JpaRepository<Falta, Long> {

    List<Falta> findByDisciplinaId(Long disciplinaId);

    @Query("select coalesce(sum(f.quantidadeHoras), 0) from Falta f where f.disciplina.id = :disciplinaId")
    Integer somarHorasPorDisciplina(@Param("disciplinaId") Long disciplinaId);

    @Query("select coalesce(sum(f.quantidadeHoras), 0) from Falta f where f.disciplina.usuario.id = :usuarioId")
    Integer somarHorasPorUsuario(@Param("usuarioId") Long usuarioId);
}