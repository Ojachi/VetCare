import React, { useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet, TouchableOpacity, Alert } from 'react-native';

type Appointment = {
    id: string;
    petName: string;
    ownerName: string;
    date: string;
    time: string;
    status: 'pending' | 'confirmed' | 'cancelled';
};

const initialAppointments: Appointment[] = [
    {
        id: '1',
        petName: 'Max',
        ownerName: 'Juan Perez',
        date: '2024-06-15',
        time: '10:00',
        status: 'pending',
    },
    {
        id: '2',
        petName: 'Luna',
        ownerName: 'Maria Gomez',
        date: '2024-06-16',
        time: '12:30',
        status: 'confirmed',
    },
];

export default function AdminAppointmentsScreen() {
    const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

    const handleConfirm = (id: string) => {
        setAppointments(prev =>
            prev.map(app =>
                app.id === id ? { ...app, status: 'confirmed' } : app
            )
        );
    };

    const handleCancel = (id: string) => {
        Alert.alert(
            'Cancelar cita',
            '¿Estás seguro de cancelar esta cita?',
            [
                { text: 'No' },
                {
                    text: 'Sí',
                    onPress: () =>
                        setAppointments(prev =>
                            prev.map(app =>
                                app.id === id ? { ...app, status: 'cancelled' } : app
                            )
                        ),
                },
            ]
        );
    };

    const renderItem = ({ item }: { item: Appointment }) => (
        <View style={styles.card}>
            <Text style={styles.title}>{item.petName} - {item.ownerName}</Text>
            <Text>Fecha: {item.date} - Hora: {item.time}</Text>
            <Text>Estado: {item.status}</Text>
            <View style={styles.actions}>
                {item.status === 'pending' && (
                    <Button title="Confirmar" onPress={() => handleConfirm(item.id)} />
                )}
                {item.status !== 'cancelled' && (
                    <Button title="Cancelar" color="red" onPress={() => handleCancel(item.id)} />
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Gestión de Citas</Text>
            <FlatList
                data={appointments}
                keyExtractor={item => item.id}
                renderItem={renderItem}
                ListEmptyComponent={<Text>No hay citas registradas.</Text>}
            />
            <TouchableOpacity style={styles.addButton} onPress={() => Alert.alert('Funcionalidad para agregar cita')}>
                <Text style={styles.addButtonText}>+ Nueva Cita</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: '#fff' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
    card: { backgroundColor: '#f9f9f9', padding: 16, borderRadius: 8, marginBottom: 12 },
    title: { fontSize: 18, fontWeight: 'bold' },
    actions: { flexDirection: 'row', marginTop: 8, gap: 8 },
    addButton: {
        backgroundColor: '#007bff',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});