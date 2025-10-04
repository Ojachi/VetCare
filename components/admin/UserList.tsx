import React from 'react';
import { FlatList, StyleSheet } from 'react-native';
import UserCard from './UserCard';

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  address: string;
  phone: string;
};

type Props = {
  users: User[];
  onShowDetail: (user: User) => void;
};

export default function UserList({ users, onShowDetail }: Props) {
  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <UserCard user={item} onShowDetail={onShowDetail} />
      )}
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: 16 },
});
