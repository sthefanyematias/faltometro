import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useNavegacao } from '../navigation/Navegador';
import Campo from '../components/Campo';
import Botao from '../components/Botao';
import tema from '../tema';

export default function CadastroScreen() {
  const { voltar } = useNavegacao();
  const { cadastrar } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function aoCadastrar() {
    setErro('');
    if (!nome || !email || !senha) {
      setErro('Preencha todos os campos');
      return;
    }
    setCarregando(true);
    try {
      await cadastrar(nome.trim(), email.trim(), senha);
    } catch (e) {
      const dados = e.response?.data;
      setErro(
        typeof dados === 'string'
          ? dados
          : 'Não foi possível conectar ao servidor'
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
        <View style={styles.marca}>
          <View style={styles.circulo}>
            <Ionicons name="person-add" size={34} color="#FFFFFF" />
          </View>
          <Text style={styles.titulo}>Criar conta</Text>
          <Text style={styles.subtitulo}>Leva menos de um minuto</Text>
        </View>

        <View style={styles.cartao}>
          <Text style={styles.rotulo}>Nome</Text>
          <Campo
            valor={nome}
            aoMudar={setNome}
            placeholder="Seu nome"
            icone="person-outline"
          />

          <Text style={styles.rotulo}>Email</Text>
          <Campo
            valor={email}
            aoMudar={setEmail}
            placeholder="seu@email.com"
            tipoTeclado="email-address"
            icone="mail-outline"
          />

          <Text style={styles.rotulo}>Senha</Text>
          <Campo
            valor={senha}
            aoMudar={setSenha}
            placeholder="Sua senha"
            seguro
            icone="lock-closed-outline"
          />

          {erro ? <Text style={styles.erro}>{erro}</Text> : null}

          <Botao
            titulo="Criar conta"
            icone="checkmark-circle-outline"
            aoPressionar={aoCadastrar}
            carregando={carregando}
            cor={tema.azulClaro}
            corEscura={tema.azulEscuro}
          />
        </View>

        <Pressable onPress={voltar} style={styles.rodape}>
          <Text style={styles.link}>
            Já tenho conta. <Text style={styles.linkForte}>Entrar</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: tema.fundo },
  conteudo: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  marca: { alignItems: 'center', marginBottom: 22 },
  circulo: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: tema.azulBebe,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#A8C9E0',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  titulo: { fontSize: 28, fontWeight: '800', color: tema.texto, marginTop: 14 },
  subtitulo: { fontSize: 14, color: tema.textoClaro, marginTop: 6 },
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
  rodape: { marginTop: 22 },
  link: { textAlign: 'center', color: tema.textoClaro, fontSize: 14 },
  linkForte: { color: tema.azulEscuro, fontWeight: '800' },
});
