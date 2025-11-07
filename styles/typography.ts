import { StyleSheet } from 'react-native';
import colors from './colors';

const typography = StyleSheet.create({
  h1: { fontSize: 32, fontWeight: '800', color: colors.darkGray },
  h2: { fontSize: 24, fontWeight: '700', color: colors.darkGray },
  h3: { fontSize: 18, fontWeight: '700', color: colors.darkGray },
  subtitle: { fontSize: 16, fontWeight: '600', color: colors.muted },
  body: { fontSize: 16, color: '#333' },
  caption: { fontSize: 13, color: colors.muted },
});

export default typography;
