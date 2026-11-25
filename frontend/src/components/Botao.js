import React from 'react';
import { Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Botao({
  titulo,
  icone,
  aoPressionar,
  carregando = false,
  cor = '#6FAEDC',
  corEscura = '#3C7DB4',
  style,
  ...resto
}) {
  return (
    <Pressable
      onPress={aoPressionar}
      disabled={carregando}
      accessibilityRole="button"
      accessibilityLabel={titulo}
      accessibilityState={{ disabled: carregando, busy: carregando }}
      style={({ pressed }) => [
        styles.botao,
        { backgroundColor: cor, borderBottomColor: corEscura },
        pressed && !carregando && styles.apertado,
        carregando && styles.desativado,
        style,
      ]}
      {...resto}
    >
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
    minHeight: 56,
    borderRadius: 26,
    borderBottomWidth: 5,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginTop: 10,
    shadowColor: '#9FC4DE',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  apertado: {
    borderBottomWidth: 0,
    marginTop: 15,
    opacity: 0.96,
  },
  desativado: {
    opacity: 0.6,
  },
  icone: {
    marginRight: 8,
  },
  texto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
