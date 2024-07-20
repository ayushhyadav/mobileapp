import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, PermissionsAndroid, Linking, TouchableOpacity, TextInput } from 'react-native';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

export default function App({ route }) {
  const { orderData } = route.params;
  const [hasPermission, setHasPermission] = useState(false);
  const [directory, setDirectory] = useState('');
  const [showDirectoryInput, setShowDirectoryInput] = useState(false);

  useEffect(() => {
    requestWritePermission();
  }, []);

  const formatDate = (date) => {
    const d = new Date(date);
    let day = d.getDate();
    let month = d.getMonth() + 1;
    const year = d.getFullYear();

    if (day < 10) {
      day = `0${day}`;
    }
    if (month < 10) {
      month = `0${month}`;
    }

    return `${day}-${month}-${year}`;
  };

  const generateRandomInvoiceNumber = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };

  const requestWritePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'This app needs access to your storage to save PDF files.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      console.log('Write permission granted:', granted);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setHasPermission(true);
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        // Guide the user to app settings
        Alert.alert(
          'Permission Required',
          'Please enable storage access in app settings to save PDF files.',
          [
            {
              text: 'Cancel',
              onPress: () => console.log('Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'Open Settings',
              onPress: () => Linking.openSettings(),
            },
          ],
          { cancelable: false }
        );
        setHasPermission(false);
      } else {
        setHasPermission(false);
      }
    } catch (err) {
      console.warn(err);
      setHasPermission(false);
    }
  };

  const createPDF = async () => {
    if (!hasPermission) {
      await requestWritePermission();
      return;
    }

    const currentDate = formatDate(new Date());

    try {
      let htmlContent = `
        <html>
          <head>
            <style>
              body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
        }
        .invoice {
            border: 1px solid #000;
            padding: 10px;
            max-width: 800px;
            margin: 0 auto;
        }
        h1 {
            text-align: center;
            margin: 0 0 10px 0;
        }
        .header {
        border: 1px solid #000;
            display: flex;
            justify-content: space-between;
        }
        .seller, .invoice-details {
            width: 48%;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th, td {
            border: 1px solid #000;
            padding: 5px;
            text-align: left;
        }
        .buyer {
            margin-top: 10px;
        }
            </style>
          </head>
          <body>
      `;

      for (let i = 0; i < orderData.selectedItems.length; i++) {
        const item = orderData.selectedItems[i];
        htmlContent += `
          <div class="invoice">
        <h1>Tax Invoice</h1>
        <div class="header">
            <div class="seller">
                <strong>${item.farm}</strong><br>
                ${item.address}
            </div>
            <div class="invoice-details">
                <table>
                    <tr>
                        <th>Invoice No.</th>
                        <th>Dated</th>
                    </tr>
                    <tr>
                        <td> ${item.invoiceNumber}</td>
                        <td>${currentDate}</td>
                    </tr>
                    <tr>
                        <th>Delivery Note</th>
                        <th>Mode/Terms of Payment</th>
                    </tr>
                    <tr>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <th>Reference No. & Date</th>
                        
                    </tr>
                    <tr>
                        <td>${item.reference}</td>
                        <td></td>
                    </tr>
                </table>
            </div>
        </div>
        <table>
            <tr>
                <th>Consignee (Ship to)</th>
                <th>Buyer's Order No.</th>
                <th>Dated: ${currentDate}</th>
            </tr>
            <tr>
                <td>Cash</td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <th></th>
                <th>Dispatch Doc No.</th>
                <th>Delivery Note Date</th>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <th></th>
                <th>Dispatched through</th>
                <th>Destination</th>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
            </tr>
            <tr>
                <th></th>
                <th>Terms of Delivery</th>
                <th></th>
            </tr>
            <tr>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        </table>
        <div class="buyer">
            <strong>Buyer (Bill to)</strong><br>
            ${item.name}<br>
          
        </div>
          <div class="section">
              <table class="table">
                <tr class="tableRow">
                  <th class="tableCell headerCell">Sl No.</th>
                  <th class="tableCell headerCell">Product</th>
                  <th class="tableCell headerCell">Price</th>
                  <th class="tableCell headerCell">Quantity</th>
                  <th class="tableCell headerCell">Tax</th>
                  <th class="tableCell headerCell">Tax Amount</th>
                  <th class="tableCell headerCell">Total</th>
                </tr>
                ${item.selectedProducts.map((product, index) => `
                  <tr class="tableRow" key="${product.id}">
                    <td class="tableCell">${index + 1}</td>
                    <td class="tableCell">${product.name}</td>
                    <td class="tableCell">${parseFloat(product.price).toFixed(2)}</td>
                    <td class="tableCell">${product.quantity} ${product.unit}</td>
                    ${parseFloat(product.igst) > 0 ? `
                      <td class="tableCell">Igst: ${parseFloat(product.igst).toFixed(2)} %</td>
                      <td class="tableCell">${(product.price * (product.igst / 100)).toFixed(2)}</td>
                    ` : `
                      <td class="tableCell">Cgst:${parseFloat(product.cgst).toFixed(2)} % / Sgst: ${parseFloat(product.sgst).toFixed(2)} %</td>
                      <td class="tableCell">${((product.price * (product.cgst / 100)) + (product.price * (product.sgst / 100))).toFixed(2)}</td>
                    `}
                    <td class="tableCell">${(parseFloat(product.totalPrice) + (parseFloat(product.igst) > 0 ? (product.price * (product.igst / 100)) : ((product.price * (product.cgst / 100)) + (product.price * (product.sgst / 100))))).toFixed(2)}</td>
                  </tr>
                `).join('')}
                <tr class="tableRow">
                  <td class="tableCell"></td>
                  <td class="tableCell"></td>
                  <td class="tableCell"></td>
                  <td class="tableCell"></td>
                  <td class="tableCell"></td>
                  <td class="tableCell">Total:</td>
                  <td class="tableCell">${parseFloat(item.grandTotal).toFixed(2)}</td>
                </tr>
              </table>
            </div>
  
            <div class="section">
              <div>Remarks: ${item.remark}</div>
              <div>Declaration: We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</div>
            </div>
  
            <div class="section">
              <div>for ${item.farm}</div>
              <div>Authorised Signatory</div>
            </div>
          </div>
       
    </div>
           <div style="page-break-before: always;"></div>
            
  
          
        `;
      }
  
      htmlContent += `
          </body>
        </html>
      `;
  
      const options = {
        html: htmlContent,
        fileName: `tax_invoice_${generateRandomInvoiceNumber()}`,
        directory: directory || 'Documents',
      };
  
      const file = await RNHTMLtoPDF.convert(options);
      console.log(file.filePath);
      Alert.alert('PDF Created', `PDF has been created and saved to: ${file.filePath}`,
        [
          {
            text: 'Open PDF',
            onPress: () => Linking.openURL(`file://${file.filePath}`),
          },
          {
            text: 'Download PDF',
            onPress: async () => {
              const url = `file://${file.filePath}`;
              const supported = await Linking.canOpenURL(url);
              if (supported) {
                await Linking.openURL(url);
              } else {
                Alert.alert('Error', 'Cannot download PDF on this device.');
              }
            },
          },
        ]
      );
      
    } catch (error) {

      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'An error occurred while generating the PDF.');

    }
  };

  
  const currentDate = formatDate(new Date());

  return (
    <ScrollView style={styles.container}>
   {orderData.selectedItems.map((item, index) =>(

<View key={index} style={styles.invoiceContainer}>
<Text style={styles.title}>Tax Invoice</Text>

<View style={styles.section}>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.text}>{item.name}</Text>
                <Text style={styles.text}>{item.address}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.text}>Invoice No.: {item.invoiceNumber}</Text>
                <Text style={styles.text}>Date: {currentDate}</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.text}>Consignee (Ship to)</Text>
                <Text style={styles.text}>Cash</Text>
                <Text style={styles.text}>State Name: Madhya Pradesh, Code: 23</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.text}>Buyer's Order No.</Text>
                <Text style={styles.text}>Date: {currentDate}</Text>
                <Text style={styles.text}>Dispatch Doc No.</Text>
                <Text style={styles.text}>Delivery Note Date</Text>
                <Text style={styles.text}>Dispatched through</Text>
                <Text style={styles.text}>Destination</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.text}>Buyer (Bill to):-  test</Text>
                {/* <Text style={styles.text}></Text>  */}
                {/* <Text style={styles.text}>Buyer</Text> */}
                <Text style={styles.text}>Buyer State Name: Madhya Pradesh, Code: 23</Text>
              </View>
            </View>
          </View>

