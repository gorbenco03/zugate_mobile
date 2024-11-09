// src/screens/SubjectDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Linking, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_URL from '../api/apiConfig';
import moment from 'moment';
import 'moment/locale/ro';

moment.locale('ro');

type SubjectDetailScreenRouteProp = RouteProp<RootStackParamList, 'SubjectDetail'>;
type SubjectDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'SubjectDetail'>;

type Props = {
  route: SubjectDetailScreenRouteProp;
  navigation: SubjectDetailScreenNavigationProp;
};

type LessonDetail = {
  usefulLinks: boolean;
  _id: string;
  title: string;
  date: string;
  time: string;
  description?: string;
  teacher: {
    _id: string;
    name: string;
  };
  // Adaugă alte câmpuri dacă este necesar
};

const SubjectDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { subjectId, subjectName } = route.params;
  const [isPresent, setIsPresent] = useState<boolean>(false);
  const [lessonDetail, setLessonDetail] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [attendanceLoading, setAttendanceLoading] = useState<boolean>(false); // Nou pentru loading la prezență

  useEffect(() => {
    const fetchLessonDetail = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          navigation.replace('Login');
          return;
        }

        const response = await fetch(`${API_BASE_URL}/student/lessons/${subjectId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.log('Eroare la obținerea detaliilor lecției:', errorData);
          Alert.alert('Eroare', errorData.message || 'Nu am putut obține detaliile lecției');
          return;
        }

        const data = await response.json();
        console.log('Detalii lecție primite:', data);
        setLessonDetail(data.lesson);

        // Verificăm dacă prezența este deja marcată
        const attendanceResponse = await fetch(`${API_BASE_URL}/student/lessons/${subjectId}/attendance`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (attendanceResponse.ok) {
          const attendanceData = await attendanceResponse.json();
          setIsPresent(attendanceData.attended);
        }
      } catch (error) {
        console.error('Eroare la cererea de detalii lecție:', error);
        Alert.alert('Eroare', 'A apărut o eroare la conectarea cu serverul. Verifică conexiunea la internet.');
      } finally {
        setLoading(false);
      }
    };

    fetchLessonDetail();
  }, [subjectId, navigation]);

  const handleOpenLink = (url: string) => {
    Linking.openURL(url);
  };

  const handleMarkAttendance = async () => {
    setAttendanceLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Eroare', 'Token de autentificare lipsă. Te rugăm să te autentifici din nou.');
        navigation.replace('Login');
        return;
      }

      const response = await fetch(`${API_BASE_URL}/student/lessons/${subjectId}/attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert('Eroare', errorData.message || 'A apărut o problemă la marcarea prezenței.');
        return;
      }

      const data = await response.json();
      Alert.alert('Succes', data.message);

      // Actualizăm starea prezenței
      setIsPresent(!isPresent);
    } catch (error: any) {
      console.error('Eroare la marcarea prezenței:', error);
      Alert.alert('Eroare', 'A apărut o eroare la marcarea prezenței. Te rugăm să încerci din nou.');
    } finally {
      setAttendanceLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={styles.primary.color} />
      </View>
    );
  }

  if (!lessonDetail) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Nu s-au putut încărca detaliile lecției.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{lessonDetail.title}</Text>

      {/* Detalii despre lecție */}
      <View style={styles.lessonDetailsContainer}>
        <Text style={styles.detailText}>Profesor: {lessonDetail.teacher.name}</Text>
        <Text style={styles.detailText}>Ora: {lessonDetail.time}</Text>
        <Text style={styles.detailText}>Data: {moment(lessonDetail.date).format('DD MMMM YYYY')}</Text>
        {lessonDetail.description && (
          <>
            <Text style={styles.sectionTitle}>Descriere</Text>
            <Text style={styles.descriptionText}>{lessonDetail.description}</Text>
          </>
        )}
      </View>

      {/* Secțiunea de Acțiuni */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.squareButton, styles.quizButton]}
          onPress={() =>
            navigation.navigate('Quiz', {
              subjectId: lessonDetail._id,
              subjectName: lessonDetail.title,
            })
          }
        >
          <Icon name="book-open-page-variant" size={30} color="#fff" />
          <Text style={styles.buttonText}>Daily Quiz</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.squareButton, styles.feedbackButton]}
          onPress={() => navigation.navigate('Feedback', { subjectId: lessonDetail._id, subjectName: lessonDetail.title })}
        >
          <Icon name="comment-text" size={30} color="#fff" />
          <Text style={styles.buttonText}>Feedback</Text>
        </TouchableOpacity>

        {/* Butonul de Prezență */}
        <TouchableOpacity
          style={[styles.squareButton, styles.attendanceButton]}
          onPress={handleMarkAttendance}
          disabled={attendanceLoading}
        >
          {attendanceLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon name={isPresent ? "check-circle" : "checkbox-blank-circle-outline"} size={30} color="#fff" />
              <Text style={styles.buttonText}>{isPresent ? 'Retrage prezența' : 'Marchează Prezența'}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Link-uri Utile (dacă există) */}
      {/* {lessonDetail.usefulLinks && lessonDetail.usefulLinks.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Link-uri Utile</Text>
          <View style={styles.linksContainer}>
            {lessonDetail.usefulLinks.map((link: { id: string; title: string; url: string }) => (
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
        </>
      )} */}
    </ScrollView>
  );
};

export default SubjectDetailScreen;

const styles = StyleSheet.create({
  primary: {
    color: '#4CAF50', // Verde vibrant
  },
  secondary: {
    color: '#FF9800', // Portocaliu
  },
  accent: {
    color: '#3F51B5', // Albastru intens
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5', // Gri foarte deschis
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#E53935', // Roșu vibrant
    textAlign: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333333',
    textAlign: 'center',
  },
  lessonDetailsContainer: {
    backgroundColor: '#FFFFFF', // Alb
    padding: 20,
    borderRadius: 15,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  detailText: {
    fontSize: 18,
    color: '#424242',
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 16,
    color: '#616161',
    marginTop: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#424242',
    marginBottom: 10,
    marginTop: 15,
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  squareButton: {
    width: '48%',
    aspectRatio: 1, // Pătrat
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  quizButton: {
    backgroundColor: '#4CAF50', // Verde vibrant
  },
  feedbackButton: {
    backgroundColor: '#3F51B5', // Albastru intens
  },
  attendanceButton: {
    backgroundColor: '#FF9800', // Portocaliu
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  linksContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  linkButton: {
    width: '48%',
    marginBottom: 15,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FF9800', // Portocaliu
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  usefulLinkButton: {
    backgroundColor: '#FF9800', // Portocaliu
  },
  linkText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,
  },
});