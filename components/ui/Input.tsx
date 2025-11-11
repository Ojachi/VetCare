import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import colors from '../../styles/colors';

interface InputProps extends TextInputProps {
  style?: object;
  showPasswordToggle?: boolean;
}

export default function Input({ style, multiline, showPasswordToggle, secureTextEntry, ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  if (showPasswordToggle && secureTextEntry) {
    return (
      <View style={styles.passwordContainer}>
        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            style,
            styles.passwordInput,
          ]}
          multiline={multiline}
          secureTextEntry={!showPassword}
          {...props}
        />
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setShowPassword(!showPassword)}
          activeOpacity={0.7}
        >
          <MaterialIcons
            name={showPassword ? 'visibility' : 'visibility-off'}
            size={20}
            color={colors.muted}
          />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TextInput
      style={[
        styles.input,
        multiline && styles.multilineInput,
        style,
      ]}
      multiline={multiline}
      secureTextEntry={secureTextEntry}
      {...props}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 50,
    borderColor: colors.lightGray,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginVertical: 0,
    fontSize: 15,
    fontWeight: '500',
    backgroundColor: colors.white,
    color: colors.darkGray,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingVertical: 12,
  },
  passwordContainer: {
    position: 'relative',
    width: '100%',
  },
  passwordInput: {
    paddingRight: 50,
  },
  toggleButton: {
    position: 'absolute',
    right: 12,
    top: 15,
    padding: 6,
  },
});
