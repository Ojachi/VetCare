import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import UserDetailContent from '../../components/admin/UserDetailContent';
import UserList from '../../components/admin/UserList';
import DetailModal from '../../components/ui/DetailModal';

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  address: string;
  phone: string;
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await axiosClient.get<User[]>('/api/admin/users');
      setUsers(response.data);
    } catch {
      Alert.alert('Error', 'No se pudieron cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (userId: number, newRole: string) => {
    try {
      await axiosClient.put(`/api/admin/users/role`, { id: userId, newRole });
      const updatedUsers = users.map((u) => (u.id === userId ? { ...u, role: newRole } : u));
      setUsers(updatedUsers);
      Alert.alert('Éxito', 'Rol actualizado');
    } catch {
      Alert.alert('Error', 'No se pudo actualizar el rol');
    }
  };

  const updateUser = async (id: number, data: Partial<User>) => {
    try {
      await axiosClient.put(`/api/users/${id}`, data); // asume endpoint RESTful
      setUsers(users.map(u => u.id === id ? { ...u, ...data } : u));
      Alert.alert('Éxito', 'Usuario actualizado');
      // opcional: actualizar `selectedUser` si está activo
      setSelectedUser(prev => prev && prev.id === id ? { ...prev, ...data } : prev);
    } catch {
      Alert.alert('Error', 'No se pudo editar el usuario');
    }
  };

  const openModal = (user: User) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#333" />
      </View>
    );
  }

  return (
    <>
      <UserList
        users={users}
        onShowDetail={openModal}
      />
      <DetailModal visible={modalVisible} onClose={closeModal}>
        {selectedUser ? <UserDetailContent user={selectedUser} onChangeRole={updateRole} onUpdateUser={updateUser}/> : null}
      </DetailModal>
    </>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
