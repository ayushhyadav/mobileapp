import React from 'react';
import { WebView } from 'react-native-webview';
import { View, StyleSheet } from 'react-native';

const WebViewScreen = ({ route }) => {
  const { link } = route.params;
console.log('link',link)
  return (
    <View style={styles.container}>
      <WebView style={{borderWidth:3}}  source={{ uri: link }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // borderWidth:2,
    color:'black'
  },
});

export default WebViewScreen;
