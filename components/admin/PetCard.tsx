import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Button, StyleSheet } from 'react-native';

export default function PetCard({ pet, onEditPet, onOpenDetail, onUpdatePet }) {
  const [editing, setEditing] = useState(false);
  const [breed, setBreed] = useState(pet.breed);

  return (
    <TouchableOpacity onPress={() => onOpenDetail(pet)}>
      <View style={styles.petCard}>
        <Text style={styles.name}>Nombre: {pet.name}</Text>
        <Text style={styles.items}>Dueño: {pet.owner.name}</Text>
        <Text style={styles.items}>Especie: {pet.species}</Text>
        {!editing ? (
          <>
            <Text style={styles.items}>Raza: {pet.breed}</Text>
            <Button title="Editar Raza" onPress={() => setEditing(true)} />
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              value={breed}
              onChangeText={setBreed}
            />
            <Button title="Guardar" onPress={() => { onUpdatePet(pet.id, { breed }); setEditing(false); }} />
            <Button title="Cancelar" color="red" onPress={() => setEditing(false)} />
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  petCard: {
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  items: { marginBottom: 5, },
  name: { fontWeight: 'bold', fontSize: 16, marginLeft: -3 },
  input: { borderWidth: 1, borderColor: '#999', padding: 6, marginVertical: 8, borderRadius: 5 },
});
