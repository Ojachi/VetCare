import { Picker } from '@react-native-picker/picker';
import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from 'react-native';
import axiosClient from '../../api/axiosClient';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import colors from '../../styles/colors';
import typography from '../../styles/typography';

export default function EmployeeRegisterPet() {
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('');
  const [age, setAge] = useState('');
  const [breed, setBreed] = useState('');
  const [weight, setWeight] = useState('');
  const [sex, setSex] = useState('');
  const [ownerId, setOwnerId] = useState<string>('');
  const [owners, setOwners] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOwners = async () => {
      try {
        const res = await axiosClient.get('/api/users');
        setOwners((res.data || []).filter((u: any) => u.role === 'OWNER'));
      } catch (err) {
        console.error(err);
      }
    };
    fetchOwners();
  }, []);

  const onRegisterPet = async () => {
    if (!name || !species || !age || !breed || !weight || !sex || !ownerId) {
      Alert.alert('Error', 'Por favor llena todos los campos');
      return;
    }

    setLoading(true);
    try {
      const petData = { name, species, breed, age, weight, sex, ownerId };
      await axiosClient.post('/api/pets', petData);
      Alert.alert('Éxito', `Mascota ${name} registrada`);
      setName(''); setSpecies(''); setAge(''); setBreed(''); setWeight(''); setSex(''); setOwnerId('');
    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar la mascota');
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <Card>
        <Text style={typography.h3}>Registrar Mascota (Empleado)</Text>
        <Input placeholder="Nombre" value={name} onChangeText={setName} />
        <Input placeholder="Especie" value={species} onChangeText={setSpecies} />
        <Input placeholder="Raza" value={breed} onChangeText={setBreed} />
        <Input placeholder="Género" value={sex} onChangeText={setSex} />
        <Input placeholder="Peso" value={weight} onChangeText={setWeight} keyboardType="numeric" />
        <Input placeholder="Edad" value={age} onChangeText={setAge} keyboardType="numeric" />

        <Text style={[typography.subtitle, { marginTop: 12 }]}>Propietario</Text>
        <View style={styles.pickerWrap}>
          <Picker selectedValue={ownerId} onValueChange={(v) => setOwnerId(String(v))}>
            <Picker.Item label="Selecciona propietario" value={''} />
            {owners.map((o) => <Picker.Item key={o.id} label={o.name} value={String(o.id)} />)}
          </Picker>
        </View>

        <Button title={loading ? 'Registrando...' : 'Registrar'} onPress={onRegisterPet} disabled={loading} />
      </Card>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 16 },
  pickerWrap: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, marginTop: 8, overflow: 'hidden' },
});
