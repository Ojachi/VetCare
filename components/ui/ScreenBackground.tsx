import React from 'react';
import { ImageBackground, StyleSheet, View, ViewStyle } from 'react-native';

type Props = {
  children: React.ReactNode;
  overlayOpacity?: number;
  style?: ViewStyle | ViewStyle[];
};

export default function ScreenBackground({ children, overlayOpacity = 0.05, style }: Props) {
  return (
    <ImageBackground
      source={require('../../assets/images/background_general.avif')}
      resizeMode="cover"
      style={styles.bg}
      imageStyle={styles.bgImage}
    >
      <View
        pointerEvents="none"
        style={[styles.overlay, { backgroundColor: `rgba(255,255,255,${overlayOpacity})` }]}
      />
      <View style={[styles.content, style]}>{children}</View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  bgImage: { width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject },
  content: { flex: 1 },
});
