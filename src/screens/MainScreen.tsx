// src/screens/MainScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ListRenderItemInfo } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import moment, { Moment } from 'moment';
import 'moment/locale/ro';

type MainScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

type Props = {
  navigation: MainScreenNavigationProp;
};

type Subject = {
  id: string;
  name: string;
  time: string;
};

const generateWorkingDays = (numDays: number): { date: Moment; dayName: string; dateString: string }[] => {
  const days = [];
  let currentDate = moment();

  while (days.length < numDays) {
    if (currentDate.isoWeekday() <= 5) { // 1 (Luni) - 5 (Vineri)
      days.push({
        date: currentDate.clone(),
        dayName: currentDate.format('dd'), // Numele zilei
        dateString: currentDate.format('DD/MM'), // Data în format zi/lună
      });
    }
    currentDate.add(1, 'day');
  }

  return days;
};

const getScheduleForDate = (date: Moment): Subject[] => {
  const dayName = date.format('dd'); // Obține numele zilei în limba română

  const schedules: { [key: string]: Subject[] } = {
    Lu: [
      { id: '1', name: 'Matematică', time: '08:00 - 09:30' },
      { id: '2', name: 'Biologie', time: '10:00 - 11:30' },
      { id: '3', name: 'Fizica', time: '12:00 - 13:00' },   
      { id: '4', name: 'Chimie', time: '13:30 - 14:30' },
      { id: '5', name: 'Romana', time: '15:00 - 16:30' },
    ],
    Ma: [
      { id: '3', name: 'Istorie', time: '08:00 - 09:30' },
      { id: '4', name: 'Geografie', time: '10:00 - 11:30' },
    ],
    Mi: [
      { id: '5', name: 'Chimie', time: '08:00 - 09:30' },
      { id: '6', name: 'Fizică', time: '10:00 - 11:30' },
    ],
    Jo: [
      { id: '7', name: 'Engleză', time: '08:00 - 09:30' },
      { id: '8', name: 'Educație Fizică', time: '10:00 - 11:30' },
    ],
    Vi: [
      { id: '9', name: 'Informatică', time: '08:00 - 09:30' },
      { id: '10', name: 'Arte', time: '10:00 - 11:30' },
    ],
  };

  return schedules[dayName] || [];
};

const MainScreen: React.FC<Props> = ({ navigation }) => {
  const [daysList, setDaysList] = useState<{ date: Moment; dayName: string; dateString: string }[]>([]);
  const [selectedDate, setSelectedDate] = useState<Moment>(moment());

  useEffect(() => {
    moment.locale('ro');
    const generatedDays = generateWorkingDays(30);
    setDaysList(generatedDays);
    setSelectedDate(moment());
  }, []);

  const renderDayItem = ({ item, index }: ListRenderItemInfo<{ date: Moment; dayName: string; dateString: string }>) => (
    <TouchableOpacity
      style={[
        styles.dayItem,
        item.date.isSame(selectedDate, 'day') ? styles.selectedDayItem : null,
      ]}
      onPress={() => setSelectedDate(item.date)}
    >
      <Text style={[
        styles.dayItemText,
        item.date.isSame(selectedDate, 'day') ? styles.selectedDayText : null,
      ]}>
        {item.dayName}
      </Text>
      <Text style={[
        styles.dayItemText,
        item.date.isSame(selectedDate, 'day') ? styles.selectedDayText : null,
      ]}>
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
    </TouchableOpacity>
  );

  const schedule = getScheduleForDate(selectedDate);

  return (
    <View style={styles.container}>
      <FlatList
        data={daysList}
        renderItem={renderDayItem}
        keyExtractor={(item) => item.date.format('YYYY-MM-DD')}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.daysList}
        initialScrollIndex={daysList.length > 0 ? daysList.findIndex(day => day.date.isSame(selectedDate, 'day')) : 0}
        style={{ height: 0 }} 
        getItemLayout={(data, index) => (
          { length: 80, offset: 80 * index, index }
        )}
        onEndReached={() => {
          
          const moreDays = generateWorkingDays(30);
          setDaysList(prevDays => [...prevDays, ...moreDays]);
        }}
        onEndReachedThreshold={0.5}
      />
      <View style={styles.scheduleContainer}>
        <FlatList
          data={schedule}
          renderItem={renderScheduleItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.scheduleList}
        />
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
      color: '#ffffff', // Definim selectedDayText pentru a evita eroarea
    },
    scheduleContainer: {
      flex: 8,
      paddingHorizontal: 25,
      paddingTop: 5,
    },
    scheduleTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: '#2c3e50',
      marginBottom: 20,
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
  });