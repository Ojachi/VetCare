import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import Button from './Button';

type Props = {
  date: Date;
  onChange: (date: Date) => void;
  onlyDate?: boolean; // si true, oculta selección de hora
};

export default function DateTimePickerInput({ date, onChange, onlyDate = false }: Props) {
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
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={typography.caption}>Fecha</Text>
          <Text style={[typography.body, { color: colors.darkGray }]}>
            {date.toLocaleDateString()}
          </Text>
        </View>
        <Button
          title="Elegir fecha"
          onPress={() => setShowDatePicker(true)}
          style={styles.smallBtnSecondary}
          textStyle={{ fontSize: 14 }}
        />
      </View>
      {!onlyDate && (
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={typography.caption}>Hora</Text>
            <Text style={[typography.body, { color: colors.darkGray }]}>
              {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
          <Button
            title="Elegir hora"
            onPress={() => setShowTimePicker(true)}
            style={styles.smallBtnSecondary}
            textStyle={{ fontSize: 14 }}
          />
        </View>
      )}

      {showDatePicker && (
        <DateTimePicker value={date} mode="date" display="default" onChange={onChangeDate} />
      )}

      {!onlyDate && showTimePicker && (
        <DateTimePicker value={date} mode="time" display="default" onChange={onChangeTime} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 10 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 4 },
  smallBtn: { paddingVertical: 10, paddingHorizontal: 12, minWidth: 120 },
  smallBtnSecondary: { paddingVertical: 10, paddingHorizontal: 12, minWidth: 120, backgroundColor: colors.secondary },
});
