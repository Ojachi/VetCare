import React from 'react';
import { Modal, View, Button, StyleSheet } from 'react-native';

export default function DetailModal({ visible, onClose, children }) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {children}   {/* Aquí renderizas lo que quieras, bien presentado */}
        <Button title="Cerrar" onPress={onClose} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
});