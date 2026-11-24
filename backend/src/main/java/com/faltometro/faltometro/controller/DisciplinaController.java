package com.faltometro.faltometro.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.faltometro.faltometro.dto.DadosDisciplina;
import com.faltometro.faltometro.dto.DadosFalta;
import com.faltometro.faltometro.dto.DisciplinaResponse;
import com.faltometro.faltometro.dto.FaltaResponse;
import com.faltometro.faltometro.model.Usuario;
import com.faltometro.faltometro.service.DisciplinaService;

@RestController
@RequestMapping("/disciplinas")
public class DisciplinaController {

    @Autowired
    private DisciplinaService disciplinaService;

    @GetMapping
    public List<DisciplinaResponse> listar(@AuthenticationPrincipal Usuario usuario) {
        return disciplinaService.listar(usuario);
    }

    @GetMapping("/{id}")
    public DisciplinaResponse buscar(@PathVariable Long id,
                                     @AuthenticationPrincipal Usuario usuario) {
        return disciplinaService.buscar(id, usuario);
    }

    @PostMapping
    public ResponseEntity<DisciplinaResponse> criar(@RequestBody DadosDisciplina dados,
                                                    @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.status(201).body(disciplinaService.criar(dados, usuario));
    }

    @PutMapping("/{id}")
    public DisciplinaResponse atualizar(@PathVariable Long id,
                                        @RequestBody DadosDisciplina dados,
                                        @AuthenticationPrincipal Usuario usuario) {
        return disciplinaService.atualizar(id, dados, usuario);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id,
                                        @AuthenticationPrincipal Usuario usuario) {
        disciplinaService.excluir(id, usuario);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/faltas")
    public List<FaltaResponse> listarFaltas(@PathVariable Long id,
                                            @AuthenticationPrincipal Usuario usuario) {
        return disciplinaService.listarFaltas(id, usuario);
    }

    @PostMapping("/{id}/faltas")
    public ResponseEntity<FaltaResponse> registrarFalta(@PathVariable Long id,
                                                        @RequestBody DadosFalta dados,
                                                        @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.status(201).body(disciplinaService.registrarFalta(id, dados, usuario));
    }
}