package com.faltometro.faltometro.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.faltometro.faltometro.dto.DadosDisciplina;
import com.faltometro.faltometro.dto.DadosFalta;
import com.faltometro.faltometro.dto.DisciplinaResponse;
import com.faltometro.faltometro.dto.FaltaResponse;
import com.faltometro.faltometro.model.Disciplina;
import com.faltometro.faltometro.model.Falta;
import com.faltometro.faltometro.model.Usuario;
import com.faltometro.faltometro.repository.DisciplinaRepository;
import com.faltometro.faltometro.repository.FaltaRepository;

@Service
public class DisciplinaService {

    @Autowired
    private DisciplinaRepository disciplinaRepository;

    @Autowired
    private FaltaRepository faltaRepository;

    public List<DisciplinaResponse> listar(Usuario usuario) {
        return disciplinaRepository.findByUsuarioId(usuario.getId())
                .stream()
                .map(this::montarResponse)
                .toList();
    }

    public DisciplinaResponse buscar(Long id, Usuario usuario) {
        return montarResponse(buscarDoUsuario(id, usuario));
    }

    public DisciplinaResponse criar(DadosDisciplina dados, Usuario usuario) {
        Disciplina disciplina = new Disciplina();
        preencher(disciplina, dados);
        disciplina.setUsuario(usuario);
        disciplinaRepository.save(disciplina);
        return montarResponse(disciplina);
    }

    public DisciplinaResponse atualizar(Long id, DadosDisciplina dados, Usuario usuario) {
        Disciplina disciplina = buscarDoUsuario(id, usuario);
        preencher(disciplina, dados);
        disciplinaRepository.save(disciplina);
        return montarResponse(disciplina);
    }

    public void excluir(Long id, Usuario usuario) {
        Disciplina disciplina = buscarDoUsuario(id, usuario);
        faltaRepository.deleteAll(faltaRepository.findByDisciplinaId(id));
        disciplinaRepository.delete(disciplina);
    }

    public List<FaltaResponse> listarFaltas(Long disciplinaId, Usuario usuario) {
        buscarDoUsuario(disciplinaId, usuario);
        return faltaRepository.findByDisciplinaId(disciplinaId)
                .stream()
                .map(falta -> new FaltaResponse(
                        falta.getId(),
                        falta.getData(),
                        falta.getQuantidadeHoras()))
                .toList();
    }

    public FaltaResponse registrarFalta(Long disciplinaId, DadosFalta dados, Usuario usuario) {
        Disciplina disciplina = buscarDoUsuario(disciplinaId, usuario);
        Falta falta = new Falta();
        falta.setData(dados.data());
        falta.setQuantidadeHoras(dados.quantidadeHoras());
        falta.setDisciplina(disciplina);
        faltaRepository.save(falta);
        return new FaltaResponse(falta.getId(), falta.getData(), falta.getQuantidadeHoras());
    }

    public void excluirFalta(Long faltaId, Usuario usuario) {
        Falta falta = faltaRepository.findById(faltaId)
                .orElseThrow(() -> new RuntimeException("Falta não encontrada"));
        if (!falta.getDisciplina().getUsuario().getId().equals(usuario.getId())) {
            throw new RuntimeException("Falta não pertence a este usuário");
        }
        faltaRepository.delete(falta);
    }

    private Disciplina buscarDoUsuario(Long id, Usuario usuario) {
        Disciplina disciplina = disciplinaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Disciplina não encontrada"));
        if (!disciplina.getUsuario().getId().equals(usuario.getId())) {
            throw new RuntimeException("Disciplina não pertence a este usuário");
        }
        return disciplina;
    }

    private void preencher(Disciplina disciplina, DadosDisciplina dados) {
        disciplina.setNome(dados.nome());
        disciplina.setProfessor(dados.professor());
        disciplina.setDiaSemana(dados.diaSemana());
        disciplina.setTipo("PRESENCIAL");
        disciplina.setCargaHoraria(dados.cargaHoraria());
    }

    private DisciplinaResponse montarResponse(Disciplina disciplina) {
        int limite = disciplina.getLimiteFaltas();
        int faltadas = faltaRepository.somarHorasPorDisciplina(disciplina.getId());
        return new DisciplinaResponse(
                disciplina.getId(),
                disciplina.getNome(),
                disciplina.getProfessor(),
                disciplina.getDiaSemana(),
                disciplina.getCargaHoraria(),
                limite,
                faltadas,
                Math.max(limite - faltadas, 0));
    }
}
