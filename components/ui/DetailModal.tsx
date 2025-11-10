import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import Button from './Button';
import Card from './Card';
type Props = {
  visible: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  showClose?: boolean; // set false to hide default Close button
  closeText?: string;
};

export default function DetailModal({ visible, onClose, children, showClose = true, closeText = 'Cerrar' }: Props) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Card style={styles.modalCard}>
          <View style={{ maxHeight: '80%' }}>{children}</View>
          {showClose ? (
            <Button title={closeText} onPress={onClose} style={{ marginTop: 16 }} textStyle={{ fontSize: 16 }} />
          ) : null}
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', padding: 24 },
  modalCard: { padding: 18 },
});