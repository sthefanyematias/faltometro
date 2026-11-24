import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../api/api';
import { useNavegacao } from '../navigation/Navegador';
import Campo from '../components/Campo';
import Botao from '../components/Botao';
import tema from '../tema';

export default function DisciplinaFormScreen() {
  const { voltar, dados } = useNavegacao();
  const editando = dados.disciplina;

  const [nome, setNome] = useState(editando?.nome || '');
  const [professor, setProfessor] = useState(editando?.professor || '');
  const [diaSemana, setDiaSemana] = useState(editando?.diaSemana || '');
  const [cargaHoraria, setCargaHoraria] = useState(
    editando ? String(editando.cargaHoraria) : ''
  );
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function salvar() {
    setErro('');
    if (!nome || !cargaHoraria || Number.isNaN(Number(cargaHoraria))) {
      setErro('Informe o nome e uma carga horária válida');
      return;
    }

    const corpo = {
      nome: nome.trim(),
      professor: professor.trim(),
      diaSemana: diaSemana.trim(),
      cargaHoraria: Number(cargaHoraria),
    };

    setCarregando(true);
    try {
      if (editando) {
        await api.put(`/disciplinas/${editando.id}`, corpo);
      } else {
        await api.post('/disciplinas', corpo);
      }
      voltar();
    } catch (e) {
      const mensagem = e.response?.data;
      setErro(
        typeof mensagem === 'string' ? mensagem : 'Não foi possível salvar'
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.tela}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled">
        <View style={styles.cabecalho}>
          <Pressable onPress={voltar} style={styles.voltar}>
            <Ionicons name="arrow-back" size={22} color={tema.texto} />
          </Pressable>
          <Text style={styles.titulo}>
            {editando ? 'Editar disciplina' : 'Nova disciplina'}
          </Text>
        </View>

        <View style={styles.cartao}>
          <Text style={styles.rotulo}>Nome</Text>
          <Campo
            valor={nome}
            aoMudar={setNome}
            placeholder="Banco de Dados"
            icone="book-outline"
          />

          <Text style={styles.rotulo}>Professor</Text>
          <Campo
            valor={professor}
            aoMudar={setProfessor}
            placeholder="Me. Silva"
            icone="person-outline"
          />

          <Text style={styles.rotulo}>Dia da semana</Text>
          <Campo
            valor={diaSemana}
            aoMudar={setDiaSemana}
            placeholder="Terça"
            icone="calendar-outline"
          />

          <Text style={styles.rotulo}>Carga horária (horas no semestre)</Text>
          <Campo
            valor={cargaHoraria}
            aoMudar={setCargaHoraria}
            placeholder="72"
            tipoTeclado="numeric"
            icone="time-outline"
          />

          {erro ? <Text style={styles.erro}>{erro}</Text> : null}

          <Botao
            titulo={editando ? 'Salvar alterações' : 'Cadastrar'}
            icone="checkmark-circle-outline"
            aoPressionar={salvar}
            carregando={carregando}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: tema.fundo },
  conteudo: { padding: 24, paddingTop: 56, paddingBottom: 40 },
  cabecalho: { flexDirection: 'row', alignItems: 'center', marginBottom: 22 },
  voltar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: tema.cartao,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: tema.borda,
    marginRight: 12,
  },
  titulo: { fontSize: 21, fontWeight: '800', color: tema.texto },
  cartao: {
    backgroundColor: tema.cartao,
    borderRadius: tema.raio,
    padding: 20,
    borderWidth: 2,
    borderColor: tema.borda,
  },
  rotulo: {
    fontSize: 12,
    fontWeight: '700',
    color: tema.textoClaro,
    marginBottom: 6,
    marginLeft: 4,
  },
  erro: {
    color: '#C75C5C',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
});
