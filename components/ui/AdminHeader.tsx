import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function AdminHeader() {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>Panel Administrativo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 15,
    backgroundColor: '#007bff',
    alignItems: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