<ScrollView horizontal showsHorizontalScrollIndicator={true}>
  <View style={styles.table}>
    <View style={styles.tableRow}>
      <Text style={[styles.tableCell, styles.headerCell]}>Sl No.</Text>
      <Text style={[styles.tableCell, styles.headerCell]}>Product</Text>
      <Text style={[styles.tableCell, styles.headerCell]}>Price</Text>
      <Text style={[styles.tableCell, styles.headerCell]}>Quantity</Text>
      <Text style={[styles.tableCell, styles.headerCell]}>Tax</Text>
      <Text style={[styles.tableCell, styles.headerCell]}>Tax Amount</Text>
      <Text style={[styles.tableCell, styles.headerCell]}>Total</Text>
    </View>
    {item.selectedProducts.map((product, index) => {
      const cgstAmount = product.price * (product.cgst / 100);
      const sgstAmount = product.price * (product.sgst / 100);
      const igstAmount = product.price * (product.igst / 100);
      const taxAmount = parseFloat(product.igst) > 0 ? igstAmount : (cgstAmount + sgstAmount);
      const totalAmount = parseFloat(product.totalPrice) + taxAmount;

      return (
        <View style={styles.tableRow} key={product.id}>
          <Text style={styles.tableCell}>{index + 1}</Text>
          <Text style={styles.tableCell}>{product.name}</Text>
          <Text style={styles.tableCell}>{parseFloat(product.price).toFixed(2)}</Text>
          <Text style={styles.tableCell}>{product.quantity} {product.unit}</Text>
          {parseFloat(product.igst) > 0 ? (
            <>
              <Text style={styles.tableCell}>{parseFloat(product.igst).toFixed(2)} %</Text>
              <Text style={styles.tableCell}>{igstAmount.toFixed(2)}</Text>
            </>
          ) : (
            <>
          <View>
          <Text style={styles.tableCell}>{parseFloat(product.cgst).toFixed(2)} %</Text>
              <Text style={styles.tableCell}>{parseFloat(product.sgst).toFixed(2)} %</Text>
          </View>
              <Text style={styles.tableCell}>{(cgstAmount + sgstAmount).toFixed(2)}</Text>
            </>
          )}
          <Text style={styles.tableCell}>{totalAmount.toFixed(2)}</Text>
        </View>
      );
    })}

    <View style={styles.tableRow}>
      <Text style={styles.tableCell}></Text>
      <Text style={styles.tableCell}></Text>
      <Text style={styles.tableCell}></Text>
      <Text style={styles.tableCell}></Text>
      <Text style={styles.tableCell}>Total:</Text>
      <Text style={styles.tableCell}>{parseFloat(item.grandTotal).toFixed(2)}</Text>
    </View>
 
  </View>
