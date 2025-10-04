import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PetDetailContent({ pet }) {
  if (!pet) return null;
  return (
    <View>
      <Text style={styles.title}>Mascota: {pet.name}</Text>
      <Text>Especie: {pet.species}</Text>
      <Text>Raza: {pet.breed}</Text>
      <Text>Estado: {pet.active ? 'Activo' : 'Inactivo'}</Text>
      <Text style={styles.section}>Dueño</Text>
      <Text>Nombre: {pet.owner.name}</Text>
      <Text>Email: {pet.owner.email}</Text>
      <Text>Teléfono: {pet.owner.phone}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  section: { marginTop: 13, fontWeight: 'bold', fontSize: 16 },
});
