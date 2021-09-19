
import React, { Component } from 'react';
import { View, Image, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  stretch: {
    width: 50,
    height: 200,
    resizeMode: 'stretch'
  }
});

class Logo extends Component {
  render() {
    return (
      <View>
        <Image
          style={{ width: 200, height: 200 }}
          source={require('../Images/Logo.png') }
        />
      </View>
    );
  }
}

export default Logo;