
   
  import React, { useState, useEffect } from 'react';
  import { View, Text, FlatList, TouchableOpacity, StyleSheet,Alert } from 'react-native';
  
  const ItemList = ({ navigation }) => {
    const [itemList, setItemList] = useState([]);
    const [forceRefresh, setForceRefresh] = useState(false);
    useEffect(() => {
      fetchItems();
    }, [[forceRefresh]]);
  
    const fetchItems = async (shouldRefresh = false) => {
      if (!shouldRefresh && itemList.length > 0) {
        return; // Return if data is already loaded and no refresh is needed
      }
      try {
        const response = await fetch('https://irisinformatics.net/harihara/wb/items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        const data = await response.json();
        if (data.status === '200') {
          setItemList(data.data);
          setForceRefresh(false); // Reset the forceRefresh state
        } else {
          console.error('Error fetching items:', data.message);
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
  
    const handleEditItem = (item) => {
      navigation.navigate('Itemupdate', { itemData: item, fetchItems: fetchItems });
    };
    const handleDeleteItem = (itemId) => {
      Alert.alert(
        'Confirm Delete',
        'Are you sure you want to delete this item?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'OK',
            onPress: () => performDelete(itemId),
          },
        ],
        { cancelable: false }
      );
    };
  
    const performDelete = async (itemId) => {
      try {
        const requestBody = { id: itemId };
  
        const response = await fetch('https://irisinformatics.net/harihara/wb/delete_item', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
  
        const data = await response.json();
        if (data.status === '200') {
          const updatedItems = itemList.filter((item) => item.id !== itemId);
          setItemList(updatedItems);
          console.log('Item deleted successfully');
        } else {
          console.error('Error deleting item:', data.message);
        }
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    };
  
    const renderItem = ({ item }) => (
      <View style={styles.itemContainer}>
        <Text style={styles.itemText}>{item.name}</Text>
        <Text style={styles.itemText}>${item.price}</Text>
        <TouchableOpacity style={styles.button} onPress={() => handleEditItem(item)}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => handleDeleteItem(item.id)}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  
    return (
      <View style={styles.container}>
        {/* <TouchableOpacity onPress={() => navigation.navigate('ItemForm', { fetchItems })} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add Item</Text>
        </TouchableOpacity> */}
        <View style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', alignItems: 'flex-end' }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ItemForm', { fetchItems })}
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
            Add Items
          </Text>
        </TouchableOpacity>
      </View>
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.label}>Price</Text>
          <Text style={styles.label}>Action</Text>
        </View>
        <FlatList
          data={itemList}
          renderItem={renderItem}
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
    color: 'black',
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
    color: 'black',
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginTop: 10,
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

export default ItemList;
