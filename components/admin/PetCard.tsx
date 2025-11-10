import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PetCard({ pet, onOpenDetail }) {
  return (
    <TouchableOpacity onPress={() => onOpenDetail(pet)}>
      <View style={styles.petCard}>
        <Text style={styles.name}>Nombre: {pet.name}</Text>
        <Text style={styles.items}>Dueño: {pet.owner.name}</Text>
        <Text style={styles.items}>Especie: {pet.species}</Text>
        <Text style={[styles.items, { marginBottom: 0 }]}>Raza: {pet.breed}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  petCard: {
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  items: { marginBottom: 6 },
  name: { fontWeight: 'bold', fontSize: 16 },
});
