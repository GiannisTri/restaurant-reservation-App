import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, TextInput, Modal } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
// admin screen
export default function AdminScreen() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editRestaurant, setEditRestaurant] = useState(null);
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchRestaurants();
  }, []);
  // getting the restaurants
  const fetchRestaurants = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get('http://YourIp/api/restaurants', { //put your ip here
        headers: { Authorization: `Bearer ${token}` },
      });
      setRestaurants(response.data);
    } catch (error) {
      Alert.alert('Σφάλμα', 'Απέτυχε η φόρτωση των μαγαζιών');
    } finally {
      setLoading(false);
    }
  };
   // add new restaurants
  const openAddModal = () => {
    setEditRestaurant(null);
    setName('');
    setLocation('');
    setDescription('');
    setModalVisible(true);
  };
   // edit restaurants
  const openEditModal = (restaurant) => {
    setEditRestaurant(restaurant);
    setName(restaurant.name);
    setLocation(restaurant.location);
    setDescription(restaurant.description);
    setModalVisible(true);
  };
   // save to database
  const handleSave = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (editRestaurant) {
        console.log('Updating restaurant with id:', editRestaurant.restaurant_id);
        await axios.put(
          `http://YourIp/api/restaurants/${editRestaurant.restaurant_id}`,  //put your ip here
          { name, location, description },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        console.log('Creating new restaurant');
        await axios.post(
          `http://YourIp/api/restaurants`,  //put your ip here
          { name, location, description },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      fetchRestaurants();
      setModalVisible(false);
    } catch (error) {
      console.log('Error saving restaurant:', error.response ? error.response.data : error.message);
      Alert.alert('Σφάλμα', 'Απέτυχε η αποθήκευση.');
    }
  };
  // delete
  const handleDelete = (id) => {
    Alert.alert(
      'Επιβεβαίωση',
      'Θέλετε σίγουρα να διαγράψετε το μαγαζί;',
      [
        { text: 'Άκυρο', style: 'cancel' },
        {
          text: 'Διαγραφή',
          style: 'destructive',
          onPress: async () => {
            try {
              const token = await AsyncStorage.getItem('token');
              console.log('Deleting restaurant with id:', id);
              await axios.delete(`http://YourIp/api/restaurants/${id}`, {  //put your ip here
                headers: { Authorization: `Bearer ${token}` },
              });
              fetchRestaurants();
            } catch (error) {
              console.log('Error deleting restaurant:', error.response ? error.response.data : error.message);
              Alert.alert('Σφάλμα', 'Η διαγραφή απέτυχε.');
            }
          },
        },
      ]
    );
  };
   // User Interface
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 15 }}>Διαχείριση Μαγαζιών</Text>
      <TouchableOpacity
        onPress={openAddModal}
        style={{ backgroundColor: '#2ecc71', padding: 10, borderRadius: 8, marginBottom: 15 }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>Προσθήκη Μαγαζιού</Text>
      </TouchableOpacity>

      {loading ? (
        <Text>Φόρτωση...</Text>
      ) : (
        <FlatList
          data={restaurants}
          keyExtractor={(item) => item.restaurant_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.restaurantCard}>
              <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{item.name}</Text>
              <Text>{item.location}</Text>
              <Text>{item.description}</Text>
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <TouchableOpacity
                  onPress={() => openEditModal(item)}
                  style={[styles.button, { backgroundColor: '#3498db' }]}
                >
                  <Text style={{ color: 'white' }}>Επεξεργασία</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(item.restaurant_id)}
                  style={[styles.button, { backgroundColor: '#e74c3c', marginLeft: 10 }]}
                >
                  <Text style={{ color: 'white' }}>Διαγραφή</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 10 }}>
              {editRestaurant ? 'Επεξεργασία Μαγαζιού' : 'Προσθήκη Μαγαζιού'}
            </Text>

            <TextInput
              placeholder="Όνομα"
              value={name}
              onChangeText={setName}
              style={styles.input}
            />
            <TextInput
              placeholder="Τοποθεσία"
              value={location}
              onChangeText={setLocation}
              style={styles.input}
            />
            <TextInput
              placeholder="Περιγραφή"
              value={description}
              onChangeText={setDescription}
              style={styles.input}
              multiline
            />

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={[styles.button, { backgroundColor: '#999' }]}>
                <Text style={{ color: 'white' }}>Άκυρο</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={[styles.button, { backgroundColor: '#2ecc71', marginLeft: 10 }]}>
                <Text style={{ color: 'white' }}>Αποθήκευση</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
 // Styling css
const styles = StyleSheet.create({
  restaurantCard: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    elevation: 1,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    minWidth: 90,
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    padding: 10,
    borderRadius: 6,
  },
});
