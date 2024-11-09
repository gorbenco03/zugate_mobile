// src/screens/SubjectDetailScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

type SubjectDetailScreenRouteProp = RouteProp<RootStackParamList, 'SubjectDetail'>;
type SubjectDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SubjectDetail'>;

type Props = {
  route: SubjectDetailScreenRouteProp;
  navigation: SubjectDetailScreenNavigationProp;
};

type UsefulLink = {
  id: string;
  title: string;
  url: string;
};

// Exemplu de date pentru link-uri utile
const usefulLinks: UsefulLink[] = [
  { id: '1', title: 'Materiale de studiu', url: 'https://example.com/materiale' },
  { id: '2', title: 'Resurse suplimentare', url: 'https://example.com/resurse' },
];

const SubjectDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { subjectId, subjectName } = route.params; // Asigură-te că 'grade' este transmis în parametri
  const [isPresent, setIsPresent] = useState<boolean>(false); // Stare pentru prezență

  const handleOpenLink = (url: string) => {
    Linking.openURL(url);
  };

  const handleMarkAttendance = () => {
    // Aici poți adăuga logica pentru a marca prezența, cum ar fi o cerere către un API
    // Deocamdată, vom simula acest lucru cu un Alert
    Alert.alert(
      isPresent ? 'Prezența Retrasă' : 'Prezență Marcată',
      isPresent
        ? 'Ai retras marca de prezență.'
        : 'Prezența ta la lecție a fost marcată cu succes.',
      [
        {
          text: 'OK',
          onPress: () => setIsPresent(!isPresent),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{subjectName}</Text>

      {/* Secțiunea de Calificativ */}
      <View style={styles.gradeContainer}>
        <Icon name="school" size={30} color="#fff" />
        <Text style={styles.gradeText}>Calificativ: foarte bine</Text>
      </View>

      {/* Secțiunea de Acțiuni */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.squareButton, styles.quizButton]}
          onPress={() => navigation.navigate('Quiz', { subjectId, subjectName })}
        >
          <Icon name="book-open-page-variant" size={40} color="#fff" />
          <Text style={styles.buttonText}>Daily Quiz</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.squareButton, styles.feedbackButton]}
          onPress={() => navigation.navigate('Feedback', { subjectId, subjectName })}
        >
          <Icon name="comment-text" size={40} color="#fff" />
          <Text style={styles.buttonText}>Feedback</Text>
        </TouchableOpacity>

        {/* Butonul de Prezență */}
        <TouchableOpacity
          style={[styles.squareButton, styles.attendanceButton]}
          onPress={handleMarkAttendance}
        >
          <Icon name={isPresent ? "check-circle" : "checkbox-blank-circle-outline"} size={40} color="#fff" />
          <Text style={styles.buttonText}>{isPresent ? 'Prezență Retrasă' : 'Marchează Prezența'}</Text>
        </TouchableOpacity>
      </View>

      {/* Link-uri Utile */}
      <Text style={styles.sectionTitle}>Link-uri Utile</Text>
      <View style={styles.linksContainer}>
        {usefulLinks.map((link) => (
          <TouchableOpacity
            key={link.id}
            style={[styles.linkButton, styles.usefulLinkButton]}
            onPress={() => handleOpenLink(link.url)}
          >
            <Icon name="link" size={24} color="#fff" />
            <Text style={styles.linkText}>{link.title}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default SubjectDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f7f7', // Fundal neutru modern
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
    textAlign: 'center',
  },
  gradeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 204, 113, 0.8)', // Verde transparent
    padding: 15,
    borderRadius: 20,
    marginBottom: 20,
    justifyContent: 'center',
  },
  gradeText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 10,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Permite ca butoanele să se înfășoare pe mai multe rânduri
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  squareButton: {
    width: '48%', // Ajustează lățimea pentru a permite înfășurarea
    aspectRatio: 1,
    borderRadius: 20, // Formă pătrată
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10, // Spațiu între rânduri
    // Adăugarea umbrei pentru adâncime
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Pentru umbre pe Android
  },
  quizButton: {
    backgroundColor: 'rgba(155, 89, 182, 0.8)', // Violet modern cu transparență
  },
  feedbackButton: {
    backgroundColor: 'rgba(26, 188, 156, 0.8)', // Teal modern cu transparență
  },
  attendanceButton: {
    backgroundColor: 'rgba(241, 196, 15, 0.8)', // Galben modern cu transparență
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
    marginTop: 10,
  },
  linksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  linkButton: {
    width: '48%',
    marginBottom: 10,
    borderRadius: 20, // Formă pătrată
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(230, 126, 34, 0.8)', // Portocaliu modern cu transparență
    // Adăugarea umbrei pentru adâncime
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Pentru umbre pe Android
  },
  usefulLinkButton: {
    backgroundColor: 'rgba(230, 126, 34, 0.8)', // Portocaliu modern cu transparență
  },
  linkText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,
  },
});