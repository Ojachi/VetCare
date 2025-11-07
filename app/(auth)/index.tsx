import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Button from '../../components/ui/Button';
import colors from '../../styles/colors';
import typography from '../../styles/typography';

export default function WelcomeScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        {/* HERO */}
        <ImageBackground
          source={{
            uri:
              'https://images.unsplash.com/photo-1558944351-c6ae4f1ea94f?q=80&w=1600&auto=format&fit=crop',
          }}
          style={styles.heroBg}
          imageStyle={styles.bgImage}
        >
          <View style={styles.overlay} />
          <View style={styles.content}>
            <View style={styles.hero}>
              <Image source={require('../../assets/images/icon.png')} style={styles.logo} resizeMode="contain" />
              <Text style={[typography.h1, { color: colors.white }]}>VetCare</Text>
              <Text style={[typography.subtitle, styles.subtitle]}>Cuidado veterinario sencillo, rápido y humano.</Text>
            </View>

            {/* Botones principales removidos del héroe; quedan solo al final */}
          </View>
        </ImageBackground>

        {/* FEATURES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Todo lo que necesitas</Text>
          <View style={styles.featuresGrid}>
            <TouchableOpacity style={styles.featureCard} activeOpacity={0.9} onPress={() => router.push('/(auth)/login' as any)}>
              <Ionicons name="calendar" size={26} color={colors.primary} />
              <Text style={styles.featureTitle}>Agendar cita</Text>
              <Text style={styles.featureText}>Reserva en minutos con tu vet de confianza.</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.featureCard} activeOpacity={0.9} onPress={() => router.push('/(auth)/login' as any)}>
              <Ionicons name="medkit" size={26} color={colors.primary} />
              <Text style={styles.featureTitle}>Historial y diagnósticos</Text>
              <Text style={styles.featureText}>Consulta tratamientos y medicamentos.</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.featureCard} activeOpacity={0.9} onPress={() => router.push('/(auth)/products' as any)}>
              <Ionicons name="cart" size={26} color={colors.primary} />
              <Text style={styles.featureTitle}>Productos para tu mascota</Text>
              <Text style={styles.featureText}>Compra lo esencial desde la app.</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* PROMO ECOMMERCE */}
        <View style={[styles.section, styles.promo]}> 
          <View style={{ flex: 1 }}>
            <Text style={[typography.h2] as any}>Tienda para tu mascota</Text>
            <Text style={[typography.body, { marginTop: 6 }] as any}>
              Explora artículos y productos sin iniciar sesión. Para agregar al carrito y completar tu pedido, inicia sesión.
            </Text>
            <View style={{ height: 10 }} />
            <Button title="Ver productos" onPress={() => router.push('/(auth)/products' as any)} />
          </View>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1544568100-847a948585b9?q=80&w=1200&auto=format&fit=crop' }}
            style={styles.promoImg}
          />
        </View>

        {/* GALLERY */}
        <View style={styles.gallerySection}>
          <View style={styles.galleryCard}>
            <Text style={styles.sectionTitle}>Amigos felices</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryRow}>
              {[
                'https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?q=80&w=1200&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=1200&auto=format&fit=crop',
              ].map((uri) => (
                <Image key={uri} source={{ uri }} style={styles.galleryImg} />
              ))}
            </ScrollView>
          </View>
        </View>

        {/* WHY US */}
        <View style={styles.section}>
          <View style={styles.infoCard}>
            <Text style={styles.sectionTitle}>¿Por qué VetCare?</Text>
            <View style={styles.bullets}>
              <View style={styles.bulletRow}>
                <Ionicons name="shield-checkmark" size={22} color={colors.primary} />
                <Text style={styles.bulletText}>Profesionales certificados y atención cercana.</Text>
              </View>
              <View style={styles.bulletRow}>
                <Ionicons name="time" size={22} color={colors.primary} />
                <Text style={styles.bulletText}>Agenda flexible y recordatorios automáticos.</Text>
              </View>
              <View style={styles.bulletRow}>
                <Ionicons name="leaf" size={22} color={colors.primary} />
                <Text style={styles.bulletText}>Productos y servicios seleccionados para su bienestar.</Text>
              </View>
            </View>
          </View>
        </View>

        {/* BOTTOM CTA */}
        <View style={styles.bottomCtaCard}>
          <Text style={styles.bottomCtaSubtitle}>Crea tu cuenta en 30s</Text>
          <Text style={styles.bottomCtaTitle}>¿Listo para empezar?</Text>
          <View style={styles.bottomButtonsRow}>
            <TouchableOpacity style={[styles.miniBtn, styles.miniBtnOutline]} activeOpacity={0.85} onPress={() => router.push('/(auth)/login' as any)}>
              <Text style={[styles.miniBtnText, styles.miniBtnTextOutline]}>Iniciar sesión</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.miniBtn, styles.miniBtnAlt, styles.miniBtnOutline]} activeOpacity={0.85} onPress={() => router.push('/(auth)/register' as any)}>
              <Text style={[styles.miniBtnText, styles.miniBtnTextOutline]}>Crear cuenta</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  heroBg: { minHeight: 420 },
  bgImage: { width: '100%', height: '100%' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  hero: { alignItems: 'center', marginBottom: 28 },
  logo: { width: 120, height: 120, marginBottom: 12 },
  subtitle: { marginTop: 8, textAlign: 'center', color: '#f1f5f9' },
  actions: { marginTop: 22 },
  footer: { marginTop: 16, textAlign: 'center', color: '#e2e8f0' },
  section: { paddingHorizontal: 20, paddingVertical: 18 },
  sectionTitle: { ...typography.h2 } as any,
  featuresGrid: { flexDirection: 'row', gap: 12, marginTop: 12 },
  featureCard: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  featureTitle: { ...typography.h3, marginTop: 8 } as any,
  featureText: { ...typography.body, marginTop: 4 } as any,
  gallerySection: { paddingVertical: 8, paddingHorizontal: 20 },
  galleryRow: { paddingHorizontal: 0 },
  galleryImg: { width: 180, height: 120, borderRadius: 16, marginRight: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  galleryCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    marginTop: 8,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  bullets: { marginTop: 10, gap: 10 },
  bulletRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  bulletText: { ...typography.body, flex: 1 } as any,
  bottomCta: { paddingHorizontal: 20, paddingTop: 8, gap: 10 },
  bottomCtaTitle: { ...typography.h2, textAlign: 'center', marginBottom: 4 } as any,
  promo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#fff',
    marginHorizontal: 16,
    padding: 14,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  promoImg: { width: 120, height: 120, borderRadius: 12, backgroundColor: '#eee' },
  bottomButtonsRow: { flexDirection: 'row', gap: 12, marginTop: 8, justifyContent: 'center' },
  miniBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: 'transparent',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  miniBtnAlt: { backgroundColor: colors.secondary },
  miniBtnText: { color: colors.primary, fontSize: 14, fontWeight: '700' },
  miniBtnOutline: { borderWidth: 1.2, borderColor: colors.primary, backgroundColor: '#fff' },
  miniBtnTextOutline: {},
  bottomCtaCard: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 14,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    gap: 6,
  },
  bottomCtaSubtitle: { textAlign: 'center', color: '#64748b' },
});
