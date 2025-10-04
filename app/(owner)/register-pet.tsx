import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import globalStyles from '../../styles/globalStyles';
import axiosClient from '../../api/axiosClient';
import { useRouter } from 'expo-router';

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
      Alert.alert('Error', 'No se pudo registrar la mascota');
      console.log('Error registering pet:', error);
      
    } finally {
      setLoading(false);
      
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={globalStyles.container}>
      <Text style={globalStyles.title}>Registrar Mascota</Text>
      <Input placeholder="Nombre" value={name} onChangeText={setName} style={styles.input} />
      <Input placeholder="Especie" value={species} onChangeText={setSpecies} style={styles.input} />
      <Input placeholder="Raza" value={breed} onChangeText={setBreed} style={styles.input} />
      <Input placeholder="Género" value={sex} onChangeText={setSex} style={styles.input} />
      <Input placeholder="Peso" value={weight} onChangeText={setWeight} keyboardType="numeric" style={styles.input} />
      <Input placeholder="Edad" value={age} onChangeText={setAge} keyboardType="numeric" style={styles.input} />

      <Button title={loading ? 'Registrando...' : 'Registrar'} onPress={onRegisterPet} disabled={loading} />

      <TouchableOpacity onPress={() => router.push('/(tabs)/view-pets')}>
        <Text style={styles.link}>Ver mis mascotas</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  input: {
    marginBottom: 12,
  },
  link: {
    marginTop: 15,
    color: 'blue',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
});
