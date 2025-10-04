import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Diagnostic = {
    id: string;
    appointmentId: string;
    diagnosis: string;
    notes?: string;
    date: string;
};

type Props = {
    diagnostic: Diagnostic;
};

const ViewDiagnostics: React.FC<Props> = ({ diagnostic }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Diagnostic Details</Text>
            <Text style={styles.label}>Diagnosis:</Text>
            <Text style={styles.value}>{diagnostic.diagnosis}</Text>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>{diagnostic.date}</Text>
            {diagnostic.notes ? (
                <>
                    <Text style={styles.label}>Notes:</Text>
                    <Text style={styles.value}>{diagnostic.notes}</Text>
                </>
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
        flex: 1,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 8,
    },
    value: {
        fontSize: 16,
        marginBottom: 4,
    },
});

export default ViewDiagnostics;