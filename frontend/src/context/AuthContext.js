import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, guardarToken } from '../api/api';

const AuthContext = createContext(null);

const CHAVE_TOKEN = '@faltometro/token';
const CHAVE_NOME = '@faltometro/nome';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [nome, setNome] = useState('');
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const tokenSalvo = await AsyncStorage.getItem(CHAVE_TOKEN);
        const nomeSalvo = await AsyncStorage.getItem(CHAVE_NOME);
        if (tokenSalvo) {
          guardarToken(tokenSalvo);
          setToken(tokenSalvo);
          setNome(nomeSalvo ?? '');
        }
      } finally {
        setCarregando(false);
      }
    })();
  }, []);

  async function guardarSessao(dados) {
    guardarToken(dados.token);
    setToken(dados.token);
    setNome(dados.nome);
    await AsyncStorage.setItem(CHAVE_TOKEN, dados.token);
    await AsyncStorage.setItem(CHAVE_NOME, dados.nome);
  }

  async function entrar(email, senha) {
    const response = await api.post('/auth/login', { email, senha });
    await guardarSessao(response.data);
  }

  async function cadastrar(nome, email, senha) {
    const response = await api.post('/auth/cadastro', { nome, email, senha });
    await guardarSessao(response.data);
  }

  async function sair() {
    guardarToken(null);
    setToken(null);
    setNome('');
    await AsyncStorage.removeItem(CHAVE_TOKEN);
    await AsyncStorage.removeItem(CHAVE_NOME);
  }

  return (
    <AuthContext.Provider
      value={{ token, nome, carregando, entrar, cadastrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
