// CustomerListFromAPI.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet,Alert} from 'react-native';

const CustomerListFromAPI = ({ navigation }) => {
  const [customers, setCustomers] = useState([]);
  const [forceRefresh, setForceRefresh] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, [forceRefresh]);

  const fetchCustomers = async (shouldRefresh = false) => {
    if (!shouldRefresh && customers.length > 0) {
      return; // Return if data is already loaded and no refresh is needed
    }

    try {
      const response = await fetch('https://irisinformatics.net/harihara/wb/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.status === '200') {
        setCustomers(data.data);
        console.log('data', data.data);
        setForceRefresh(false); 
      } else {
        console.error('Error fetching customers:', data.message);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const deleteCustomer = async (customerId) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this customer?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => performDelete(customerId),
        },
      ],
      { cancelable: false }
    );
  };
  
  const performDelete = async (customerId) => {
    try {
      const requestBody = { id: customerId };
  
      const response = await fetch('https://irisinformatics.net/harihara/wb/delete_customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
  
      const data = await response.json();
      if (data.status === '200') {
        // Delete customer from the customers state
        const updatedCustomers = customers.filter((customer) => customer.id !== customerId);
        setCustomers(updatedCustomers);
        console.log('Customer deleted successfully');
      } else {
        console.error('Error deleting customer:', data.message);
      }
    } catch (error) {
      console.error('Error deleting customer:', error);
    }
  };
  const handleEditCustomer = (customer) => {
    // Handle edit customer logic
    navigation.navigate('Customerupdate',{itemData:customer, fetchCustomers:fetchCustomers})
    console.log('Edit customer:', customer);
  };

  const renderCustomerItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item.name}</Text>
      <Text style={styles.itemText}>{item.address}</Text>
      {/* <Text style={styles.itemText}>{item.gst}</Text> */}
      <TouchableOpacity style={styles.button} onPress={() => handleEditCustomer(item)}>
        <Text style={styles.buttonText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => deleteCustomer(item.id)}>
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', alignItems: 'flex-end' }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('CustomerForm', { fetchCustomers })}
          style={{
            backgroundColor: '#007BFF',
            height: 50,
            width: 130,
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text title="Add Customer" color="#007BFF" style={{ textAlign: 'right', color: '#fff', fontSize: 16 }}>
            Add Customer
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.labelContainer}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.label}>Address</Text>
        {/* <Text style={styles.label}>GST</Text> */}
        {/* Add any other relevant labels */}
        <Text style={styles.label}>Action</Text>
      </View>
      <FlatList
        style={{ marginTop: 20 }}
        data={customers}
        renderItem={renderCustomerItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
  },
  labelContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
    color: 'black',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  itemText: {
    flex: 1,
    marginRight: 10,
    color: 'black',
  },
  button: {
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 10,
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default CustomerListFromAPI;