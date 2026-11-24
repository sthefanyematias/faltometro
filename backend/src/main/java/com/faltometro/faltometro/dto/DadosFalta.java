package com.faltometro.faltometro.dto;

import java.time.LocalDate;

public record DadosFalta(LocalDate data, Integer quantidadeHoras) {
}