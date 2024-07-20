import React, { useState,useEffect } from 'react';
import { ScrollView } from 'react-native';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const Customerupdate = ({ navigation, route }) => {
  const [name, setCustomerName] = useState('');
  // const [email, setEmail] = useState('');
  // const [mobileNumber, setMobileNumber] = useState('');
  const [address, setAddress] = useState('');
  const [gst, setGstNumber] = useState('');

  const { fetchCustomers } = route.params;
  useEffect(() => {
    if (route.params && route.params.itemData) {
      const { name,gst, address,} = route.params.itemData;
      setCustomerName(name);
      setAddress(address);
      setGstNumber(gst);
    }
  }, [route.params]);

  const handleSubmit = async () => {
    try {
    //   const requestBody = {
    //     name: customerName,
    //     address,
    //     gst: gstNumber,
    //   };

      const response = await fetch('https://irisinformatics.net/harihara/wb/update_customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id:route.params.itemData.id,
            name: name,
            address: address,
            gst: gst,
          })

        
      });

      const data = await response.json();
      if (data.status === '200') {
        Alert.alert('Success', 'Customer update successfully');
        // Reset the form fields
        // setCustomerName('');
        // setAddress('');
        // setGstNumber('');
        // Fetch the updated list of customers
        fetchCustomers(true);
        navigation.navigate('CustomerList');
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      console.error('Error adding customer:', error);
      Alert.alert('Error', 'An error occurred while adding the customer');
    }
  };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Customer Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setCustomerName}
        placeholder="Enter customer name"
      />

      {/* <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter email"
      /> */}

      {/* <Text style={styles.label}>Mobile Number</Text>
      <TextInput
        style={styles.input}
        value={mobileNumber}
        onChangeText={setMobileNumber}
        placeholder="Enter mobile number"
      /> */}

      <Text style={styles.label}>Address</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="Enter address"
      />

      <Text style={styles.label}>GST Number</Text>
      <TextInput
        style={styles.input}
        value={gst}
        onChangeText={setGstNumber}
        placeholder="Enter GST number"
      />

      <Button
        title="Submit"
        onPress={handleSubmit}
        color="#007BFF"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 40,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    color:'black'
  }
});

export default Customerupdate;

