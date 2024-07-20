  import React, { useState, useEffect } from 'react';
  import { View, Text, TextInput, ScrollView, Button, StyleSheet, TouchableOpacity, Modal, FlatList, Image,Alert,Linking,Share} from 'react-native';
  import Icon from 'react-native-vector-icons/MaterialIcons';
  import CheckBox from '@react-native-community/checkbox';
  import { useNavigation } from '@react-navigation/native';
  // import { Provider as PaperProvider, Portal } from 'react-native-paper';
  import DatePicker from 'react-native-date-picker';
  import { Provider as PaperProvider, Portal } from 'react-native-paper';
  import { Calendar } from 'react-native-calendars';
  const ProductModal = ({ isVisible, onClose, onSelectProduct, }) => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
      if (isVisible) {
        fetchItems();
      }
    }, [isVisible]);

    const fetchItems = async () => {
      try {
        const response = await fetch('https://irisinformatics.net/harihara/wb/items', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        console.log('product',data)
        if (data.status === '200') {
          const productsWithTaxes = data.data.map((item) => ({
            ...item,
            cgst: item.cgst || 0,
            sgst: item.sgst || 0,
            igst: item.igst || 0,
          }));
          setProducts(productsWithTaxes);
        } else {
          console.error('Error fetching items:', data.message);
        }
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    const handleSelectProduct = (product) => {
      onSelectProduct(product);
      onClose();
    };

    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={isVisible}
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select a Product</Text>
            <FlatList
              data={products}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.productItem}
                  onPress={() => handleSelectProduct(item)}
                >
                  <Text style={styles.productItemText}>{item.name}</Text>
                  <Text style={styles.productItemText}> ₹{item.price}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const OrderForm = () => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [gst, setGst] = useState('');
    const [selectedProducts, setSelectedProducts] = useState([]);
    // const [discount, setDiscount] = useState('5');
    const [cgst, setCgst] = useState('');
    const [sgst, setSgst] = useState('');
    const [igst, setIgst] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const navigation = useNavigation();
    const [searchText, setSearchText] = useState('');
    const [filteredNames, setFilteredNames] = useState([]);
    const [selectedName, setSelectedName] = useState('');
    const [selectedAddress, setSelectedAddress] = useState('');
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState({ id: '', name: '', address: '' });
    const [invoiceNumber, setInvoiceNumber] = useState('');
    const [initialInvoiceNumber, setInitialInvoiceNumber] = useState('');
  const [namesData, setNamesData] = useState([]);

    // States for manual entry
    const [manualName, setManualName] = useState('');
    const [manualAddress, setManualAddress] = useState('');
    const [manualInvoiceNumber, setManualInvoiceNumber] = useState('');
    const [remark, setRemark] = useState('');
    const [farm, setFarm] = useState('');
    // const [date, setDate] = useState(new Date());
    // const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [date, setDate] = useState('');
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
    useEffect(() => {
      let isMounted = true;

      const fetchNames = async () => {
        try {
          const response = await fetch('https://irisinformatics.net/harihara/wb/customers', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          const data = await response.json();
          console.log('data',data)
          if (isMounted) {
            if (data.status === '200') {
              const names = data.data.map(item => ({id: item.id, name: item.name, address: item.address }));
              setNamesData(names);
              setFilteredNames(names);
            } else {
              console.error('Error fetching names and addresses:', data.message);
            }
          }
        } catch (error) {
          if (isMounted) {
            console.error('Error fetching names and addresses:', error);
          }
        }
      };

      fetchNames();

      return () => {
        isMounted = false;
      };
    }, []);

    const [isFilteredNamesVisible, setIsFilteredNamesVisible] = useState(false);

  
    const filterNames = (text) => {
      setSearchText(text);
          setIsFilteredNamesVisible(text.trim() !== ''); 
      if (text.trim() === '') {
        setFilteredNames(namesData);
      } else {
        const filtered = namesData.filter((item) =>
          item.name.toLowerCase().includes(text.toLowerCase())
        );
        setFilteredNames(filtered);
      }
    };
    const updateInvoiceNumbers = (startInvoiceNumber) => {
      const updatedItems = selectedItems.map((item, index) => ({
        ...item,
        invoiceNumber: (parseInt(startInvoiceNumber, 10) + index).toString()
      }));
      setSelectedItems(updatedItems);
    };

    useEffect(() => {
      if (initialInvoiceNumber) {
        updateInvoiceNumbers(initialInvoiceNumber);
      }
    }, [initialInvoiceNumber]);

    const handleCheckboxChange = (item) => {
      const index = selectedItems.findIndex(selectedItem => selectedItem.name === item.name);
    
      let updatedItems;
      if (index > -1) {
        // Remove the item
        updatedItems = selectedItems.filter(selectedItem => selectedItem.name !== item.name);
      } else {
        // Add the item with the next invoice number
        updatedItems = [...selectedItems, { ...item, invoiceNumber: '' }];
      }
    
      // Reassign invoice numbers
      updatedItems = updatedItems.map((updatedItem, idx) => ({
        ...updatedItem,
        invoiceNumber: (parseInt(initialInvoiceNumber, 10) + idx).toString(),
      }));
    
      setSelectedItems(updatedItems);
    };
    


    const calculateTotalCost = () => {
      let totalCost = 0;
      selectedProducts.forEach((product) => {
        const productPrice = product.price || 0;
        const productQuantity = product.quantity || 0;
        const productTotalPrice = productPrice * productQuantity;
    
        if (product.igst) {
          const igstAmount = productTotalPrice * (product.igst / 100);
          totalCost += productTotalPrice + igstAmount;
        } else {
          const cgstAmount = productTotalPrice * (product.cgst / 100);
          const sgstAmount = productTotalPrice * (product.sgst / 100);
          totalCost += productTotalPrice + cgstAmount + sgstAmount;
        }
      });
      return totalCost;
    };

    const totalCost = calculateTotalCost();
    const cgstAmount = Number((totalCost * (cgst / 100)).toFixed(2));
    const sgstAmount = Number((totalCost * (sgst / 100)).toFixed(2));
    const igstAmount = Number((totalCost * (igst / 100)).toFixed(2));
    // const discountAmount = Number((totalCost * (discount / 100)).toFixed(2));
    // const grandTotal = Number((totalCost + parseFloat(igstAmount || cgstAmount + sgstAmount) - parseFloat(discountAmount)).toFixed(2));
    const grandTotal = Number((calculateTotalCost()));

    const handleConfirm = () => {
      if (selectedItems.length === 0 ) {
        Alert.alert('Validation Error', 'Please select at least one customer or fill in the required fields (Name, Address, Invoice Number).');
        return;
      }
      if (!initialInvoiceNumber ) {
        Alert.alert('Validation Error', 'Please enter an invoice number for all selected customers.');
        return;
      }
      
      if (selectedProducts.length === 0) {
        Alert.alert('Validation Error', 'Please add at least one product.');
        return;
      }

      const orderData = {
        customers: selectedItems.map((item) => ({ id: item.id })),
        name: name,
        address:address,
        gst: gst,
        bill_date:date,
        invoice_start: initialInvoiceNumber,
        remarks: remark,
        items: selectedProducts.map((product) => ({
          item_id: product.id,
          qty: product.quantity || 1,
        })),
      };
    
      submitOrder(orderData);
      console.log('order data',orderData)
    };
      // console.log("user data",handleConfirm)
      // console.log('order data', JSON.stringify(orderData, null, 2)); // Log the orderData object

      // Navigate to the BillingPage and pass the orderData as params
      // navigation.navigate('Billing', { orderData });
 
    const submitOrder = async (orderData) => {
      try {
        const response = await fetch('https://irisinformatics.net/harihara/wb/add_bill', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(
           orderData),
        });
    
        const data = await response.json();
        console.log('response', data); 
    
        if (data.status === '200') {
          Alert.alert('Success', 'Order has been submitted successfully!');
          // navigation.navigate('WebViewScreen', { link: data.data.link });
          // // Open the link in the default web browser
          // Linking.openURL(data.data.link).catch((err) => {
          //   console.error('Failed to open link:', err);
          //   Alert.alert('Error', 'Failed to open the link.');
          // });
          try {
            await Share.share({
              message: `Order has been submitted successfully! Here is the link: ${data.data.link }`,
            });
          } catch (error) {
            console.error('Error sharing link:', error);
          }
        } else {
          console.error('Error submitting order:', data.message);
          Alert.alert('Error', `Failed to submit the order: ${data.message}`);
        }
      } catch (error) {
        console.error('Error submitting order:', error);
        Alert.alert('Error', 'An error occurred while submitting the order.');
      }
    };
    

    const handleQuantityChange = (productId, quantityChange) => {
      setSelectedProducts((prevProducts) => {
        return prevProducts.map((product) => {
          if (product.id === productId) {
            const newQuantity = (product.quantity || 0) + quantityChange;
            const updatedQuantity = Math.max(0, newQuantity);
            const totalPrice = updatedQuantity * product.price * (updatedQuantity > 0 );
            const cgstAmount = (totalPrice * (product.cgst / 100)).toFixed(2);
            const sgstAmount = (totalPrice * (product.sgst / 100)).toFixed(2);
            return {
              ...product,
              quantity: updatedQuantity,
              totalPrice,
              cgstAmount,
              sgstAmount,
              
            };
          }
          return product;
        });
      });
    };

    const toggleModal = () => {
      setIsModalVisible(!isModalVisible);
    };
    const onSelectProduct = (product) => {
      setSelectedProducts((prevProducts) => {
        const existingProductIndex = prevProducts.findIndex(
          (p) => p.id === product.id
        );
    
        if (existingProductIndex !== -1) {
          // Product already exists, increment the quantity
          const updatedProducts = [...prevProducts];
          const newQuantity = (updatedProducts[existingProductIndex].quantity || 0) ;
          updatedProducts[existingProductIndex] = {
            ...updatedProducts[existingProductIndex],
            quantity: newQuantity,
            totalPrice: newQuantity * product.price,
          };
          return updatedProducts;
        } else {
          // Product doesn't exist, add it with quantity 1
          const newProduct = {
            ...product,
            quantity: 1,
            totalPrice: product.price,
            cgst: product.cgst,
            sgst: product.sgst,
          };
          return [...prevProducts, newProduct];
        }
      });
    };




    const handleDeleteProduct = (productId) => {
      setSelectedProducts(prevProducts => {
        return prevProducts.filter(product => product.id !== productId);
      });
    };

  
        // const handleDiscountChange = (text) => {
        // const value = text.trim() === '' ? '' : parseFloat(text);
        // if (!isNaN(value)) {
        // setDiscount(value);
        // }
        // };


        const handleAddManualCustomer = () => {
          navigation.navigate('CustomerForm');

        }


    

        const showCalendar = () => {
          setIsCalendarVisible(true);
        };
      
        const hideCalendar = () => {
          setIsCalendarVisible(false);
        };
      
        const handleDayPress = (day) => {
          setDate(formatDate(day.dateString));
          hideCalendar();
        };
      
        const formatDate = (dateString) => {
          const [year, month, day] = dateString.split('-');
          return `${day}-${month}-${year}`;
        };
      
        return (
          <PaperProvider>
        <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Order Form</Text>

  <Text style={styles.label}>Selected Customers:</Text>
        {selectedItems.length > 0 && (
          <View style={styles.selectedContainer}>
            {selectedItems.map((item, index) => (
              <View key={index} style={styles.selectedItem}>
                   {/* <Text style={{}}>{item.id}</Text> */}
                <Text style={styles.selectedText}>{item.name}</Text>
                <Text style={styles.selectedText}>{item.address}</Text>
             
                <Text style={styles.selectedText}>Invoice No: {item.invoiceNumber}</Text>
              </View>
            ))}
                
          </View>
        )}
  <Text style={styles.label}>Date</Text>
          <TouchableOpacity onPress={showCalendar} style={styles.datePickerButton}>
            <Text style={styles.datePickerText}>{date || 'Select Date'}</Text>
          </TouchableOpacity>
          <Modal visible={isCalendarVisible} animationType="slide" transparent={true}>
            <View style={styles.modalContainer}>
              <Calendar
                onDayPress={handleDayPress}
                markedDates={{
                  [date]: { selected: true, marked: true, selectedColor: 'blue' },
                }}
              />
              <Button title="Close" onPress={hideCalendar} />
            </View>
          </Modal>

      
        <Text style={styles.label}>Customer</Text>
      
      <View style={styles.manualEntryContainer}>
      
          <TextInput
    style={styles.input}
    value={searchText || manualName} // Use either searchText or manualName based on their availability
    onChangeText={(text) => {
      
      filterNames(text); // Call filterNames function to filter names
      setManualName(text); // Set manualName state with the entered text
    }}
    onFocus={() => setIsFilteredNamesVisible(true)}
    // onBlur={() => setIsFilteredNamesVisible(false)}
    placeholder="Enter customer"
  />
  {isFilteredNamesVisible && (
          <ScrollView style={styles.filteredNamesContainer}>
            <Text style={{ color: 'black' }}>Select customer names:</Text>
            
            {filteredNames.length > 0 && (
                <TouchableOpacity 
                style={styles.doneButton} 
                onPress={() => setIsFilteredNamesVisible(false)}
              >
                <Text style={styles.doneButtonText}>Done</Text>
              </TouchableOpacity>
            )}

    {filteredNames.length === 0 ? (
          <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>No data found</Text>
          <Button style={{borderRadius:20}} title="Add Customer" onPress={handleAddManualCustomer} />
        </View>
        ) : (
          filteredNames.map((item, index) => (
            <View style={{ gap: 2 }} key={index}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3, marginBottom: 3 }}>
                <View style={{ borderWidth: 1 }}>
                  <CheckBox
                    value={selectedItems.some(selectedItem => selectedItem.name === item.name)}
                    onValueChange={() => handleCheckboxChange(item)}
                  />
                </View>
                <Text style={{ color: 'black', padding: 5 }}>{item.name}</Text>
              </View>
            </View>
          ))
        )}
          
          </ScrollView>
        )}



  <Text style={styles.label}>Invoice Number</Text>
        <TextInput
          style={styles.input}
          value={initialInvoiceNumber || manualInvoiceNumber}
          onChangeText={(text) => {
            const numericText = text.replace(/[^0-9]/g, ''); 
            setInitialInvoiceNumber(numericText);
            setManualInvoiceNumber(numericText);
          }}
          placeholder="Enter invoice number"
          keyboardType="numeric"/>


<View style={styles.inputContainer}>
        <Text style={styles.label}>Name:</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={(text) => setName(text)}
          placeholder="Enter Name"
        />
      </View>



  <Text style={styles.label}>Remarks</Text>
        <TextInput
          style={styles.input}
          value={remark}
          onChangeText={setRemark}
          placeholder="Enter Reference"
        />

        <Text style={styles.label}>Address</Text>
           <TextInput
          style={styles.input}
          placeholder="Address"
          value={address}
          onChangeText={setAddress}
        />
          <Text style={styles.label}>GST</Text>
        <TextInput
          style={styles.input}
          placeholder="GST"
          value={gst}
          onChangeText={setGst}
        />

     


      

      {/* <Text style={styles.label}>Invoice Number:</Text>
            <TextInput
    style={styles.input}
    value={ manualInvoiceNumber} // Use either initialInvoiceNumber or manualInvoiceNumber based on their availability
    onChangeText={(text) => {
      setInitialInvoiceNumber(text); // Set initialInvoiceNumber state with the entered text
      setManualInvoiceNumber(text); // Set manualInvoiceNumber state with the entered text
    }}
    placeholder="Manual Invoice Number"
  /> */}

        
        </View>
     
     
      
    <Text style={styles.heading}>Select Products</Text>
    {selectedProducts.map((product) => (
      <View key={product.id} style={styles.productContainer}>
        <Text style={styles.productName}numberOfLines={1}>{product.name}</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity onPress={() => handleQuantityChange(product.id, -1)}>
            <Text style={{ color: 'black', fontSize: 30, width: 10 }}>-</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.quantityInput}
            keyboardType="numeric"
            editable={false}
            value={(product.quantity || 0).toString()}
            onChangeText={(text) => {
              setSelectedProducts((prevProducts) => {
                return prevProducts.map((prevProduct) => {
                  if (prevProduct.id === product.id) {
                    return { ...prevProduct, quantity: text };
                  }
                  return prevProduct;
                });
              });
            }}
          />
          <TouchableOpacity
            style={{ color: 'black' }}
            onPress={() => handleQuantityChange(product.id, 1)}
          >
            <Text style={{ color: 'black', fontSize: 20, width: 20 }}>+</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.productPrice}> ₹{product.totalPrice}</Text>
        {/* <View style={styles.taxContainer}>
          <Text style={styles.taxLabel}>CGST: ₹{product.cgstAmount}</Text>
          <Text style={styles.taxLabel}>SGST: ₹{product.sgstAmount}</Text>
        </View> */}
        <TouchableOpacity onPress={() => handleDeleteProduct(product.id)}>
          <Image source={require('./delete.png')} style={styles.deleteIcon} />
        </TouchableOpacity>
      </View>
    ))}

    <View style={styles.addProductContainer}>
      <Button title="Add More Product" onPress={toggleModal} />
    </View>

    <View style={styles.totalContainer}>



    <ScrollView horizontal showsHorizontalScrollIndicator={true} style={{ width: '100%', height: 'auto' }}>
    <View style={{ }}>
      {selectedProducts.map((product) => (
        <View key={product.id} style={[styles.productselectContainer, { width: 'auto' }]}>
          <Text style={styles.productNames} numberOfLines={1} >{product.name}</Text>
          {product.igst ? (
            <>
            <View style={{display:'flex',flexDirection:'row',width:190,padding:6}}> 
              <Text style={styles.taxLabel}>IGST:</Text>
              {/* <TextInput
                style={[styles.editableInput]}
                value={product.igst.toString()}
                onChangeText={(text) => handleCgstSgstChange(text, 'igst', product.id)}
                keyboardType="numeric"
              /> */}
                <Text style={{fontSize:13,color:'black'}}> {product.igst} </Text>
              <Text style={styles.taxLabel}>% </Text>
              </View>
            
              <Text style={styles.productPrice}>
                ₹{((product.totalPrice || product.price) * (1 + product.igst / 100)).toFixed(2)}
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.taxLabel}>CGST: </Text>
              {/* <TextInput
                style={[styles.editableInput]}
                value={product.cgst.toString()}
                onChangeText={(text) => handleCgstSgstChange(text, 'cgst', product.id)}
                keyboardType="numeric"
              /> */}
              <Text   style={[styles.editableInput]}>{product.cgst} </Text>
              <Text style={styles.totalLabel}>% </Text>
              <Text style={styles.taxLabel}> SGST:</Text>
              {/* <TextInput
                style={[styles.editableInput]}
                value={product.sgst.toString()}
                onChangeText={(text) => handleCgstSgstChange(text, 'sgst', product.id)}
                keyboardType="numeric"
              /> */}
                <Text   style={[styles.editableInput]}> {product.sgst} </Text>
              <Text style={styles.totalLabel}>% </Text>
              <Text style={styles.productPrice}>
                ₹{((product.totalPrice || product.price) * (1 + (product.cgst / 100) + (product.sgst / 100))).toFixed(2)}
              </Text>
            </>
          )}
        </View>
      ))}
    </View>
  </ScrollView>
  <Text style={styles.totalLabel}>Total Cost: ₹{Number(totalCost).toFixed(2)}</Text>
          {/* <View style={styles.editableContainer}> */}
            {/* <Text style={styles.totalLabel}>Discount (</Text>
            <TextInput
              style={[styles.editableInput]}
              value={discount.toString()}
              onChangeText={handleDiscountChange}
              keyboardType="numeric"
            />
            <Text style={styles.totalLabel}>%): ₹{discountAmount}</Text>
          </View> */}

        
          {/* <Text style={styles.grandTotal}>Grand Total: ₹{grandTotal}</Text> */}
          <Text style={styles.grandTotal}>Grand Total: ₹{grandTotal.toFixed(2)}</Text>

        </View>

    <Button title="Confirm" onPress={handleConfirm} />

    <ProductModal
      isVisible={isModalVisible}
      onClose={toggleModal}
      onSelectProduct={onSelectProduct}
    />
  </ScrollView>
  </PaperProvider>
  );
  };
  const styles = StyleSheet.create({
  container: {
  backgroundColor: '#fff',
  color: 'black',
  flexGrow: 1,
  padding: 16,
  },
  heading: {
  fontSize: 20,
  fontWeight: 'bold',
  marginVertical: 10,
  color: 'black',
  },
  label: {
  fontSize: 16,
  color: 'black',
  marginVertical: 5,
  },
  input: {
  color: 'black',
  borderWidth: 1,
  borderColor: 'gray',
  borderRadius: 5,
  padding: 10,
  marginBottom: 10,
  },
  productContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginVertical: 5,
  // margin:2,
  padding:5,
  borderBottomWidth:1,
  // marginBottom:10

  },
  productselectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    // margin:2,
    // padding:5,
    borderBottomWidth:1,
    // marginBottom:10

    
    },
  productName: {
  flex: 1,

  // width:160,
  color: 'black',
  fontSize: 14,
  },
  productNames: {
    // flex: 1,
    width:160,
    color: 'black',
    fontSize: 14,
    },
  quantityContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  color: 'black',
  marginHorizontal: 10,
  },
  quantityInput: {
  color: 'black',
  borderWidth: 1,
  borderColor: 'gray',
  borderRadius: 5,
  padding: 5,
  marginHorizontal: 5,
  width: 50,
  textAlign: 'center',
  },
  productPrice: {
  color: 'black',
  fontSize: 14,
  },
  totalContainer: {
  color: 'black',
  marginVertical: 10,
  padding: 10,
  borderWidth: 1,
  borderColor: 'gray',
  borderRadius: 5,
  },
  totalLabel: {
  color: 'black',
  // borderBottomWidth:1,
  fontSize: 16,
  display:'flex',
  textAlign:'right',
  marginVertical: 2,
  },
  grandTotal: {
  color: 'black',
  fontSize: 18,
  fontWeight: 'bold',
  marginTop: 5,
  },
  addProductContainer: {
  color: 'black',
  marginVertical: 10,
  marginTop: 30,
  },
  datePickerButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#ddd',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  datePickerText: {
    fontSize: 16,
    color: '#000',
  },
  // modalContainer: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: 'rgba(0, 0, 0, 0.5)',
  // },
  modalContainer: {
  flex: 1,
  color: 'black',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
  color:'black',
  backgroundColor: 'white',
  padding: 20,
  borderRadius: 10,
  width: '80%',
  maxHeight: '80%',
  },
  modalTitle: {
  color: 'black',
  fontSize: 18,
  fontWeight: 'bold',
  marginBottom: 10,
  },
  productItem: {
  color: 'black',
  paddingVertical: 10,
  borderBottomWidth: 1,
  borderBottomColor: 'lightgray',
  },
  closeButton: {
  color: 'black',
  marginTop: 10,
  paddingVertical: 10,
  backgroundColor: 'lightgray',
  borderRadius: 5,
  alignItems: 'center',
  },
  closeButtonText: {
  color: 'black',
  fontSize: 16,
  },
  deleteIcon: {
  marginLeft: 10,
  color: 'black',
  width: 20,
  height: 20,
  tintColor: 'grey',
  }, 
  noDataContainer: {
    flex: 1,
    // width:160,
    
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  noDataText: {
    fontSize: 18,
    marginBottom: 10,
    marginTop:10,
    color: 'red',
    textAlign:'center'
  },
  productItemText: {
  color: 'black',
  },
  editableContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  },
  editableInput: {
    color:'black',
  textAlign: 'center',
  },
  taxContainer: {
  flexDirection: 'column',
  marginHorizontal: 10,
  },
  taxLabel: {
  color: 'black',
  fontSize: 12,
  // margin:10
  },
  selectedContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
  },
  selectedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  selectedText: {
    color: 'black',
  },
  doneButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    width:130,
    marginTop:10,
    marginBottom:10,
    // alignItems:'center',
    // left:100,
    textAlign:'center'

  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign:'center'

  },

  });
  export default OrderForm;    