package com.faltometro.faltometro.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.faltometro.faltometro.model.Usuario;
import com.faltometro.faltometro.service.DisciplinaService;

@RestController
@RequestMapping("/faltas")
public class FaltaController {

    @Autowired
    private DisciplinaService disciplinaService;

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id, @AuthenticationPrincipal Usuario usuario) {
        disciplinaService.excluirFalta(id, usuario);
        return ResponseEntity.noContent().build();
    }
}