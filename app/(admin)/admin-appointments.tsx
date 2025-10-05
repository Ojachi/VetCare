import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import AppointmentDetail from '../../components/admin/AppointmentDetail';
import AppointmentForm from '../../components/admin/AppointmentForm';
import DetailModal from '../../components/ui/DetailModal';

export default function AdminAppointmentsScreen() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMode, setModalMode] = useState<'form'|'detail'>('form');
    const [editing, setEditing] = useState<any | null>(null);
    const [detailAppointment, setDetailAppointment] = useState<any | null>(null);

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        setLoading(true);
        try {
            const res = await axiosClient.get<any[]>('/api/appointments');
            setAppointments(res.data);
        } catch {
            Alert.alert('Error', 'No se pudieron cargar las citas');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditing(null);
        setModalMode('form');
        setModalVisible(true);
    };

    const handleEdit = (item: any) => {
            // Fetch full appointment details before opening the form so fields are preloaded
            const id = item.id ?? item.appointment?.id;
            if (!id) {
                setEditing(item);
                setModalVisible(true);
                return;
            }

            (async () => {
                try {
                    const res = await axiosClient.get<any>(`/api/appointments/${id}`);
                    // AppointmentForm expects a prop shaped like { appointment: <appointment> , id: <id> }
                    setEditing({ id: res.data.id, appointment: res.data });
                    setModalMode('form');
                    setModalVisible(true);
                } catch {
                    Alert.alert('Error', 'No se pudieron cargar los detalles de la cita');
                }
            })();
    };

    const handleShowDetail = (item: any) => {
        const id = item.id ?? item.appointment?.id;
        if (!id) {
            setDetailAppointment(item.appointment ?? item);
            setModalMode('detail');
            setModalVisible(true);
            return;
        }
        (async () => {
            try {
                const res = await axiosClient.get<any>(`/api/appointments/${id}`);
                setDetailAppointment(res.data);
                setModalMode('detail');
                setModalVisible(true);
            } catch {
                Alert.alert('Error', 'No se pudieron cargar los detalles de la cita');
            }
        })();
    };

        const handleCancel = (id: number) => {
            Alert.alert('Cancelar cita', '¿Estás seguro de cancelar esta cita?', [
                { text: 'No' },
                {
                    text: 'Sí',
                    onPress: async () => {
                        try {
                            // Llamada al endpoint de cancelación proporcionado
                            await axiosClient.put(`/api/appointments/${id}/cancel`);
                            // refrescar lista
                            await loadAppointments();
                            Alert.alert('Éxito', 'Cita cancelada');
                        } catch {
                            Alert.alert('Error', 'No se pudo cancelar la cita');
                        }
                    },
                },
            ]);
        };

        const handleChangeStatus = async (id: number, status: string) => {
            try {
                await axiosClient.put(`/api/appointments/${id}/status`, { status });
                await loadAppointments();
                Alert.alert('Éxito', 'Estado actualizado');
            } catch {
                Alert.alert('Error', 'No se pudo actualizar el estado');
            }
        };

    const onSaved = (saved: any) => {
        // refrescar lista o actualizar localmente
        loadAppointments();
        setModalVisible(false);
    };

    const renderItem = ({ item }: { item: any }) => {
    const appointment = item.appointment ?? item;
        const petName = appointment?.pet?.name ?? 'N/A';
        const ownerName = appointment?.owner?.name ?? appointment?.pet?.owner?.name ?? 'N/A';
        const date = appointment?.startDateTime ?? appointment?.date ?? '';
    const status = appointment?.status ?? 'N/A';
    const statusNorm = String(status).toUpperCase();
    const nonEditable = ['CONFIRMED','CANCELLED','ACCEPTED'];

        return (
            <TouchableOpacity style={styles.card} onPress={() => handleShowDetail(item)}>
                <Text style={styles.title}>{petName} — {ownerName}</Text>
                <Text>{date}</Text>
                <Text>Estado: {status}</Text>
                {!nonEditable.includes(statusNorm) ? (
                    <View style={styles.row}>
                        <Button title="Editar" onPress={() => handleEdit(item)} />
                        <Button title="Cancelar" color="red" onPress={() => handleCancel(item.id ?? item.appointment?.id)} />
                        <Button title="Marcar como Confirmada" onPress={() => handleChangeStatus(item.id ?? item.appointment?.id, 'ACCEPTED')} />
                    </View>
                ) : null}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Gestión de Citas</Text>
            <TouchableOpacity style={styles.addButton} onPress={handleCreate}>
                <Text style={styles.addButtonText}>+ Nueva Cita</Text>
            </TouchableOpacity>

            <FlatList
                data={appointments}
                keyExtractor={(item) => (item.id ?? item.appointment?.id)?.toString() ?? Math.random().toString()}
                renderItem={renderItem}
                ListEmptyComponent={<Text>No hay citas registradas.</Text>}
                refreshing={loading}
                onRefresh={loadAppointments}
            />

                    <DetailModal visible={modalVisible} onClose={() => setModalVisible(false)}>
                        {modalMode === 'form' ? (
                            <AppointmentForm appointment={editing} onSaved={onSaved} onCancel={() => setModalVisible(false)} />
                        ) : (
                            <AppointmentDetail appointment={detailAppointment} />
                        )}
                    </DetailModal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
    card: { backgroundColor: '#f9f9f9', padding: 12, borderRadius: 8, marginBottom: 12 },
    title: { fontSize: 18, fontWeight: 'bold' },
    row: { flexDirection: 'row', gap: 8, marginTop: 8 },
    addButton: { backgroundColor: '#007bff', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
    addButtonText: { color: '#fff', fontWeight: 'bold' },
});