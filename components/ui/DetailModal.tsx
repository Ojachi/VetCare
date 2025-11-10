import React from 'react';
import { Modal, StyleSheet, TextStyle, View, ViewStyle } from 'react-native';
import Button from './Button';
import Card from './Card';
type Props = {
  visible: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  showClose?: boolean; // set false to hide default Close button
  closeText?: string;
  extraFooterButton?: { title: string; onPress: () => void; style?: ViewStyle; textStyle?: TextStyle };
};

export default function DetailModal({ visible, onClose, children, showClose = true, closeText = 'Cerrar', extraFooterButton }: Props) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Card style={styles.modalCard}>
          <View style={{ maxHeight: '80%' }}>{children}</View>
          {(showClose || extraFooterButton) ? (
            <View style={styles.footerRow}>
              {extraFooterButton ? (
                <Button
                  title={extraFooterButton.title}
                  onPress={extraFooterButton.onPress}
                  // merge styles manually to satisfy type expectations
                  style={{ flex: 1, marginTop: 16, marginRight: showClose ? 8 : 0, ...(extraFooterButton.style || {}) }}
                  textStyle={{ fontSize: 16, ...(extraFooterButton.textStyle || {}) }}
                />
              ) : null}
              {showClose ? (
                <Button title={closeText} onPress={onClose} style={{ flex: 1, marginTop: 16 }} textStyle={{ fontSize: 16 }} />
              ) : null}
            </View>
          ) : null}
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', padding: 24 },
  modalCard: { padding: 18 },
  footerRow: { flexDirection: 'row', alignItems: 'center' },
});