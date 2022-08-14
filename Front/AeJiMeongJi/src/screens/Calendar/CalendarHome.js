import React, {useState, useEffect} from 'react';
import {Image, StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {Avatar, Button, Card, Title, Typography} from 'react-native-paper';

import {Colors} from '../../constants/styles';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import Navbar from './../../components/nav/Navbar';
import {format, setDay} from 'date-fns';

import TodoList from '../../components/Todo/TodoList';

const CalendarHome = ({navigation}) => {
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), 'yyyy-MM-dd'),
  );
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    const now = new Date();
    console.log(now);
    setYear(now.getFullYear());
    setMonth((now.getMonth() + 1).toString());
    setDay(now.getDate().toString());
    setDate(
      now.getFullYear() +
        '-0' +
        (now.getMonth() + 1).toString() +
        '-' +
        now.getDate().toString(),
    );

    console.log('오늘의 날짜');
  }, []);

  console.log(year);
  console.log(month);
  console.log(day);
  console.log(date);

  LocaleConfig.locales['calendarData'] = {
    monthNames: [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ],
    monthNamesShort: [
      'Jan.',
      'Feb.',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul.',
      'Aug',
      'Sep.',
      'Oct.',
      'Nov.',
      'Dec.',
    ],
    dayNames: [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ],
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'],
    today: "Aujourd'hui",
  };
  LocaleConfig.defaultLocale = 'calendarData';

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.rootContainer}>
      {/* <Navbar /> */}
      <View style={styles.nav}>
        <Image
          style={styles.logo2}
          resizeMode="contain"
          source={require('../../Assets/image/logo2.png')}
        />
      </View>
      <View style={styles.contentbox}>
        <Calendar
          style={{backgroundColor: '#FFF8EA'}}
          markingType={'period'}
          markedDates={{
            // '2022-08-11': {
            //   marked: true,
            //   dotColor: '#50cebb',
            //   startingDay: true,
            //   color: '#51cebb',
            //   textColor: 'white',
            //   startingDay: true,
            // },
            [date]: {
              marked: true,
              dotColor: '#50cebb',
              color: '#50cebb',
              textColor: 'white',
            },
            // '2022-08-13': {
            //   dotColor: '#50cebb',

            //   color: '#50cebb',
            //   textColor: 'white',
            //   endingDay: true,
            // },
          }}
          onDayPress={day => {
            setSelectedDate(day.dateString);

            setModalVisible(true);
          }}
        />
        {/* <TodoList
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          selectedDate={selectedDate}
        /> */}
      </View>
      <TodoList
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        selectedDate={selectedDate}
      />
    </View>
  );
};
export default CalendarHome;

const styles = StyleSheet.create({
  font: {
    fontFamily: 'ONE Mobile POP',
  },
  contentFont: {
    fontFamily: 'ONE Mobile Regular',
    fontWeight: 'bold',
  },

  mainText: {
    fontSize: 20,
    lineHeight: 40,
    letterSpacing: 4,
    color: Colors.contentText,
  },
  subText: {
    fontSize: 18,
    lineHeight: 40,
    letterSpacing: 4,
    color: Colors.contentText,
  },

  contentText: {
    fontSize: 12,
    lineHeight: 20,
    letterSpacing: 2,
    color: Colors.contentText,
  },
  rootContainer: {
    flex: 1,
    backgroundColor: Colors.back100,
  },
  nav: {
    height: 50,
    alignSelf: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  contentbox: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.back100,
    marginBottom: 60,
  },

  logo2: {
    marginTop: 10,
    maxWidth: '50%',
    maxHeight: '60%',
  },
  runicon: {
    marginTop: 5,
    maxWidth: '70%',
    maxHeight: '60%',
  },
  calendarLogo: {
    marginTop: 5,
    marginRight: 10,
    maxWidth: '40%',
    maxHeight: '80%',
  },
  logo: {
    marginTop: 50,
    maxWidth: '60%',
    maxHeight: '30%',
  },
  item: {
    backgroundColor: Colors.back100,
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17,
  },
});
