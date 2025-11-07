import React from 'react';
import { Button, Modal, StyleSheet, View } from 'react-native';

export default function DetailModal({ visible, onClose, children }: { visible: boolean; onClose: () => void; children?: React.ReactNode }) {
  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {children}
        <View style={{ marginTop: 12 }}>
          <Button title="Cerrar" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
});