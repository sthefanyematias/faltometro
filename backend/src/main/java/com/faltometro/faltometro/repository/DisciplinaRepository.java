package com.faltometro.faltometro.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.faltometro.faltometro.model.Disciplina;

public interface DisciplinaRepository extends JpaRepository<Disciplina, Long> {

    List<Disciplina> findByUsuarioId(Long usuarioId);
}