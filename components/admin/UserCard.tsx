import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  address: string;
  phone: string;
};

type Props = {
  user: User;
  onShowDetail: (user: User) => void;
};

export default function UserCard({ user, onShowDetail }: Props) {
  return (
    <TouchableOpacity style={styles.userCard} onPress={() => onShowDetail(user)}>
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.items}>{user.email}</Text>
      <Text style={styles.items}>{user.address}</Text>
      <Text style={styles.items}>{user.phone}</Text>
      <Text style={styles.items}>{user.role}</Text>
      
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  userCard: {
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
  items: {
    marginBottom: 5,
  },
  name: { fontWeight: 'bold', fontSize: 16 },
  picker: { height: 50, width: '100%', marginLeft: -9, marginTop: -15 },
});
