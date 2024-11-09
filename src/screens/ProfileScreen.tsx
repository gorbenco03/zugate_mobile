// src/screens/ProfileScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProfileScreen: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image 
        source={{ uri: 'https://example.com/profile-picture.png' }} 
        style={styles.profileImage} 
      />
      <Text style={styles.title}>Numele Tău</Text>

      <View style={styles.actionsContainer}>
        {/* Setări comune */}
        <TouchableOpacity style={[styles.squareButton, styles.quizButton]}>
          <Icon name="account-outline" size={24} color="#ffffff" />
          <Text style={styles.buttonText}>Profil</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.squareButton, styles.attendanceButton]}>
          <Icon name="bell-outline" size={24} color="#ffffff" />
          <Text style={styles.buttonText}>Notificări</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.squareButton, styles.feedbackButton]}>
          <Icon name="lock-outline" size={24} color="#ffffff" />
          <Text style={styles.buttonText}>Securitate</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.squareButton, styles.usefulLinkButton]}>
          <Icon name="palette-outline" size={24} color="#ffffff" />
          <Text style={styles.buttonText}>Tema aplicației</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.squareButton, styles.feedbackButton]}>
          <Icon name="help-circle-outline" size={24} color="#ffffff" />
          <Text style={styles.buttonText}>Ajutor</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.squareButton, styles.attendanceButton]}>
          <Icon name="information-outline" size={24} color="#ffffff" />
          <Text style={styles.buttonText}>Despre aplicație</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton}>
        <Icon name="logout" size={24} color="#ffffff" />
        <Text style={styles.logoutButtonText}>Deconectare</Text>
      </TouchableOpacity>
      </View>
      

      {/* Buton Logout pe toată lățimea ecranului */}
     
    </ScrollView>
    
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  squareButton: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quizButton: {
    backgroundColor: 'rgba(155, 89, 182, 0.8)',
  },
  attendanceButton: {
    backgroundColor: 'rgba(241, 196, 15, 0.8)',
  },
  feedbackButton: {
    backgroundColor: 'rgba(26, 188, 156, 0.8)',
  },
  usefulLinkButton: {
    backgroundColor: 'rgba(230, 126, 34, 0.8)',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 5,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    alignSelf: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    borderRadius: 20,
    marginTop: 30,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});