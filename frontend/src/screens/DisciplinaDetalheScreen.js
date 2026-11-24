import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../api/api';
import { useNavegacao } from '../navigation/Navegador';
import Campo from '../components/Campo';
import Botao from '../components/Botao';
import tema from '../tema';

const HORAS_POR_DIA = 4;

function hojeBR() {
  const agora = new Date();
  const dia = String(agora.getDate()).padStart(2, '0');
  const mes = String(agora.getMonth() + 1).padStart(2, '0');
  return `${dia}/${mes}/${agora.getFullYear()}`;
}

function mascaraData(texto) {
  const numeros = texto.replace(/\D/g, '').slice(0, 8);
  if (numeros.length <= 2) return numeros;
  if (numeros.length <= 4) return `${numeros.slice(0, 2)}/${numeros.slice(2)}`;
  return `${numeros.slice(0, 2)}/${numeros.slice(2, 4)}/${numeros.slice(4)}`;
}

function paraISO(dataBR) {
  const partes = dataBR.split('/');
  if (partes.length !== 3 || partes[2].length !== 4) return null;
  const [dia, mes, ano] = partes;
  if (Number(dia) < 1 || Number(dia) > 31) return null;
  if (Number(mes) < 1 || Number(mes) > 12) return null;
  return `${ano}-${mes}-${dia}`;
}

function paraBR(dataISO) {
  return dataISO.split('-').reverse().join('/');
}

