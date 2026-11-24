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

export default function LoginScreen() {
  const { ir } = useNavegacao();
  const { entrar } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function aoEntrar() {
    setErro('');
    if (!email || !senha) {
      setErro('Preencha email e senha');
      return;
    }
    setCarregando(true);
    try {
      await entrar(email.trim(), senha);
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
            <Ionicons name="school" size={38} color="#FFFFFF" />
          </View>
          <Text style={styles.titulo}>Faltômetro</Text>
          <Text style={styles.subtitulo}>
            Controle suas presenças sem sustos
          </Text>
        </View>

        <View style={styles.cartao}>
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
            titulo="Entrar"
            icone="log-in-outline"
            aoPressionar={aoEntrar}
            carregando={carregando}
          />
        </View>

        <Pressable onPress={() => ir('Cadastro')} style={styles.rodape}>
          <Text style={styles.link}>
            Não tem conta? <Text style={styles.linkForte}>Cadastre-se</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tela: { flex: 1, backgroundColor: tema.fundo },
  conteudo: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  marca: { alignItems: 'center', marginBottom: 26 },
  circulo: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: tema.azulMedio,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8DB8D6',
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  titulo: { fontSize: 30, fontWeight: '800', color: tema.texto, marginTop: 14 },
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
