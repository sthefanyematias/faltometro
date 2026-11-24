import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useNavegacao } from '../navigation/Navegador';
import tema from '../tema';

const HORAS_POR_DIA = 4;

function corDaBarra(proporcao) {
  if (proporcao >= 0.7) return tema.vermelho;
  if (proporcao >= 0.5) return tema.amarelo;
  return tema.verde;
}

export default function DisciplinasScreen() {
  const { nome, sair } = useAuth();
  const { ir } = useNavegacao();
  const [disciplinas, setDisciplinas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);

  async function carregar() {
    try {
      const response = await api.get('/disciplinas');
      setDisciplinas(response.data);
    } catch (e) {
      setDisciplinas([]);
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  const totalFaltas = disciplinas.reduce(
    (soma, disciplina) => soma + disciplina.horasFaltadas,
    0
  );

  function cartao({ item }) {
    const proporcao =
      item.limiteFaltas === 0 ? 0 : item.horasFaltadas / item.limiteFaltas;
    const largura = Math.min(proporcao, 1) * 100;
    const diasFaltados = Math.ceil(item.horasFaltadas / HORAS_POR_DIA);
    const diasRestantes = Math.floor(item.podeFaltar / HORAS_POR_DIA);
    const excedeu = item.horasFaltadas > item.limiteFaltas;

    return (
      <Pressable
        style={styles.cartao}
        onPress={() => ir('DisciplinaDetalhe', { disciplina: item })}>
        <Text style={styles.nomeDisciplina} numberOfLines={2}>
          {item.nome}
        </Text>

        <Text style={styles.detalhe}>
          {item.professor || 'Sem professor'} · {item.diaSemana || 'Sem dia'}
        </Text>

        <View style={styles.trilho}>
          <View
            style={[
              styles.preenchimento,
              { width: `${largura}%`, backgroundColor: corDaBarra(proporcao) },
            ]}
          />
        </View>

        {excedeu ? (
          <View style={styles.linhaReprovado}>
            <Ionicons name="close-circle" size={16} color="#B4453F" />
            <Text style={styles.textoReprovado}>Reprovado por falta</Text>
          </View>
        ) : (
          <View style={styles.linhaRodape}>
            <Text style={styles.rodapeCartao}>
              {item.horasFaltadas}h / {diasFaltados} dia(s)
            </Text>
            <Text style={styles.rodapeCartao}>
              pode faltar {item.podeFaltar}h / {diasRestantes} dia(s)
            </Text>
          </View>
        )}
      </Pressable>
    );
  }

  return (
    <View style={styles.tela}>
      <View style={styles.topo}>
        <View>
          <Text style={styles.ola}>Oi, {nome}</Text>
          <Text style={styles.subtitulo}>
            {disciplinas.length} disciplinas · {totalFaltas}h faltadas
          </Text>
        </View>
        <Pressable onPress={sair} style={styles.botaoSair}>
          <Ionicons name="log-out-outline" size={20} color={tema.azulEscuro} />
        </Pressable>
      </View>

      {carregando ? (
        <ActivityIndicator
          size="large"
          color={tema.azulMedio}
          style={{ marginTop: 40 }}
        />
      ) : (
        <FlatList
          data={disciplinas}
          keyExtractor={(item) => String(item.id)}
          renderItem={cartao}
          contentContainerStyle={styles.lista}
          refreshControl={
            <RefreshControl
              refreshing={atualizando}
              onRefresh={() => {
                setAtualizando(true);
                carregar();
              }}
              tintColor={tema.azulMedio}
            />
          }
          ListEmptyComponent={
            <View style={styles.vazio}>
              <Ionicons name="book-outline" size={40} color={tema.textoClaro} />
              <Text style={styles.vazioTitulo}>Nenhuma disciplina</Text>
              <Text style={styles.vazioTexto}>
                Toque no + para cadastrar a primeira
              </Text>
            </View>
          }
        />
      )}

      <Pressable style={styles.fab} onPress={() => ir('DisciplinaForm', {})}>
        <Ionicons name="add" size={30} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: tema.fundo },
  topo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 16,
  },
  ola: { fontSize: 24, fontWeight: '800', color: tema.texto },
  subtitulo: { fontSize: 13, color: tema.textoClaro, marginTop: 4 },
  botaoSair: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: tema.cartao,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: tema.borda,
  },
  lista: { paddingHorizontal: 24, paddingBottom: 160 },
  cartao: {
    backgroundColor: tema.cartao,
    borderRadius: tema.raio,
    padding: 18,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: tema.borda,
  },
  nomeDisciplina: { fontSize: 17, fontWeight: '800', color: tema.texto },
  detalhe: {
    fontSize: 13,
    color: tema.textoClaro,
    marginTop: 6,
    marginBottom: 14,
  },
  trilho: {
    height: 10,
    borderRadius: 5,
    backgroundColor: tema.borda,
    overflow: 'hidden',
  },
  preenchimento: { height: 10, borderRadius: 5 },
  linhaRodape: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  linhaReprovado: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  textoReprovado: {
    fontSize: 13,
    fontWeight: '800',
    color: '#B4453F',
    marginLeft: 6,
  },
  rodapeCartao: { fontSize: 12, color: tema.textoClaro, fontWeight: '600' },
  vazio: { alignItems: 'center', marginTop: 80 },
  vazioTitulo: {
    fontSize: 17,
    fontWeight: '800',
    color: tema.texto,
    marginTop: 12,
  },
  vazioTexto: { fontSize: 13, color: tema.textoClaro, marginTop: 4 },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 80,
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: tema.azulMedio,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8DB8D6',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 6,
  },
});
