package com.faltometro.faltometro.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.faltometro.faltometro.dto.DadosCadastro;
import com.faltometro.faltometro.dto.DadosLogin;
import com.faltometro.faltometro.dto.DadosToken;
import com.faltometro.faltometro.model.Usuario;
import com.faltometro.faltometro.repository.UsuarioRepository;
import com.faltometro.faltometro.security.TokenService;

@RestController
@RequestMapping("/auth")
public class AutenticacaoController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenService tokenService;

    @PostMapping("/cadastro")
    public ResponseEntity cadastrar(@RequestBody DadosCadastro dados) {
        if (dados.nome() == null || dados.email() == null || dados.senha() == null) {
            return ResponseEntity.badRequest().body("Preencha todos os campos");
        }
        if (usuarioRepository.existsByEmail(dados.email())) {
            return ResponseEntity.badRequest().body("Email já cadastrado");
        }

        Usuario usuario = new Usuario();
        usuario.setNome(dados.nome());
        usuario.setEmail(dados.email());
        usuario.setSenha(passwordEncoder.encode(dados.senha()));
        usuarioRepository.save(usuario);

        String token = tokenService.gerarToken(usuario);
        return ResponseEntity.ok(new DadosToken(token, usuario.getNome()));
    }

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody DadosLogin dados) {
        Usuario usuario = usuarioRepository.findByEmail(dados.email());

        if (usuario == null || !passwordEncoder.matches(dados.senha(), usuario.getSenha())) {
            return ResponseEntity.badRequest().body("Email ou senha inválidos");
        }

        String token = tokenService.gerarToken(usuario);
        return ResponseEntity.ok(new DadosToken(token, usuario.getNome()));
    }
}