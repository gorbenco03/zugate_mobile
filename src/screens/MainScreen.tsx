// src/screens/MainScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ListRenderItemInfo,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import moment, { Moment } from 'moment';
import 'moment/locale/ro';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_URL from '../api/apiConfig';

type MainScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

type Props = {
  navigation: MainScreenNavigationProp;
};

type Subject = {
  id: string;
  name: string;
  time: string;
  teacherName?: string;
};

type Lesson = {
  _id: string;
  title: string;
  date: string; // Data lecției, de tip string
  time: string;
  teacher: {
    _id: string;
    name: string;
  };
  description?: string;
};

const generateAllDays = (numDays: number): { date: Moment; dayName: string; dateString: string }[] => {
  const days = [];
  let currentDate = moment(); // Începem de la data curentă

  for (let i = 0; i < numDays; i++) {
    days.push({
      date: currentDate.clone(),
      dayName: currentDate.format('dd'), // Numele zilei
      dateString: currentDate.format('DD/MM'), // Data în format zi/lună
    });
    currentDate.add(1, 'day');
  }

  return days;
};

const MainScreen: React.FC<Props> = ({ navigation }) => {
  const [daysList, setDaysList] = useState<{ date: Moment; dayName: string; dateString: string }[]>([]);
  const [selectedDate, setSelectedDate] = useState<Moment>(moment());
  const [schedule, setSchedule] = useState<{ [date: string]: Subject[] }>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    moment.locale('ro');

    const generatedDays = generateAllDays(30);
    setDaysList(generatedDays);

    // Setăm ziua selectată la data de azi
    setSelectedDate(moment());

    const fetchSchedule = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (!token) {
          // Dacă nu avem token, navigăm înapoi la ecranul de autentificare
          navigation.replace('Login');
          return;
        }

        console.log('Token utilizat pentru cerere:', token);

        const response = await fetch(`${API_BASE_URL}/student/schedule`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log('Statusul răspunsului:', response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.log('Eroare la obținerea orarului:', errorData);
          Alert.alert('Eroare', errorData.message || 'Nu am putut obține orarul');
          return;
        }

        const data = await response.json();
        console.log('Orar primit:', data);

        const lessons: Lesson[] = data.schedule;

        // Mapăm lecțiile la datele lor
        const scheduleByDate: { [date: string]: Subject[] } = {};

        lessons.forEach((lesson) => {
          const dateKey = moment(lesson.date).format('YYYY-MM-DD');
          if (!scheduleByDate[dateKey]) {
            scheduleByDate[dateKey] = [];
          }
          scheduleByDate[dateKey].push({
            id: lesson._id,
            name: lesson.title,
            time: lesson.time,
            teacherName: lesson.teacher.name,
          });
        });

        setSchedule(scheduleByDate);
      } catch (error) {
        console.error('Eroare la cererea de orar:', error);
        Alert.alert('Eroare', 'A apărut o eroare la conectarea cu serverul. Verifică conexiunea la internet.');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [navigation]);

  const renderDayItem = ({
    item,
  }: ListRenderItemInfo<{ date: Moment; dayName: string; dateString: string }>) => (
    <TouchableOpacity
      style={[
        styles.dayItem,
        item.date.isSame(selectedDate, 'day') ? styles.selectedDayItem : null,
      ]}
      onPress={() => setSelectedDate(item.date)}
    >
      <Text
        style={[
          styles.dayItemText,
          item.date.isSame(selectedDate, 'day') ? styles.selectedDayText : null,
        ]}
      >
        {item.dayName}
      </Text>
      <Text
        style={[
          styles.dayItemText,
          item.date.isSame(selectedDate, 'day') ? styles.selectedDayText : null,
        ]}
      >
        {item.dateString}
      </Text>
    </TouchableOpacity>
  );

  const renderScheduleItem = ({ item }: { item: Subject }) => (
    <TouchableOpacity
      style={styles.subjectContainer}
      onPress={() => {
        navigation.navigate('SubjectDetail', { subjectId: item.id, subjectName: item.name });
      }}
    >
      <Text style={styles.subjectName}>{item.name}</Text>
      <Text style={styles.subjectTime}>{item.time}</Text>
      {item.teacherName && <Text style={styles.subjectTeacher}>Profesor: {item.teacherName}</Text>}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  const scheduleForSelectedDate = schedule[selectedDate.format('YYYY-MM-DD')] || [];

  // Calculăm indexul inițial pentru ziua de azi
  const selectedIndex = daysList.findIndex((day) => day.date.isSame(selectedDate, 'day'));

  return (
    <View style={styles.container}>
      <FlatList
        data={daysList}
        renderItem={renderDayItem}
        keyExtractor={(item) => item.date.format('YYYY-MM-DD')}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.daysList}
        initialScrollIndex={selectedIndex >= 0 ? selectedIndex : 0}
        getItemLayout={(data, index) => ({ length: 80, offset: 80 * index, index })}
      />
      <View style={styles.scheduleContainer}>
        {scheduleForSelectedDate.length > 0 ? (
          <FlatList
            data={scheduleForSelectedDate}
            renderItem={renderScheduleItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.scheduleList}
          />
        ) : (
          <Text style={styles.noLessonsText}>Nu există lecții programate pentru această zi.</Text>
        )}
      </View>
    </View>
  );
};

export default MainScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f5ff',
  },
  daysList: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  dayItem: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 6,
    borderRadius: 12,
    backgroundColor: '#6f86d6',
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 60,
  },
  selectedDayItem: {
    backgroundColor: '#34c759',
    transform: [{ scale: 1.05 }],
    shadowColor: '#34c759',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  dayItemText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
  },
  selectedDayText: {
    color: '#ffffff',
  },
  scheduleContainer: {
    flex: 8,
    paddingHorizontal: 25,
    paddingTop: 5,
  },
  scheduleList: {
    paddingBottom: 30,
  },
  subjectContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    marginTop: 10,
    borderRadius: 16,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
    borderLeftWidth: 8,
    borderLeftColor: '#34c759',
  },
  subjectName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#34495e',
  },
  subjectTime: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 8,
  },
  subjectTeacher: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
  noLessonsText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});