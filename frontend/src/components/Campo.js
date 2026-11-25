import React, { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tema from '../tema';

export default function Campo({
  valor,
  aoMudar,
  placeholder,
  seguro = false,
  tipoTeclado,
  icone,
  style,
  ...resto
}) {
  const [oculto, setOculto] = useState(Boolean(seguro));

  const alternarVisibilidade = () => {
    setOculto((estadoAtual) => !estadoAtual);
  };

  return (
    <View style={styles.area}>
      {icone ? (
        <Ionicons
          name={icone}
          size={19}
          color={tema.textoClaro}
          style={styles.icone}
        />
      ) : null}

      <TextInput
        style={[styles.campo, style]}
        value={valor}
        onChangeText={aoMudar}
        placeholder={placeholder}
        placeholderTextColor={tema.textoClaro}
        secureTextEntry={Boolean(seguro && oculto)}
        keyboardType={tipoTeclado}
        autoCapitalize="none"
        autoCorrect={false}
        {...resto}
      />

      {seguro ? (
        <Pressable
          onPress={alternarVisibilidade}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel={oculto ? 'Mostrar senha' : 'Ocultar senha'}
          style={({ pressed }) => pressed && styles.botaoPressionado}
        >
          <Ionicons
            name={oculto ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={tema.azulEscuro}
          />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  area: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FCFEFF',
    borderWidth: 2,
    borderColor: tema.borda,
    borderRadius: 20,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  icone: {
    marginRight: 10,
  },
  campo: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: tema.texto,
  },
  botaoPressionado: {
    opacity: 0.6,
  },
});
