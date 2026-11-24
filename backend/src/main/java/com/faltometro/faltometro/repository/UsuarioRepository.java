package com.faltometro.faltometro.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.faltometro.faltometro.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Usuario findByEmail(String email);

    boolean existsByEmail(String email);
}