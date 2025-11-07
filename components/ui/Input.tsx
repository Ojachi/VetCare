import React from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';
import colors from '../../styles/colors';

interface InputProps extends TextInputProps {
  style?: object;
}

export default function Input({ style, ...props }: InputProps) {
  return <TextInput style={[styles.input, style]} {...props} />;
}

const styles = StyleSheet.create({
  input: {
    width: '100%',
    height: 50,
    borderColor: colors.lightGray,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginVertical: 8,
    fontSize: 16,
    backgroundColor: colors.white,
  },
});
