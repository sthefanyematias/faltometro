import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { Navegador } from './src/navigation/Navegador';
import LoginScreen from './src/screens/LoginScreen';
import CadastroScreen from './src/screens/CadastroScreen';
import DisciplinasScreen from './src/screens/DisciplinasScreen';
import DisciplinaFormScreen from './src/screens/DisciplinaFormScreen';
import DisciplinaDetalheScreen from './src/screens/DisciplinaDetalheScreen';
import tema from './src/tema';

const TODAS_AS_TELAS = {
  LoginScreen,
  CadastroScreen,
  DisciplinasScreen,
  DisciplinaFormScreen,
  DisciplinaDetalheScreen,
};

function Rotas() {
  const { token, carregando } = useAuth();

  const quebradas = Object.entries(TODAS_AS_TELAS)
    .filter(([, componente]) => typeof componente !== 'function')
    .map(([nome]) => nome);

  if (quebradas.length > 0) {
    return (
      <View style={styles.aviso}>
        <Text style={styles.avisoTitulo}>Arquivo sem export</Text>
        <Text style={styles.avisoTexto}>{quebradas.join('\n')}</Text>
        <Text style={styles.avisoDica}>
          Esses arquivos precisam terminar com: export default function Nome()
        </Text>
      </View>
    );
  }

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color={tema.azulMedio} />
      </View>
    );
  }

  if (token) {
    return (
      <Navegador
        key="logado"
        telas={{
          Disciplinas: DisciplinasScreen,
          DisciplinaForm: DisciplinaFormScreen,
          DisciplinaDetalhe: DisciplinaDetalheScreen,
        }}
        inicial="Disciplinas"
      />
    );
  }

  return (
    <Navegador
      key="deslogado"
      telas={{ Login: LoginScreen, Cadastro: CadastroScreen }}
      inicial="Login"
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Rotas />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  centro: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: tema.fundo,
  },
  aviso: {
    flex: 1,
    justifyContent: 'center',
    padding: 28,
    backgroundColor: tema.fundo,
  },
  avisoTitulo: {
    fontSize: 18,
    fontWeight: '800',
    color: '#C75C5C',
    textAlign: 'center',
    marginBottom: 12,
  },
  avisoTexto: {
    fontSize: 16,
    fontWeight: '700',
    color: tema.texto,
    textAlign: 'center',
    lineHeight: 26,
  },
  avisoDica: {
    fontSize: 12,
    color: tema.textoClaro,
    textAlign: 'center',
    marginTop: 18,
  },
});
