import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import MedicalRecordCard from './MedicalRecordCard';

export default function MedicalRecordList({ records, onPress }: { records: any[]; onPress: (r: any) => void }) {
  return (
    <FlatList
      data={records}
      keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => <MedicalRecordCard record={item} onPress={onPress} />}
    />
  );
}

const styles = StyleSheet.create({ list: { padding: 16 } });
