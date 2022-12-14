import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Modal,
  Animated,
  TouchableWithoutFeedback,
  Dimensions,
  PanResponder,
  TouchableOpacity,
  Image,
  ScrollView,
  Pressable,
  Alert,
  BackHandler,
} from 'react-native';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from 'react-native-responsive-dimensions';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

import axios from 'axios';
import Button from '../ui/Button';
const url = 'http://i7d203.p.ssafy.io:8080';

const TodoList = props => {
  const navigation = useNavigation();

  const dogId = useSelector(state => state.profile.id);
  const [todolist, setTodolist] = useState([]);
  const [runningllist, setRunningllist] = useState([]);

  const {modalVisible, setModalVisible} = props;
  const screenHeight = Dimensions.get('screen').height;
  const panY = useRef(new Animated.Value(screenHeight)).current;
  const translateY = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });

  const resetBottomSheet = Animated.timing(panY, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  });

  const closeBottomSheet = Animated.timing(panY, {
    toValue: screenHeight,
    duration: 300,
    useNativeDriver: true,
  });

  const panResponders = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderMove: (event, gestureState) => {
        panY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (event, gestureState) => {
        if (gestureState.dy > 0 && gestureState.vy > 1.5) {
          closeModal();
        } else {
          resetBottomSheet.start();
        }
      },
    }),
  ).current;

  useEffect(() => {
    if (props.modalVisible) {
      resetBottomSheet.start();
    }

    console.log('데이터선택');
    console.log(props.selectedDate);
    axios
      .get(url + `/api/dog/${dogId}/walkingdog?date=${props.selectedDate}`)
      .then(response => {
        if (response.status == 200) {
          console.log('산책데이터받기');
          console.log(response.data.data);
          setRunningllist(response.data.data);
        } else {
          console.log(response.status + '산책데이터받기에러');
        }
      });

    axios
      .get(url + `/api/dog/${dogId}/calendar?date=${props.selectedDate}`)
      .then(response => {
        console.log('todo list 받기');
        console.log(response);
        if (response.status == 200) {
          setTodolist(response.data);
        } else {
          console.log(response.status + 'todo받기에러');
        }
      });
  }, [props.modalVisible]);

  const closeModal = () => {
    closeBottomSheet.start(() => {
      setModalVisible(false);
    });
  };

  const goToUpload = () => {
    setModalVisible(false);
    navigation.replace('TodoUpload', {date: props.selectedDate});
  };
      // navigation.replace('TodoUpload', {date: props.selectedDate});


  const toDo = todolist.map((todo, index) => {
    return (
      <View style={styles.todoDetail} key={index}>
        {todo.isInjection ? (
          <View style={styles.todoCategory1}>
            <Text style={{fontFamily: '강원교육튼튼', paddingTop: 3}}>
              접종
            </Text>
          </View>
        ) : (
          <View style={styles.todoCategory2}>
            <Text style={{fontFamily: '강원교육튼튼', paddingTop: 3}}>
              할일
            </Text>
          </View>
        )}

        <Text style={{fontFamily: 'IBMPlexSansKR-Regular'}}>
          {todo.content}
        </Text>
      </View>
    );
  });

  const running = runningllist.map((running, index) => {
    return (
      <View style={styles.todoDetail} key={index}>
        <View style={styles.todoCategory3}>
          <Text style={{fontFamily: '강원교육튼튼', paddingTop: 3}}>산책</Text>
        </View>
        <Text
          style={{
            fontFamily: '강원교육튼튼',
          }}>
          {running.walkingDate}
          {'   '}
        </Text>
        <Text style={{fontFamily: 'IBMPlexSansKR-Regular'}}>
          {running.walkingTime}분 {(running.walkingDistance / 1000).toFixed(2)}
          km
        </Text>
      </View>
    );
  });

  return (
    <Modal
      visible={modalVisible}
      animationType={'fade'}
      transparent
      statusBarTranslucent>
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.background} />
        </TouchableWithoutFeedback>
        <Animated.View
          style={{
            ...styles.bottomSheetContainer,
            transform: [{translateY: translateY}],
          }}
          {...panResponders.panHandlers}>
          <Text
            style={{
              fontSize: 30,
              color: '#553609',
              marginTop: 10,
              marginBottom: 20,
              fontFamily: '강원교육튼튼',
            }}>
            {props.selectedDate.substr(0, 4)}년{' '}
            {props.selectedDate.substr(5, 2)}월{' '}
            {props.selectedDate.substr(8, 2)}일
          </Text>
          <ScrollView style={{width: responsiveWidth(100)}}>
            <View
              style={{
                height: responsiveHeight(50),
                width: responsiveWidth(100),
                marginBottom: 100,
              }}>
              {todolist.length != 0 ? (
                <>
                  <View style={styles.todoContent}>
                    {running}
                    {toDo}
                  </View>
                </>
              ) : (
                <View>
                  {/* <NothingTodo /> */}
                  <Image
                    style={{
                      height: responsiveHeight(50),
                      width: responsiveWidth(100),
                    }}
                    resizeMode="contain"
                    source={require('../../Assets/image/nothing.gif')}
                  />
                </View>
              )}
            </View>
          </ScrollView>
          <View style={styles.buttonContainer}>
            <Button onPress={goToUpload} style={styles.button}>
              생성하기
            </Button>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  background: {
    flex: 1,
  },
  bottomSheetContainer: {
    height: responsiveHeight(70),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8EA',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  plusButton: {
    borderWidth: 1,
    position: 'absolute',
    bottom: responsiveHeight(10),
    right: responsiveWidth(7),
    alignSelf: 'flex-end',
    marginTop: responsiveHeight(10),
    maxWidth: responsiveWidth(12),
    maxHeight: responsiveWidth(12),
    flex: 1,
    zIndex: 1,
  },
  todoContent: {
    width: responsiveWidth(80),
    height: responsiveHeight(80),
    marginLeft: responsiveWidth(9),
    marginRight: responsiveWidth(5),
  },
  todoCategory1: {
    backgroundColor: '#AFD485',
    marginLeft: 10,
    marginRight: 10,
    width: responsiveWidth(10),
    height: responsiveHeight(3),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todoCategory2: {
    backgroundColor: '#DD9944',
    marginLeft: 10,
    marginRight: 10,
    width: responsiveWidth(10),
    height: responsiveHeight(3),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todoCategory3: {
    backgroundColor: '#B8E9FF',
    marginLeft: 10,
    marginRight: 10,
    width: responsiveWidth(10),
    height: responsiveHeight(3),
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todoDetail: {
    height: responsiveHeight(6),
    backgroundColor: '#FBEDD3',
    marginTop: responsiveHeight(1),
    marginBottom: responsiveHeight(1),
    borderRadius: 15,
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonContainer: {
    marginBottom: responsiveHeight(5),
  },
  button: {
    width: responsiveWidth(40),
  },
});

export default TodoList;
