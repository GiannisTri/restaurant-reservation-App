import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
  ActivityIndicator,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// reservation screen
export default function ReservationScreen({ route, navigation }) {
  const { restaurantId, restaurantName } = route.params || {};

  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [time, setTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [peopleCount, setPeopleCount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReservation = async () => {
    if (!peopleCount) {
      Alert.alert('Προσοχή', 'Παρακαλώ συμπληρώστε αριθμό ατόμων.');
      return;
    }

    setLoading(true);
    // check token to find user
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Σφάλμα', 'Δεν υπάρχει ενεργός χρήστης.');
        setLoading(false);
        return;
      }

      const response = await axios.post(
        'http://YourIp/api/reservations',  // //put your ip here
        {
          restaurant_id: restaurantId,  
          date: date.toISOString().split('T')[0],
          time: time.toTimeString().slice(0, 5),
          people_count: parseInt(peopleCount, 10),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
       // loading for finishinf reservation
      setLoading(false);
      Alert.alert('Επιτυχία', 'Η κράτηση καταχωρήθηκε επιτυχώς!');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Reservation error:', error.response?.data || error.message);
      setLoading(false);
      Alert.alert('Σφάλμα', 'Απέτυχε η καταχώρηση της κράτησης.');
    }
  };
   // user interface
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Κράτηση στο {restaurantName}</Text>

      <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text>Ημερομηνία: {date.toLocaleDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) setDate(selectedDate);
          }}
        />
      )}

      <TouchableOpacity style={styles.input} onPress={() => setShowTimePicker(true)}>
        <Text>
          Ώρα:{' '}
          {time.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          minuteInterval={15}
          onChange={(event, selectedTime) => {
            setShowTimePicker(false);
            if (selectedTime) setTime(selectedTime);
          }}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Αριθμός Ατόμων"
        value={peopleCount}
        onChangeText={setPeopleCount}
        keyboardType="number-pad"
      />

      {loading ? (
        <ActivityIndicator size="large" color="#28a745" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleReservation}>
          <Text style={styles.buttonText}>Κράτηση</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
// Styling with css
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    textAlign: 'center',
  },
});