import React, { useState } from 'react';
import { View, Button, Platform, StyleSheet, Text } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

type Props = {
  date: Date;
  onChange: (date: Date) => void;
};

export default function DateTimePickerInput({ date, onChange }: Props) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      const newDate = new Date(date);
      // Solo cambio fecha manteniendo hora actual
      newDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      onChange(newDate);
    }
  };

  const onChangeTime = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      const newDate = new Date(date);
      // Solo cambio hora y minutos manteniendo fecha actual
      newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      onChange(newDate);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Fecha seleccionada: {date.toLocaleDateString()}</Text>
      <Button title="Seleccionar Fecha" onPress={() => setShowDatePicker(true)} />

      <Text>Hora seleccionada: {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
      <Button title="Seleccionar Hora" onPress={() => setShowTimePicker(true)} />

      {showDatePicker && (
        <DateTimePicker value={date} mode="date" display="default" onChange={onChangeDate} />
      )}

      {showTimePicker && (
        <DateTimePicker value={date} mode="time" display="default" onChange={onChangeTime} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 10 },
});
