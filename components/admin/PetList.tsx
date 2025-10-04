import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import PetCard from './PetCard';

export default function PetList({ pets, onEditPet, onOpenDetail, onUpdatePet }) {
  return (
    <FlatList
      data={pets}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <PetCard
          pet={item}
          onEditPet={onEditPet}
          onOpenDetail={onOpenDetail}
          onUpdatePet={onUpdatePet}
        />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16 },
});
