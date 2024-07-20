import React, { useState, useEffect } from 'react';
import { ScrollView } from 'react-native';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const Itemupdate = ({ navigation, route }) => {
  const [name, setItemName] = useState('');
  const [price, setPrice] = useState('');
  const [cgst, setCgst] = useState('');
  const [sgst, setSgst] = useState('');
  const [igst, setIgst] = useState('');
  const [unit, setUnit] = useState('');
  const { fetchItems } = route.params;

  useEffect(() => {
    if (route.params && route.params.itemData) {
      const { name, price, cgst, sgst, igst, unit } = route.params.itemData;
      setItemName(name);
      setPrice(price);
      setCgst(cgst);
      setSgst(sgst);
      setIgst(igst);
      setUnit(unit);
    }
  }, [route.params]);

  const handleSubmit = async () => {
    try {
      const response = await fetch('https://irisinformatics.net/harihara/wb/update_item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: route.params.itemData.id,
          name: name,
          price: price,
          cgst: cgst,
          sgst: sgst,
          igst: igst,
          unit: unit,
        }),
      });

      const data = await response.json();
      Alert.alert('Success', 'Item updated successfully');
      console.log('Response from API:', data);
      fetchItems(true);
      navigation.navigate('ItemList');
    } catch (error) {
      console.error('Error updating item:', error);
    }
  };

  const handleIgstChange = (text) => {
    const value = text.trim(); // Remove leading/trailing whitespace
    setIgst(value);
    if (value) {
      setCgst('');
      setSgst('');
    } else {
      // Clear IGST when the input is empty
      setIgst('');
    }
  };

  const handleCgstSgstChange = (text, field) => {
    const value = text.trim(); // Remove leading/trailing whitespace
    if (igst) {
      Alert.alert('Error', 'You can fill only CGST, SGST or IGST');
      return;
    }
    if (value) {
      setIgst('');
    }
    if (field === 'cgst') {
      setCgst(value);
    } else {
      setSgst(value);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Item Name</Text>
      <TextInput
        style={styles.input}
        value={name}
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
  // editable={igst === '' || igst === ''}
/>
      <Text style={styles.label}>SGST</Text>
      <TextInput
  style={styles.input}
  value={sgst}
  onChangeText={(text) => handleCgstSgstChange(text, 'sgst')}
  placeholder="Enter SGST"
  keyboardType="numeric"

/>

      <Text style={styles.label}>IGST</Text>
      <TextInput
  style={styles.input}
  value={igst}
  onChangeText={handleIgstChange}
  placeholder="Enter IGST"
  keyboardType="numeric"
  // editable={cgst === '0.00' && sgst === '0.00'}
  // editable={!cgst && !sgst}
/>
      <Text style={styles.label}>Unit</Text>
      <TextInput
        style={styles.input}
        value={unit}
        onChangeText={setUnit}
        placeholder="Enter unit (kg/liter)"
      />
      <TouchableOpacity style={styles.buttonContainer} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
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

export default Itemupdate;