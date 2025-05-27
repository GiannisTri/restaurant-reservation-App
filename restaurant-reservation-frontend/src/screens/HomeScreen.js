import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { decodeJWT } from './utils.js';

export default function HomeScreen({ navigation }) {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminAndFetch = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const decoded = decodeJWT(token);
        if (decoded?.email === 'admin@admin.com' && decoded?.name === 'admin') {
          // if its admin, then it proceed to AdminScreen
          navigation.replace('AdminScreen');
          return;
        }

        
        const response = await axios.get('http://YourIp/api/restaurants', {  //put your ip here
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRestaurants(response.data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAdminAndFetch();
  }, []);
   // check the token
  const decodeJWT = (token) => {
    try {
      const payload = token.split('.')[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const decodedPayload = atob(base64);
      return JSON.parse(decodedPayload);
    } catch (e) {
      return null;
    }
  };

  const renderItem = ({ item }) => {
    const restaurantId = item.restaurant_id ?? Math.random().toString();
    // user interface
    return (
      <TouchableOpacity
        style={styles.restaurantCard}
        onPress={() =>
          navigation.navigate('Reservation', {
            restaurantId,
            restaurantName: item.name,
          })
        }
      >
        <Image
          source={
            item.image_url
              ? { uri: item.image_url }
              : require('../../assets/restaurant.png')
          }
          style={styles.image}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.restaurantName}>{item.name}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.location}>📍 {item.location}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Φόρτωση μαγαζιών...</Text>
      </View>
    );
  }

  if (restaurants.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Δεν βρέθηκαν μαγαζιά.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Διαθέσιμα Μαγαζιά</Text>
      <FlatList
        data={restaurants}
        keyExtractor={(item) => item.restaurant_id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}
 // styling css
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  restaurantCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 15,
  },
  restaurantName: { fontSize: 20, fontWeight: 'bold', marginBottom: 5 },
  description: { fontSize: 14, color: '#555', marginBottom: 8 },
  location: { fontSize: 14, color: '#333' },
});