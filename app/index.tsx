import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import colors from '../styles/colors';
import typography from '../styles/typography';

export default function WelcomeScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        {/* HERO */}
        <ImageBackground
          source={require('../assets/images/background_general.avif')}
          style={styles.heroBg}
          imageStyle={styles.bgImage}
        >
          <View style={styles.overlay} />
          <View style={styles.content}>
            <View style={styles.hero}>
              <Image 
                source={require('../assets/images/icon.png')} 
                style={styles.logoImage}
                resizeMode="contain"
              />
              <Text style={[typography.h1, { color: colors.white, fontSize: 42, fontWeight: '900' }]}>VetCare</Text>
              <Text style={[typography.subtitle, styles.subtitle]}>La plataforma completa para el cuidado de tus mascotas</Text>
              <View style={styles.heroCtaContainer}>
                <TouchableOpacity 
                  style={styles.heroPrimaryBtn} 
                  activeOpacity={0.85}
                  onPress={() => router.push('/(auth)/register' as any)}
                >
                  <Text style={styles.heroPrimaryBtnText}>Comenzar Ahora</Text>
                  <Ionicons name="arrow-forward" size={18} color="#fff" style={{ marginLeft: 8 }} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ImageBackground>

        {/* QUICK FEATURES */}
        <View style={styles.quickFeatures}>
          <View style={styles.quickFeatureItem}>
            <Text style={styles.quickFeatureIcon}>⚡</Text>
            <Text style={styles.quickFeatureText}>Rápido y fácil</Text>
          </View>
          <View style={styles.dividerVertical} />
          <View style={styles.quickFeatureItem}>
            <Text style={styles.quickFeatureIcon}>🔒</Text>
            <Text style={styles.quickFeatureText}>Seguro</Text>
          </View>
          <View style={styles.dividerVertical} />
          <View style={styles.quickFeatureItem}>
            <Text style={styles.quickFeatureIcon}>👨‍⚕️</Text>
            <Text style={styles.quickFeatureText}>Profesional</Text>
          </View>
        </View>

        {/* FEATURES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>¿Qué puedes hacer?</Text>
          <View style={styles.featuresGrid}>
            <TouchableOpacity style={styles.featureCard} activeOpacity={0.85} onPress={() => router.push('/(auth)/login' as any)}>
              <View style={styles.featureIconBg}>
                <Ionicons name="calendar" size={32} color={colors.primary} />
              </View>
              <Text style={styles.featureTitle}>Agendar Citas</Text>
              <Text style={styles.featureText}>Reserva consultas veterinarias en minutos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.featureCard} activeOpacity={0.85} onPress={() => router.push('/(auth)/login' as any)}>
              <View style={styles.featureIconBg}>
                <Ionicons name="document" size={32} color={colors.primary} />
              </View>
              <Text style={styles.featureTitle}>Historial Médico</Text>
              <Text style={styles.featureText}>Acceso al historial de tu mascota</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.featureCard} activeOpacity={0.85} onPress={() => router.push('/(auth)/login' as any)}>
              <View style={styles.featureIconBg}>
                <Ionicons name="bag" size={32} color={colors.primary} />
              </View>
              <Text style={styles.featureTitle}>Tienda</Text>
              <Text style={styles.featureText}>Productos para tu mascota</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.featureCard} activeOpacity={0.85} onPress={() => router.push('/(auth)/login' as any)}>
              <View style={styles.featureIconBg}>
                <Ionicons name="paw" size={32} color={colors.primary} />
              </View>
              <Text style={styles.featureTitle}>Mis Mascotas</Text>
              <Text style={styles.featureText}>Gestiona todos tus pets</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.featureCard} activeOpacity={0.85} onPress={() => router.push('/(auth)/login' as any)}>
              <View style={styles.featureIconBg}>
                <Ionicons name="flask" size={32} color={colors.primary} />
              </View>
              <Text style={styles.featureTitle}>Diagnósticos</Text>
              <Text style={styles.featureText}>Consulta diagnósticos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.featureCard} activeOpacity={0.85} onPress={() => router.push('/(auth)/products' as any)}>
              <View style={styles.featureIconBg}>
                <Ionicons name="heart" size={32} color={colors.primary} />
              </View>
              <Text style={styles.featureTitle}>Bienestar</Text>
              <Text style={styles.featureText}>Consejos de salud</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* PROMO SECTION */}
        <View style={styles.promoSection}>
          <View style={styles.promoBgContainer}>
            <Image
              source={require('../assets/images/perro_producto.avif')}
              style={styles.promoBgImage}
            />
            <View style={styles.promoBgOverlay} />
            <View style={styles.promoContent}>
              <View style={styles.promoBadge}>
                <Text style={styles.promoBadgeText}>🎁 EXCLUSIVO</Text>
              </View>
              <Text style={styles.promoTitle}>Tienda de Productos</Text>
              <Text style={styles.promoDesc}>Alimentos, juguetes y accesorios de calidad para el bienestar de tu mascota</Text>
              <View style={styles.promoFeatures}>
                <View style={styles.promoFeature}>
                  <Text style={styles.promoFeatureIcon}>✓</Text>
                  <Text style={styles.promoFeatureText}>Productos seleccionados</Text>
                </View>
                <View style={styles.promoFeature}>
                  <Text style={styles.promoFeatureIcon}>✓</Text>
                  <Text style={styles.promoFeatureText}>Envíos rápidos</Text>
                </View>
                <View style={styles.promoFeature}>
                  <Text style={styles.promoFeatureIcon}>✓</Text>
                  <Text style={styles.promoFeatureText}>Garantía de calidad</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.promoBtn}
                activeOpacity={0.85}
                onPress={() => router.push('/(auth)/products' as any)}
              >
                <Text style={styles.promoBtnText}>Explorar Catálogo</Text>
                <Ionicons name="arrow-forward" size={16} color={colors.primary} style={{ marginLeft: 8 }} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* WHY US */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>¿Por qué confiar en VetCare?</Text>
          <View style={styles.infoCard}>
            <View style={styles.infoItem}>
              <View style={styles.infoBadge}>
                <Ionicons name="shield-checkmark" size={24} color={colors.primary} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>Veterinarios Certificados</Text>
                <Text style={styles.infoText}>Equipo profesional y experimentado</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.infoBadge}>
                <Ionicons name="time" size={24} color={colors.primary} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>Disponible 24/7</Text>
                <Text style={styles.infoText}>Agenda cuando lo necesites</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.infoBadge}>
                <Ionicons name="lock-closed" size={24} color={colors.primary} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>Datos Seguros</Text>
                <Text style={styles.infoText}>Información protegida</Text>
              </View>
            </View>
            <View style={styles.infoItem}>
              <View style={styles.infoBadge}>
                <Ionicons name="gift" size={24} color={colors.primary} />
              </View>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>Promociones</Text>
                <Text style={styles.infoText}>Ofertas exclusivas para usuarios</Text>
              </View>
            </View>
          </View>
        </View>

        {/* STATS */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>5K+</Text>
            <Text style={styles.statLabel}>Mascotas cuidadas</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>98%</Text>
            <Text style={styles.statLabel}>Satisfacción</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>500+</Text>
            <Text style={styles.statLabel}>Veterinarios</Text>
          </View>
        </View>

        {/* GALLERY */}
        <View style={styles.gallerySection}>
          <Text style={styles.sectionTitle}>Nuestros amigos felices</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryRow}>
            {[require('../assets/images/perro.avif'),
              require('../assets/images/perro2.avif'),
              require('../assets/images/gato.avif'),
            ].map((uri) => (
              <Image key={uri} source={uri} style={styles.galleryImg} />
            ))}
          </ScrollView>
        </View>

        {/* BOTTOM CTA */}
        <View style={styles.bottomCtaSection}>
          <View style={styles.bottomCtaCard}>
            <Text style={styles.bottomCtaIcon}>🚀</Text>
            <Text style={styles.bottomCtaTitle}>¿Listo para empezar?</Text>
            <Text style={styles.bottomCtaSubtitle}>Únete a miles de dueños de mascotas</Text>
            <View style={styles.bottomButtonsRow}>
              <TouchableOpacity 
                style={styles.primaryCtaBtn} 
                activeOpacity={0.85}
                onPress={() => router.push('/(auth)/register' as any)}
              >
                <Text style={styles.primaryCtaBtnText}>Crear Cuenta</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.secondaryCtaBtn} 
                activeOpacity={0.85}
                onPress={() => router.push('/(auth)/login' as any)}
              >
                <Text style={styles.secondaryCtaBtnText}>Iniciar Sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2024 VetCare. Todos los derechos reservados.</Text>
          <View style={styles.footerLinks}>
            <Text style={styles.footerLink}>Privacidad</Text>
            <Text style={styles.footerDot}>•</Text>
            <Text style={styles.footerLink}>Términos</Text>
            <Text style={styles.footerDot}>•</Text>
            <Text style={styles.footerLink}>Contacto</Text>
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: colors.background,
  },
  heroBg: { 
    minHeight: 480,
  },
  bgImage: { 
    width: '100%', 
    height: '100%' 
  },
  overlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0,0,0,0.4)' 
  },
  content: { 
    flex: 1, 
    padding: 24, 
    justifyContent: 'center',
    paddingTop: 40,
  },
  hero: { 
    alignItems: 'center', 
    marginBottom: 28 
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  logo: { 
    fontSize: 80, 
    marginBottom: 16,
  },
  subtitle: { 
    marginTop: 12, 
    textAlign: 'center', 
    color: '#f1f5f9',
    fontSize: 16,
    lineHeight: 24,
  },
  heroCtaContainer: {
    marginTop: 24,
    width: '100%',
  },
  heroPrimaryBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  heroPrimaryBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  quickFeatures: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  quickFeatureItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickFeatureIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  quickFeatureText: {
    ...typography.caption,
    fontWeight: '600',
    color: colors.darkGray,
    fontSize: 12,
    textAlign: 'center',
  },
  dividerVertical: {
    width: 1,
    backgroundColor: '#E5E7EB',
  },
  section: { 
    paddingHorizontal: 20, 
    paddingVertical: 28 
  },
  sectionTitle: { 
    ...typography.h2,
    fontSize: 24,
    fontWeight: '800',
    color: colors.darkGray,
    marginBottom: 20,
  },
  featuresGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    width: '48%',
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
    alignItems: 'center',
  },
  featureIconBg: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: 'rgba(46, 139, 87, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  featureTitle: { 
    ...typography.body,
    fontWeight: '700',
    color: colors.darkGray,
    marginBottom: 6,
    textAlign: 'center',
    fontSize: 14,
  },
  featureText: { 
    ...typography.caption,
    color: colors.muted,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
  promoSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  promoBgContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    minHeight: 300,
    justifyContent: 'flex-end',
  },
  promoBgImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  promoBgOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  promoContent: {
    padding: 24,
    zIndex: 1,
  },
  promoBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginBottom: 12,
  },
  promoBadgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 11,
    letterSpacing: 0.5,
  },
  promoTitle: {
    ...typography.h2,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 10,
    fontSize: 28,
  },
  promoDesc: {
    color: 'rgba(255, 255, 255, 0.95)',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    fontWeight: '500',
  },
  promoFeatures: {
    gap: 10,
    marginBottom: 18,
  },
  promoFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  promoFeatureIcon: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 16,
  },
  promoFeatureText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    fontWeight: '500',
  },
  promoBtn: {
    backgroundColor: '#fff',
    paddingVertical: 13,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  promoBtnText: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 15,
  },
  promoImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(46, 139, 87, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  infoTitle: {
    ...typography.body,
    fontWeight: '700',
    color: colors.darkGray,
    marginBottom: 4,
    fontSize: 14,
  },
  infoText: {
    ...typography.caption,
    color: colors.muted,
    fontSize: 12,
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 14,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  statNumber: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 22,
    marginBottom: 4,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '600',
  },
  gallerySection: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  galleryRow: { 
    gap: 12,
    paddingHorizontal: 0 
  },
  galleryImg: { 
    width: 200, 
    height: 140, 
    borderRadius: 16, 
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
  },
  bottomCtaSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  bottomCtaCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  bottomCtaIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  bottomCtaTitle: {
    ...typography.h2,
    fontWeight: '800',
    color: colors.darkGray,
    marginBottom: 8,
    textAlign: 'center',
    fontSize: 24,
  },
  bottomCtaSubtitle: {
    ...typography.body,
    color: colors.muted,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 14,
  },
  bottomButtonsRow: { 
    flexDirection: 'row', 
    gap: 12, 
    width: '100%',
  },
  primaryCtaBtn: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  primaryCtaBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },
  secondaryCtaBtn: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryCtaBtnText: {
    color: colors.primary,
    fontWeight: '800',
    fontSize: 15,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerText: {
    ...typography.caption,
    color: colors.muted,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  footerLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  footerLink: {
    ...typography.caption,
    color: colors.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  footerDot: {
    color: colors.muted,
    fontSize: 10,
  },
});