</ScrollView>

{/* <View style={styles.section}>
  <Text style={styles.text}>Amount Chargeable (in words)</Text>
  <Text style={styles.text}>INR One Thousand One Hundred Twenty-One Only</Text>
</View>

<View style={styles.section}>
  <Text style={styles.text}>Tax Amount (in words): INR Three Hundred Only</Text>
</View> */}

<View style={styles.section}>
  <Text style={styles.text}>Remarks: Note:
   {/* Transported via MP04XXXX */}
   {item.remark}
   </Text>
  <Text style={styles.text}>Declaration: We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</Text>
</View>

<View style={styles.section}>
  <Text style={styles.text}>for {item.farm}</Text>
  <Text style={styles.text}>Authorised Signatory</Text>
</View>



</View>
   ))}
   <View style={styles.section}>
<TouchableOpacity style={styles.button} onPress={createPDF}>
  <Text style={styles.buttonText}>Download to PDF</Text>
</TouchableOpacity>
</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color:'black'
  },
  section: {
    marginBottom: 20,
    color:'black',
    // alignItems:'center',
    // justifyContent:'center',
    
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    color:'black',
    marginBottom: 10,
    // alignItems:'center',
    // borderWidth:1,
    padding:10
  },
  column: {
    flex: 1,
    color:'black'
  },
  table: {
    borderWidth: 1,
    borderColor: '#000',
    color:'black'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000',
    color:'black'
  },
  tableCell: {
    flex: 1,
    padding: 5,
    borderRightWidth: 1,
    borderColor: '#000',
    width: 80,
    color:'black'
  },
  headerCell: {
    fontWeight: 'bold',
    color:'black'
  },
  text: {
    marginBottom: 5,
    color:'black'
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});