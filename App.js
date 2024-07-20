import React from 'react'; 
import { NavigationContainer } from '@react-navigation/native';
 import { createStackNavigator } from '@react-navigation/stack';
  import OrderForm from './Component/OrderForm';
   import ItemForm from './Component/ItemForm';
    import CustomerForm from './Component/CustomerForm'; 
import Home from './Component/Home';
import CustomerList from './Component/customerList';
import ItemList from './Component/ItemList';
import ToggleBarModal from './Component/Home';
import Itemupdate from './Component/Itemupdate';
import Customerupdate from './Component/Customerupdate';
import Billing from './Component/Billing';
import WebViewScreen from './Component/WebViewScreen';
    const Stack = createStackNavigator();
     const App = () => {
       return ( 
       <NavigationContainer> 
        <ToggleBarModal/>
        <Stack.Navigator>

        {/* <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} /> */}
           <Stack.Screen name="OrderForm" component={OrderForm} options={{ headerShown: false }} />
            <Stack.Screen name="ItemForm" component={ItemForm} options={{ headerShown: false }} />
             <Stack.Screen name="CustomerForm" component={CustomerForm} options={{ headerShown: false }} /> 
             <Stack.Screen name="CustomerList" component={CustomerList} options={{ headerShown: false }} /> 
             <Stack.Screen name="ItemList" component={ItemList} options={{ headerShown: false }} /> 
             <Stack.Screen name="Itemupdate" component={Itemupdate} options={{ headerShown: false }} /> 
             <Stack.Screen name="Customerupdate" component={Customerupdate} options={{ headerShown: false }} /> 
             <Stack.Screen name="Billing" component={Billing} options={{ headerShown: false }} /> 
             <Stack.Screen name="WebViewScreen" component={WebViewScreen} options={{ headerShown: false }} />
             </Stack.Navigator> 
             </NavigationContainer> 
             );
              };
              export default App;