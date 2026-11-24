import React from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Botao({
  titulo,
  icone,
  aoPressionar,
  carregando,
  cor,
  corEscura,
}) {
  const fundo = cor || '#6FAEDC';
  const sombra = corEscura || '#3C7DB4';

  return (
    <Pressable
      onPress={aoPressionar}
      disabled={carregando}
      style={({ pressed }) => [
        styles.botao,
        { backgroundColor: fundo, borderBottomColor: sombra },
        pressed && styles.apertado,
        carregando && styles.desativado,
      ]}>
      {carregando ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <>
          {icone ? (
            <Ionicons
              name={icone}
              size={19}
              color="#FFFFFF"
              style={styles.icone}
            />
          ) : null}
          <Text style={styles.texto}>{titulo}</Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  botao: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 26,
    borderBottomWidth: 5,
    paddingVertical: 16,
    marginTop: 10,
    shadowColor: '#9FC4DE',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  apertado: { borderBottomWidth: 0, marginTop: 15, opacity: 0.96 },
  desativado: { opacity: 0.6 },
  icone: { marginRight: 8 },
  texto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
