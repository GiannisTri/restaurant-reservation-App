import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator, Modal, TextInput, StyleSheet
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
 // token checker
function decodeJWT(token) {
  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decodedPayload = atob(base64);
    return JSON.parse(decodedPayload);
  } catch (e) {
    console.error("Invalid token", e);
    return null;
  }
}
 // profile screen items
export default function ProfileScreen() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editPeople, setEditPeople] = useState('');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) return;

        const decoded = decodeJWT(token);
        setUserName(decoded?.name || 'Χρήστης');

        const response = await axios.get('http://YourIp/api/reservations/user', { //put your ip here
          headers: { Authorization: `Bearer ${token}` },
        });
        setReservations(response.data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
        Alert.alert("Σφάλμα", "Απέτυχε η φόρτωση των κρατήσεων.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);
   // cancel reservation
  const cancelReservation = (id) => {
    Alert.alert('Επιβεβαίωση', 'Θέλετε σίγουρα να ακυρώσετε την κράτηση;', [
      { text: 'Όχι', style: 'cancel' },
      {
        text: 'Ναι',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('token');
            await axios.delete(`http://YourIp/api/reservations/${id}`, {  //put your ip here
              headers: { Authorization: `Bearer ${token}` },
            });
            setReservations(prev => prev.filter(r => r.reservation_id !== id));
          } catch (error) {
            Alert.alert('Σφάλμα', 'Η ακύρωση απέτυχε.');
          }
        },
      },
    ]);
  };
   //updaate resarvation
  const openEditModal = (reservation) => {
    setSelectedReservation(reservation);
    setEditDate(reservation.date.split('T')[0]); 
    setEditTime(reservation.time);
    setEditPeople(String(reservation.people_count));
    setModalVisible(true);
  };

  const handleUpdate = async () => {
    if (!selectedReservation) return;

    const payload = {
      date: editDate,
      time: editTime,
      people_count: parseInt(editPeople),
    };

    console.log('Sending update:', payload); // Debug log

    try {
      const token = await AsyncStorage.getItem('token');
      await axios.put(
        `http://YourIp/api/reservations/${selectedReservation.reservation_id}`,  //put your ip here
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      // save reservation
      setReservations(prev =>
        prev.map(r =>
          r.reservation_id === selectedReservation.reservation_id
            ? { ...r, ...payload }
            : r
        )
      );
      setModalVisible(false);
    } catch (error) {
      console.log('Error saving reservation:', error.response ? error.response.data : error.message);
      Alert.alert('Σφάλμα', 'Η ενημέρωση απέτυχε.');
    }
  };

  if (loading) return <ActivityIndicator size="large" />;
   // User Interface
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 10 }}>
        Καλώς ήρθες, {userName}!
      </Text>
      <Text style={{ fontSize: 18, marginBottom: 15 }}>Οι κρατήσεις σου:</Text>

      {reservations.length === 0 ? (
        <Text>Δεν υπάρχουν κρατήσεις.</Text>
      ) : (
        <FlatList
          data={reservations}
          keyExtractor={item => item.reservation_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text>Εστιατόριο: {item.restaurant_name}</Text>
              <Text>Ημερομηνία: {item.date}</Text>
              <Text>Ώρα: {item.time}</Text>
              <Text>Άτομα: {item.people_count}</Text>

              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <TouchableOpacity
                  onPress={() => openEditModal(item)}
                  style={[styles.button, { backgroundColor: '#3498db' }]}
                >
                  <Text style={styles.buttonText}>Επεξεργασία</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => cancelReservation(item.reservation_id)}
                  style={[styles.button, { backgroundColor: '#e74c3c', marginLeft: 10 }]}
                >
                  <Text style={styles.buttonText}>Ακύρωση</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Edit Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 18, marginBottom: 10 }}>Επεξεργασία Κράτησης</Text>

            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
              <Text>{editDate || 'Επιλογή ημερομηνίας'}</Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={editDate ? new Date(editDate) : new Date()}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    const isoDate = selectedDate.toISOString().split('T')[0];
                    setEditDate(isoDate);
                  }
                }}
              />
            )}

            <TouchableOpacity onPress={() => setShowTimePicker(true)} style={styles.input}>
              <Text>{editTime || 'Επιλογή ώρας'}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={editTime ? new Date(`2000-01-01T${editTime}`) : new Date()}
                mode="time"
                display="default"
                onChange={(event, selectedTime) => {
                  setShowTimePicker(false);
                  if (selectedTime) {
                    const hours = selectedTime.getHours().toString().padStart(2, '0');
                    const minutes = selectedTime.getMinutes().toString().padStart(2, '0');
                    setEditTime(`${hours}:${minutes}`);
                  }
                }}
              />
            )}

            <TextInput
              placeholder="Άτομα"
              value={editPeople}
              onChangeText={setEditPeople}
              style={styles.input}
              keyboardType="numeric"
            />

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.button, { backgroundColor: '#999' }]}>
                <Text style={styles.buttonText}>Άκυρο</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleUpdate} style={[styles.button, { backgroundColor: '#2ecc71', marginLeft: 10 }]}>
                <Text style={styles.buttonText}>Αποθήκευση</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
// styling with css
const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ddd',
    backgroundColor: '#fdfdfd',
  },
  button: {
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    elevation: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});