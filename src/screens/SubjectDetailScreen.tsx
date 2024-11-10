import React, { useState, useEffect, useCallback } from 'react';
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
  quizzes?: any[];
};

// Componenta separată pentru statusul prezenței
const AttendanceStatus: React.FC<{ isPresent: boolean }> = React.memo(({ isPresent }) => {
  if (!isPresent) return null;
  
  return (
    <View style={styles.attendanceStatusContainer}>
      <Icon name="check-circle" size={24} color="#4CAF50" />
      <Text style={styles.attendanceStatusText}>Prezență confirmată</Text>
    </View>
  );
});

// Componenta separată pentru detaliile lecției
const LessonDetails: React.FC<{ lessonDetail: LessonDetail }> = React.memo(({ lessonDetail }) => {
  return (
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
  );
});

// Componenta separată pentru butoanele de acțiune
const ActionButtons: React.FC<{
  lessonDetail: LessonDetail;
  navigation: SubjectDetailScreenNavigationProp;
  isPresent: boolean;
  attendanceLoading: boolean;
  onMarkAttendance: () => void;
}> = React.memo(({ lessonDetail, navigation, isPresent, attendanceLoading, onMarkAttendance }) => {
  return (
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

      {!isPresent && (
        <TouchableOpacity
          style={[styles.squareButton, styles.attendanceButton]}
          onPress={onMarkAttendance}
          disabled={attendanceLoading || isPresent}
        >
          {attendanceLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon name="checkbox-blank-circle-outline" size={30} color="#fff" />
              <Text style={styles.buttonText}>Marchează Prezența</Text>
            </>
          )}
        </TouchableOpacity>
      )}
    </View>
  );
});
const SubjectDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { subjectId } = route.params;
  const [isPresent, setIsPresent] = useState<boolean>(false);
  const [lessonDetail, setLessonDetail] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [attendanceLoading, setAttendanceLoading] = useState<boolean>(false);

  const checkAttendanceStatus = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;
  
      const response = await fetch(`${API_BASE_URL}/student/lessons/${subjectId}/attendance`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        setIsPresent(data.attended); // Setați statusul prezenței din răspuns
      }
    } catch (error) {
      console.error('Eroare la verificarea prezenței:', error);
    }
  }, [subjectId]);

  const handleMarkAttendance = useCallback(async () => {
    if (isPresent) return; // Evită marcarea din nou dacă deja este prezent
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
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert('Eroare', errorData.message || 'A apărut o problemă la marcarea prezenței.');
        return;
      }
  
      const data = await response.json();
      setIsPresent(data.attended);
      Alert.alert('Succes', data.message);
  
    } catch (error) {
      console.error('Eroare la marcarea prezenței:', error);
      Alert.alert('Eroare', 'A apărut o eroare la marcarea prezenței. Te rugăm să încerci din nou.');
    } finally {
      setAttendanceLoading(false);
    }
  }, [subjectId, navigation, isPresent]);

  useEffect(() => {
    const fetchData = async () => {
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
  
        // Verificăm statusul de prezență
        await checkAttendanceStatus();
      } catch (error) {
        console.error('Eroare la cererea de detalii lecție:', error);
        Alert.alert('Eroare', 'A apărut o eroare la conectarea cu serverul.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [subjectId, navigation, checkAttendanceStatus]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
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
      
      {/* Indicator de prezență */}
      <AttendanceStatus isPresent={isPresent} />

      {/* Detalii despre lecție */}
      <LessonDetails lessonDetail={lessonDetail} />

      {/* Butoane de acțiune */}
      <ActionButtons
        lessonDetail={lessonDetail}
        navigation={navigation}
        isPresent={isPresent}
        attendanceLoading={attendanceLoading}
        onMarkAttendance={handleMarkAttendance}
      />
    </ScrollView>
  );
};


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
  attendanceStatusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  attendanceStatusText: {
    marginLeft: 8,
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  attendanceButtonActive: {
    backgroundColor: '#388E3C', // Verde mai închis pentru starea activă
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
    aspectRatio: 1,
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
    backgroundColor: '#FF9800',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  usefulLinkButton: {
    backgroundColor: '#FF9800',
  },
  linkText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,
  },
});

export default SubjectDetailScreen;