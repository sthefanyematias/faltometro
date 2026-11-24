import React, { useState } from 'react';
import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tema from '../tema';

export default function Campo({
  valor,
  aoMudar,
  placeholder,
  seguro,
  tipoTeclado,
  icone,
  ...resto
}) {
  const [oculto, setOculto] = useState(!!seguro);

  return (
    <View style={styles.area}>
      <Ionicons
        name={icone}
        size={19}
        color={tema.textoClaro}
        style={styles.icone}
      />
      <TextInput
        style={styles.campo}
        value={valor}
        onChangeText={aoMudar}
        placeholder={placeholder}
        placeholderTextColor={tema.textoClaro}
        secureTextEntry={seguro ? oculto : false}
        keyboardType={tipoTeclado}
        autoCapitalize="none"
        autoCorrect={false}
        {...resto}
      />
      {seguro ? (
        <Pressable onPress={() => setOculto(!oculto)} hitSlop={12}>
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
  icone: { marginRight: 10 },
  campo: { flex: 1, paddingVertical: 15, fontSize: 16, color: tema.texto },
});
