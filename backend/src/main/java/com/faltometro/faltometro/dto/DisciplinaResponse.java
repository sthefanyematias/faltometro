package com.faltometro.faltometro.dto;

public record DisciplinaResponse(
        Long id,
        String nome,
        String professor,
        String diaSemana,
        Integer cargaHoraria,
        Integer limiteFaltas,
        Integer horasFaltadas,
        Integer podeFaltar) {
}