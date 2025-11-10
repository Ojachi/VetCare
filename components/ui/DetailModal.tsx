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
  wide?: boolean; // use wider max width
};

export default function DetailModal({ visible, onClose, children, showClose = true, closeText = 'Cerrar', extraFooterButton, wide = false }: Props) {
  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Card style={[styles.modalCard, wide ? styles.modalCardWide : null]}>
          <View style={styles.content}>{children}</View>
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
  modalCard: { padding: 18, width: '96%', alignSelf: 'center', maxWidth: 680 },
  modalCardWide: { maxWidth: 840 },
  content: { maxHeight: '88%', width: '100%', minHeight: 160 },
  footerRow: { flexDirection: 'row', alignItems: 'center' },
});