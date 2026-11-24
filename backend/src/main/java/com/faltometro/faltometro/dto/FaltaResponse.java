package com.faltometro.faltometro.dto;

import java.time.LocalDate;

public record FaltaResponse(Long id, LocalDate data, Integer quantidadeHoras) {
}