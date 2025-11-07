import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import AppointmentDetail from '../../components/admin/AppointmentDetail';
import AppointmentForm from '../../components/admin/AppointmentForm';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import DetailModal from '../../components/ui/DetailModal';
import EmptyState from '../../components/ui/EmptyState';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { alertApiError } from '../../utils/apiError';
import { formatDisplayDateTime } from '../../utils/date';

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
        } catch (err) {
            alertApiError(err, 'No se pudieron cargar las citas');
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
                } catch (err) {
                    alertApiError(err, 'No se pudieron cargar los detalles de la cita');
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
            } catch (err) {
                alertApiError(err, 'No se pudieron cargar los detalles de la cita');
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
                        } catch (err) {
                            alertApiError(err, 'No se pudo cancelar la cita');
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
            } catch (err) {
                alertApiError(err, 'No se pudo actualizar el estado');
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
            <TouchableOpacity activeOpacity={0.85} onPress={() => handleShowDetail(item)}>
                <Card>
                    <Text style={typography.h3}>{petName} — {ownerName}</Text>
                    <Text style={typography.subtitle}>{formatDisplayDateTime(date)}</Text>
                    <Text style={[typography.caption, { marginTop: 6 }]}>Estado: {status}</Text>
                    {!nonEditable.includes(statusNorm) ? (
                        <View style={styles.row}>
                            <Button
                                title="Editar"
                                onPress={() => handleEdit(item)}
                                style={{ backgroundColor: colors.secondary, flex: 1, marginRight: 8 }}
                            />
                            <Button
                                title="Cancelar"
                                onPress={() => handleCancel(item.id ?? item.appointment?.id)}
                                style={{ backgroundColor: colors.danger, flex: 1, marginRight: 8 }}
                            />
                            <Button
                                title="Marcar como Confirmada"
                                onPress={() => handleChangeStatus(item.id ?? item.appointment?.id, 'ACCEPTED')}
                                style={{ backgroundColor: colors.success, flex: 1 }}
                            />
                        </View>
                    ) : null}
                </Card>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={[typography.h2, { paddingHorizontal: 16, marginBottom: 8 }]}>Gestión de Citas</Text>
            <View style={{ paddingHorizontal: 16 }}>
                <Button title="+ Nueva Cita" onPress={handleCreate} />
            </View>

            {loading && appointments.length === 0 ? (
                <View style={styles.center}> 
                    <ActivityIndicator size="large" color={colors.primary} />
                </View>
            ) : (
                <FlatList
                    contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
                    data={appointments}
                    keyExtractor={(item) => (item.id ?? item.appointment?.id)?.toString() ?? Math.random().toString()}
                    renderItem={renderItem}
                    ListEmptyComponent={<EmptyState title="Sin citas" message="No hay citas registradas." />}
                    refreshing={loading}
                    onRefresh={loadAppointments}
                />
            )}

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
    container: { flex: 1, backgroundColor: colors.background, paddingTop: 12 },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    row: { flexDirection: 'row', alignItems: 'center', marginTop: 12 },
});