import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true); // loading animation
    try {
      const response = await axios.post('http://YourIp/api/auth/login', {  //put your ip here
        email,
        password,
      });

      const token = response.data.token;
      await AsyncStorage.setItem('token', token);

      Alert.alert('Επιτυχής σύνδεση', 'Καλωσήρθες!');
      navigation.navigate('Home');
    } catch (error) {
      console.error(error);
      Alert.alert('Σφάλμα Σύνδεσης', 'Λάθος email ή κωδικός.');
    } finally {
      setLoading(false); 
    }
  };
  // User Interface
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Σύνδεση</Text>

      <TextInput
        style={styles.input}
        placeholder="Email "
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Κωδικός"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Σύνδεση</Text>
        )}
      </TouchableOpacity>

     <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Κάντε Εγγραφή</Text>
     </TouchableOpacity>
    </View>
  );
}
// styling with css
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    textAlign: 'center',
  },
  link: {
    color: '#007AFF',
    textAlign: 'center',
    marginTop: 10,
  },
});