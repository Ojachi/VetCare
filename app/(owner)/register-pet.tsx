import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TouchableOpacity } from 'react-native';
import axiosClient from '../../api/axiosClient';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import { alertApiError } from '../../utils/apiError';

export default function RegisterPet() {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [age, setAge] = useState('');
  const [breed, setBreed] = useState('');
  const [weight, setWeight] = useState('');
  const [sex, setSex] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onRegisterPet = async () => {
    if (!name || !species || !age || !breed || !weight || !sex ) {
      Alert.alert('Error', 'Por favor llena todos los campos');
      return;
    }

    setLoading(true);

    const petData = {
      name,
      species,
      breed,
      age,
      weight,
      sex,
    };

    try {
      // const data = 
      await axiosClient.post('/api/pets', petData  , { headers: { 'Content-Type': 'application/json' } });
      Alert.alert('Éxito', `Mascota ${name} registrada`);
      // if (data) {
      //   setName('');
      //   setSpecies('');
      //   setAge('');
      //   setBreed('');
      //   setWeight('');
      //   setSex('');
      // }
    } catch (error) {
      alertApiError(error, 'No se pudo registrar la mascota');
      console.log('Error registering pet:', error);
      
    } finally {
      setLoading(false);
      
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <Card>
        <Text style={[typography.h2, { textAlign: 'center', marginBottom: 12 }]}>Registrar Mascota</Text>
        <Input placeholder="Nombre" value={name} onChangeText={setName} style={styles.input} />
        <Input placeholder="Especie" value={species} onChangeText={setSpecies} style={styles.input} />
        <Input placeholder="Raza" value={breed} onChangeText={setBreed} style={styles.input} />
        <Input placeholder="Género" value={sex} onChangeText={setSex} style={styles.input} />
        <Input placeholder="Peso" value={weight} onChangeText={setWeight} keyboardType="numeric" style={styles.input} />
        <Input placeholder="Edad" value={age} onChangeText={setAge} keyboardType="numeric" style={styles.input} />

        <Button title={loading ? 'Registrando...' : 'Registrar'} onPress={onRegisterPet} disabled={loading} />

        <TouchableOpacity onPress={() => router.push('/(owner)/view-pets' as any)}>
          <Text style={styles.link}>Ver mis mascotas</Text>
        </TouchableOpacity>
      </Card>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16, justifyContent: 'center' },
  input: {
    marginBottom: 12,
  },
  link: {
    marginTop: 15,
    color: colors.secondary,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});
