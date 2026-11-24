package com.faltometro.faltometro.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class TratadorDeErros {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> tratar(RuntimeException erro) {
        return ResponseEntity.badRequest().body(erro.getMessage());
    }
}