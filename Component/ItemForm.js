import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ScrollView } from 'react-native';

const ItemForm = ({ navigation, route }) => {
  const [itemName, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [cgst, setCgst] = useState('');
  const [sgst, setSgst] = useState('');
  const [igst, setIgst] = useState('');
  const [unit, setUnit] = useState('');
  const { fetchItems } = route.params;

  const handleSubmit = async () => {
    try {
      const requestBody = {
        name: itemName,
        price: price,
        cgst: parseFloat(cgst),
        sgst: parseFloat(sgst),
        igst: parseFloat(igst),
        unit,
      };

      const response = await fetch('https://irisinformatics.net/harihara/wb/add_item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (data.status === '200') {
        Alert.alert('Success', 'Item added successfully');
        // Reset the form fields
        setItemName('');
        setPrice('');
        setCgst('');
        setSgst('');
        setIgst('');
        setUnit('');
        // Fetch the updated list of items
        fetchItems(true);
        navigation.navigate('ItemList');
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Error adding item:', error);
      Alert.alert('Error', 'An error occurred while adding the item');
    }
  };

  const handleIgstChange = (text) => {
    setIgst(text);
    if (text) {
      setCgst('');
      setSgst('');
    }
  };

  const handleCgstSgstChange = (text, field) => {
    if (igst) {
      Alert.alert('Error', 'You can fill only CGST, SGST or IGST');
      return;
    }
    if (text) {
      setIgst('');
    }
    if (field === 'cgst') {
      setCgst(text);
    } else {
      setSgst(text);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Item Name</Text>
      <TextInput
        style={styles.input}
        value={itemName}
        onChangeText={setItemName}
        placeholder="Enter item name"
      />
      <Text style={styles.label}>Price</Text>
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        placeholder="Enter price"
        keyboardType="numeric"
      />
      <Text style={styles.label}>CGST</Text>
      <TextInput
        style={styles.input}
        value={cgst}
        onChangeText={(text) => handleCgstSgstChange(text, 'cgst')}
        placeholder="Enter CGST"
        keyboardType="numeric"
        editable={!igst}
      />
      <Text style={styles.label}>SGST</Text>
      <TextInput
        style={styles.input}
        value={sgst}
        onChangeText={(text) => handleCgstSgstChange(text, 'sgst')}
        placeholder="Enter SGST"
        keyboardType="numeric"
        editable={!igst}
      />
      <Text style={styles.label}>IGST</Text>
      <TextInput
        style={styles.input}
        value={igst}
        onChangeText={handleIgstChange}
        placeholder="Enter IGST"
        keyboardType="numeric"
        editable={!cgst && !sgst}
      />
      <Text style={styles.label}>Unit</Text>
      <TextInput
        style={styles.input}
        value={unit}
        onChangeText={setUnit}
        placeholder="Enter unit (kg/liter)"
      />
      <View style={styles.buttonContainer}>
        <Text style={styles.buttonText} onPress={handleSubmit}>
          Submit
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 16,
  },
  label: {
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
    color: 'black',
    paddingHorizontal: 8,
  },
  buttonContainer: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 4,
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ItemForm;