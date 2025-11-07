import React from 'react';
import { Image, ImageSourcePropType, StyleSheet, Text, View } from 'react-native';
import colors from '../../styles/colors';
import typography from '../../styles/typography';

export default function EmptyState({
  title = 'Sin resultados',
  message = 'No hay elementos para mostrar.',
  image,
}: {
  title?: string;
  message?: string;
  image?: ImageSourcePropType;
}) {
  return (
    <View style={styles.container}>
      {image ? <Image source={image} style={styles.image} resizeMode="contain" /> : null}
      <Text style={[typography.h3, { textAlign: 'center' }]}>{title}</Text>
      <Text style={[typography.subtitle, { textAlign: 'center', marginTop: 6 }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  image: { width: 120, height: 120, marginBottom: 12, tintColor: colors.muted },
});
