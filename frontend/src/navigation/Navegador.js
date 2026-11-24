import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
} from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import tema from '../tema';

const NavegacaoContext = createContext(null);

export function useNavegacao() {
  return useContext(NavegacaoContext);
}

export function Navegador({ telas, inicial }) {
  const [pilha, setPilha] = useState([{ nome: inicial, dados: {} }]);
  const opacidade = useRef(new Animated.Value(1)).current;
  const deslocamento = useRef(new Animated.Value(0)).current;

  const trocar = useCallback((acao) => {
    Animated.timing(opacidade, {
      toValue: 0,
      duration: 110,
      useNativeDriver: true,
    }).start(() => {
      acao();
      deslocamento.setValue(14);
      Animated.parallel([
        Animated.timing(opacidade, {
          toValue: 1,
          duration: 190,
          useNativeDriver: true,
        }),
        Animated.timing(deslocamento, {
          toValue: 0,
          duration: 190,
          useNativeDriver: true,
        }),
      ]).start();
    });
  }, []);

  function ir(nome, dados = {}) {
    trocar(() => setPilha((atual) => [...atual, { nome, dados }]));
  }

  function voltar() {
    trocar(() =>
      setPilha((atual) => (atual.length > 1 ? atual.slice(0, -1) : atual))
    );
  }

  const topo = pilha[pilha.length - 1];
  const Tela = telas[topo.nome];

  if (!Tela) {
    return (
      <Animated.View style={[styles.area, { opacity: opacidade }]}>
        <Text style={styles.aviso}>Tela "{topo.nome}" não registrada</Text>
      </Animated.View>
    );
  }

  return (
    <NavegacaoContext.Provider value={{ ir, voltar, dados: topo.dados }}>
      <Animated.View
        style={[
          styles.area,
          { opacity: opacidade, transform: [{ translateX: deslocamento }] },
        ]}>
        <Tela />
      </Animated.View>
    </NavegacaoContext.Provider>
  );
}

const styles = StyleSheet.create({
  area: { flex: 1, backgroundColor: tema.fundo },
  aviso: {
    marginTop: 120,
    textAlign: 'center',
    fontSize: 16,
    color: tema.texto,
  },
});