function confirmar(titulo, mensagem, aoConfirmar) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${titulo}\n\n${mensagem}`)) {
      aoConfirmar();
    }
    return;
  }
  Alert.alert(titulo, mensagem, [
    { text: 'Cancelar', style: 'cancel' },
    { text: 'Excluir', style: 'destructive', onPress: aoConfirmar },
  ]);
}

export default function DisciplinaDetalheScreen() {
  const { dados, voltar, ir } = useNavegacao();
  const [disciplina, setDisciplina] = useState(dados.disciplina);
  const [faltas, setFaltas] = useState([]);
  const [data, setData] = useState(hojeBR());
  const [horas, setHoras] = useState(String(HORAS_POR_DIA));
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function carregar() {
    try {
      const [disciplinaResponse, faltasResponse] = await Promise.all([
        api.get(`/disciplinas/${disciplina.id}`),
        api.get(`/disciplinas/${disciplina.id}/faltas`),
      ]);
      setDisciplina(disciplinaResponse.data);
      setFaltas(faltasResponse.data);
    } catch (e) {
      setErro('Não foi possível carregar os dados');
    }
  }

  useEffect(() => {
    carregar();
  }, []);

  async function registrar() {
    setErro('');
    const dataISO = paraISO(data);
    if (!dataISO) {
      setErro('Data inválida. Use dd/mm/aaaa');
      return;
    }
    if (!horas || Number.isNaN(Number(horas))) {
      setErro('Informe as horas perdidas');
      return;
    }

    setCarregando(true);
    try {
      await api.post(`/disciplinas/${disciplina.id}/faltas`, {
        data: dataISO,
        quantidadeHoras: Number(horas),
      });
      await carregar();
      setHoras(String(HORAS_POR_DIA));
    } catch (e) {
      const mensagem = e.response?.data;
      setErro(
        typeof mensagem === 'string' ? mensagem : 'Não foi possível registrar'
      );
    } finally {
      setCarregando(false);
    }
  }

  function excluirFalta(id) {
    confirmar('Excluir falta', 'Deseja remover este registro?', async () => {
      await api.delete(`/faltas/${id}`);
      carregar();
    });
  }

  function excluirDisciplina() {
    confirmar(
      'Excluir disciplina',
      `Apagar "${disciplina.nome}" e todas as suas faltas?`,
      async () => {
        await api.delete(`/disciplinas/${disciplina.id}`);
        voltar();
      }
    );
  }

  const proporcao =
    disciplina.limiteFaltas === 0
      ? 0
      : disciplina.horasFaltadas / disciplina.limiteFaltas;
  const largura = Math.min(proporcao, 1) * 100;
  const corBarra =
    proporcao >= 0.7
      ? tema.vermelho
      : proporcao >= 0.5
      ? tema.amarelo
      : tema.verde;

  const diasFaltados = Math.ceil(disciplina.horasFaltadas / HORAS_POR_DIA);
  const diasRestantes = Math.floor(disciplina.podeFaltar / HORAS_POR_DIA);
  const limiteDias = Math.floor(disciplina.limiteFaltas / HORAS_POR_DIA);

  const excedeu = disciplina.horasFaltadas > disciplina.limiteFaltas;
  const excedente = disciplina.horasFaltadas - disciplina.limiteFaltas;
  const emRisco = !excedeu && proporcao >= 0.7;

  return (
    <ScrollView
      style={styles.tela}
      contentContainerStyle={styles.conteudo}
      keyboardShouldPersistTaps="handled">
      <View style={styles.cabecalho}>
        <Pressable onPress={voltar} style={styles.iconeBotao}>
          <Ionicons name="arrow-back" size={22} color={tema.texto} />
        </Pressable>
        <View style={styles.acoes}>
          <Pressable
            onPress={() => ir('DisciplinaForm', { disciplina })}
            style={styles.iconeBotao}>
            <Ionicons name="create-outline" size={20} color={tema.texto} />
          </Pressable>
          <Pressable onPress={excluirDisciplina} style={styles.iconeBotao}>
            <Ionicons name="trash-outline" size={20} color={tema.azulEscuro} />
          </Pressable>
        </View>
      </View>

      <Text style={styles.nome}>{disciplina.nome}</Text>
      <Text style={styles.detalhe}>
        {disciplina.professor || 'Sem professor'} ·{' '}
        {disciplina.diaSemana || 'Sem dia'} · {disciplina.cargaHoraria}h
      </Text>

      {excedeu ? (
        <View style={styles.faixaReprovado}>
          <Ionicons name="close-circle" size={22} color="#FFFFFF" />
          <Text style={styles.faixaTexto}>
            Reprovado por falta · {excedente}h acima do limite
          </Text>
        </View>
      ) : null}

      <View style={styles.cartao}>
        <Text style={styles.rotulo}>
          Limite de faltas · 25% de {disciplina.cargaHoraria}h
        </Text>
        <Text style={styles.numeroGrande}>{disciplina.limiteFaltas}h</Text>
        <Text style={styles.legenda}>
          equivale a {limiteDias} dia(s) de {HORAS_POR_DIA}h
        </Text>

        <View style={styles.trilho}>
          <View
            style={[
              styles.preenchimento,
              { width: `${largura}%`, backgroundColor: corBarra },
            ]}
          />
        </View>

        <View style={styles.linhaValores}>
          <View>
            <Text style={styles.valorForte}>{disciplina.horasFaltadas}h</Text>
            <Text style={styles.valor}>{diasFaltados} dia(s) faltado(s)</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.valorForte}>{disciplina.podeFaltar}h</Text>
            <Text style={styles.valor}>
              {excedeu
                ? 'limite excedido'
                : `${diasRestantes} dia(s) disponível(is)`}
            </Text>
          </View>
        </View>

        {excedeu ? (
          <Text style={styles.textoReprovado}>
            Você passou do limite permitido e está reprovado por falta nesta
            disciplina.
          </Text>
        ) : emRisco ? (
          <Text style={styles.textoRisco}>
            Atenção: você já usou {Math.round(proporcao * 100)}% do limite de
            faltas.
          </Text>
        ) : null}
      </View>

      <View style={styles.cartao}>
        <Text style={styles.tituloCard}>Registrar falta</Text>
        <Text style={styles.rotulo}>Data</Text>
        <Campo
          valor={data}
          aoMudar={(texto) => setData(mascaraData(texto))}
          placeholder="dd/mm/aaaa"
          tipoTeclado="numeric"
          icone="calendar-outline"
        />
        <Text style={styles.rotulo}>Horas perdidas</Text>
        <Campo
          valor={horas}
          aoMudar={setHoras}
          placeholder={String(HORAS_POR_DIA)}
          tipoTeclado="numeric"
          icone="time-outline"
        />

        {erro ? <Text style={styles.erro}>{erro}</Text> : null}

        <Botao
          titulo="Registrar"
          icone="add-circle-outline"
          aoPressionar={registrar}
          carregando={carregando}
        />
      </View>

      <Text style={styles.tituloCard}>Histórico</Text>

      {faltas.length === 0 ? (
        <Text style={styles.semFaltas}>Nenhuma falta registrada</Text>
      ) : (
        faltas.map((falta) => (
          <View key={falta.id} style={styles.itemFalta}>
            <View>
              <Text style={styles.dataFalta}>{paraBR(falta.data)}</Text>
              <Text style={styles.horasFalta}>{falta.quantidadeHoras}h</Text>
            </View>
            <Pressable onPress={() => excluirFalta(falta.id)}>
              <Ionicons
                name="trash-outline"
                size={19}
                color={tema.textoClaro}
              />
            </Pressable>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: tema.fundo },
  conteudo: { padding: 24, paddingTop: 56, paddingBottom: 40 },
  cabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  acoes: { flexDirection: 'row' },
  iconeBotao: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: tema.cartao,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: tema.borda,
    marginLeft: 10,
  },
  nome: { fontSize: 26, fontWeight: '800', color: tema.texto },
  detalhe: {
    fontSize: 13,
    color: tema.textoClaro,
    marginTop: 6,
    marginBottom: 20,
  },
  faixaReprovado: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D46A64',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  faixaTexto: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 10,
    flex: 1,
  },
  cartao: {
    backgroundColor: tema.cartao,
    borderRadius: tema.raio,
    padding: 20,
    borderWidth: 2,
    borderColor: tema.borda,
    marginBottom: 16,
  },
  rotulo: {
    fontSize: 12,
    fontWeight: '700',
    color: tema.textoClaro,
    marginBottom: 6,
    marginLeft: 4,
  },
  numeroGrande: { fontSize: 34, fontWeight: '800', color: tema.texto },
  legenda: {
    fontSize: 12,
    color: tema.textoClaro,
    marginTop: 2,
    marginBottom: 14,
  },
  trilho: {
    height: 12,
    borderRadius: 6,
    backgroundColor: tema.borda,
    overflow: 'hidden',
  },
  preenchimento: { height: 12, borderRadius: 6 },
  linhaValores: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  valorForte: { fontSize: 18, fontWeight: '800', color: tema.texto },
  valor: { fontSize: 12, color: tema.textoClaro, marginTop: 2 },
  textoReprovado: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B4453F',
    marginTop: 14,
  },
  textoRisco: {
    fontSize: 13,
    fontWeight: '700',
    color: '#9A7A1E',
    marginTop: 14,
  },
  tituloCard: {
    fontSize: 16,
    fontWeight: '800',
    color: tema.texto,
    marginBottom: 12,
  },
  erro: {
    color: '#C75C5C',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  semFaltas: {
    fontSize: 13,
    color: tema.textoClaro,
    textAlign: 'center',
    marginTop: 10,
  },
  itemFalta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: tema.cartao,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderWidth: 2,
    borderColor: tema.borda,
    marginBottom: 10,
  },
  dataFalta: { fontSize: 15, fontWeight: '700', color: tema.texto },
  horasFalta: { fontSize: 12, color: tema.textoClaro, marginTop: 2 },
});
