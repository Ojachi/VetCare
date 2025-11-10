import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import PetCard from './PetCard';

type Pet = {
  id: number;
  name: string;
  owner: { name: string };
  species: string;
  breed: string;
};

interface Props {
  pets: Pet[];
  onOpenDetail: (pet: Pet) => void;
}

export default function PetList({ pets, onOpenDetail }: Props) {
  return (
    <FlatList
      data={pets}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <PetCard pet={item} onOpenDetail={onOpenDetail} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16 },
});
