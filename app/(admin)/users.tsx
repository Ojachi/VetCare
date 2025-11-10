import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, View, Text } from 'react-native';
import axiosClient from '../../api/axiosClient';
import EditUserForm from '../../components/admin/EditUserForm';
import UserDetailContent from '../../components/admin/UserDetailContent';
import UserList from '../../components/admin/UserList';
import DetailModal from '../../components/ui/DetailModal';
import EmptyState from '../../components/ui/EmptyState';
import colors from '../../styles/colors';
import { alertApiError } from '../../utils/apiError';
import typography from '../../styles/typography';

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
  const [editModalVisible, setEditModalVisible] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await axiosClient.get<User[]>('/api/admin/users');
      setUsers(response.data);
    } catch (err) {
      alertApiError(err, 'No se pudieron cargar los usuarios');
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
    } catch (err) {
      alertApiError(err, 'No se pudo actualizar el rol');
    }
  };

  const updateUser = async (id: number, data: Partial<User>) => {
    try {
      await axiosClient.put(`/api/users/${id}`, data);
      setUsers(users.map(u => u.id === id ? { ...u, ...data } : u));
      setSelectedUser(prev => prev && prev.id === id ? { ...prev, ...data } : prev);
      Alert.alert('Éxito', 'Usuario actualizado');
      setEditModalVisible(false);
    } catch (err) {
      alertApiError(err, 'No se pudo editar el usuario');
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

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setEditModalVisible(true);
  };

  const closeEdit = () => {
    setEditModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[typography.h2, { paddingHorizontal: 16 }]}>Gestión de Usuarios</Text>
      {users.length === 0 ? (
        <EmptyState title="Sin usuarios" message="Aún no hay usuarios registrados." />
      ) : (
        <UserList users={users} onShowDetail={openModal} />
      )}
      <DetailModal visible={modalVisible} onClose={closeModal} extraFooterButton={{ title: 'Editar usuario', onPress: () => selectedUser && openEditModal(selectedUser), style: { backgroundColor: colors.secondary } }}>
        {selectedUser ? (
          <UserDetailContent
            user={selectedUser}
            onChangeRole={updateRole}
            onEditRequest={openEditModal}
          />
        ) : null}
      </DetailModal>
      <DetailModal visible={editModalVisible} onClose={closeEdit} showClose={false}>
        {selectedUser ? (
          <EditUserForm
            user={selectedUser}
            onSave={(data) => updateUser(selectedUser.id, data)}
            onCancel={closeEdit}
          />
        ) : null}
      </DetailModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
