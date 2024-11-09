// src/screens/LoginScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import { RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_URL from '../api/apiConfig';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
  route: LoginScreenRouteProp;
};

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState(''); // Modificat din 'username' în 'email'
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Eroare', 'Te rugăm să completezi toate câmpurile');
      return;
    }

    setLoading(true);

    try {
      console.log('Trimitem cererea de autentificare...');

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Statusul răspunsului:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Eroare la autentificare:', errorData);
        Alert.alert('Eroare', errorData.message || 'Email sau parolă incorectă');
        return;
      }

      const data = await response.json();
      const { token } = data;

      console.log('Token primit:', token);

      // Salvăm token-ul în AsyncStorage
      await AsyncStorage.setItem('token', token);

      // Navigăm către ecranul principal
      navigation.replace('MainTabs');
    } catch (error) {
      console.error('Eroare la cererea de autentificare:', error);
      Alert.alert('Eroare', 'A apărut o eroare la conectarea cu serverul. Verifică conexiunea la internet.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Autentificare</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Parolă"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.buttonText}>Intră</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

// Stilurile rămân neschimbate

// (stilurile rămân neschimbate)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffffff'
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center'
  },
  input: {
    height: 50,
    borderColor: '#3498db',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 15
  },
  button: {
    backgroundColor: '#3498db',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center'
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold'
  }
});