import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
   // register
  const handleRegister = async () => {
  if (!name || !email || !password) {
    Alert.alert('Προσοχή', 'Παρακαλώ συμπληρώστε όλα τα πεδία.');
    return;
  }
  setLoading(true);
  try {
    console.log('Sending register request...');
    const response = await axios.post('http://YourIp/api/auth/register', { //put your ip here
      name,
      email,
      password,
    });
    console.log('Register response:', response.data); // error logs
    Alert.alert('Επιτυχής εγγραφή', 'Τώρα μπορείτε να συνδεθείτε!');
    navigation.navigate('Login');
  } catch (error) {
    console.log('Register error:', error.response || error.message || error);
    Alert.alert('Σφάλμα', error.response?.data?.message || 'Κάτι πήγε λάθος.');
  } finally {
    setLoading(false);
  }
};
  // User Interface
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Εγγραφή</Text>

      <TextInput
        style={styles.input}
        placeholder="Όνομα"
        value={name}
        onChangeText={setName}
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Κωδικός"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
      />

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Επεξεργασία...</Text>
        </View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Εγγραφή</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Έχετε ήδη λογαριασμό; Συνδεθείτε</Text>
      </TouchableOpacity>
    </View>
  );
}
// css Styling
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', justifyContent: 'center', paddingHorizontal: 30 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
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
    backgroundColor: '#41784a',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: { color: '#fff', fontSize: 17, textAlign: 'center' },
  link: { color: '#007AFF', textAlign: 'center', marginTop: 10 },
  loadingContainer: { marginVertical: 20, alignItems: 'center' },
  loadingText: { marginTop: 10, color: '#007AFF', fontSize: 16 },
});