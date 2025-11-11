import React from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';
import colors from '../../styles/colors';

interface InputProps extends TextInputProps {
  style?: object;
}

export default function Input({ style, multiline, ...props }: InputProps) {
  return (
    <TextInput
      style={[
        styles.input,
        multiline && styles.multilineInput,
        style,
      ]}
      multiline={multiline}
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
});
