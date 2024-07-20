import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Modal, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ToggleBarModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (!modalVisible) {
        setSelectedOption(null); // Reset selected option if modal is not open
      }
    });

    return unsubscribe;
  }, [navigation, modalVisible]);

  const handleToggleBar = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setModalVisible(false);
    navigation.navigate(option); // Navigate to selected option
  };

  const renderOptions = () => {
    return (
      <>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => handleOptionSelect('OrderForm')}
        >
          <Text style={styles.optionButtonText}>OrderForm</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => handleOptionSelect('ItemList')}
        >
          <Text style={styles.optionButtonText}>Item</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => handleOptionSelect('CustomerList')}
        >
          <Text style={styles.optionButtonText}>Customer</Text>
        </TouchableOpacity>
      </>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.toggleBar} onPress={handleToggleBar}>
        {/* <Icon name="bars" size={30} color="#333" /> */}
        <Image style={{height:30,width:30,}} source={require('./icons8-menu-150.png')}></Image>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <TouchableOpacity style={styles.overlay} onPress={closeModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {renderOptions()}
              {/* <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    position:'relative',
    // borderWidth:2,
    height:50,
    backgroundColor: '#fff',
  },
  toggleBar: {
    padding:15,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 80,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent', // semi-transparent black
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  modalContainer: {
    width: '45%',
    height:'100%',
    // justifyContent: 'center',
    // alignItems: 'flex-start',
    backgroundColor: 'black',
  },
  modalContent: {
    alignSelf: 'stretch',
    backgroundColor: 'black',
    padding: 20,
    borderRadius: 0,
  },
  optionButton: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  optionButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default ToggleBarModal;
