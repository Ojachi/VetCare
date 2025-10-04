import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
  value: boolean;
  onChange: (val: boolean) => void;
};

export default function YesNoCheckbox({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.option}>
        <Text style={styles.label}>Sí</Text>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => onChange(true)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: value }}
        >
          {value && <View style={styles.checked} />}
        </TouchableOpacity>
      </View>
      <View style={styles.option}>
        <Text style={styles.label}>No</Text>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => onChange(false)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: !value }}
        >
          {!value && <View style={styles.checked} />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  option: { flexDirection: 'row', alignItems: 'center', marginRight: 20 },
  label: { fontSize: 18, marginRight: 6 },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#333',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    width: 16,
    height: 16,
    backgroundColor: '#1166ff',
    borderRadius: 3,
  },
});
