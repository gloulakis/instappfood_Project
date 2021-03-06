import React, { Component } from 'react';

import { View, Text } from 'react-native'

import firebase from 'firebase/app';

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk'
const store = createStore(rootReducer, applyMiddleware(thunk))

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LandingScreen from './components/auth/Landing'
import RegisterScreen from './components/auth/Register'
import LoginScreen from './components/auth/Login'
import MainScreen from './components/Main'
import AddScreen from './components/main/Add'
import SaveScreen from './components/main/Save'
import CommentScreen from './components/main/Comment'
import InfoScreen from './components/main/ShowInfo';

const firebaseConfig = {
  apiKey: "AIzaSyDdR7D_W6JqxyDD-FGSEhhaw8mNpo-NibU",
  authDomain: "instappfood.firebaseapp.com",
  databaseURL: "https://instappfood-default-rtdb.firebaseio.com",
  projectId: "instappfood",
  storageBucket: "instappfood.appspot.com",
  messagingSenderId: "492271644212",
  appId: "1:492271644212:web:d58de0e3abab725d3b2461",
  measurementId: "G-ZSER294L9P"
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}




const Stack = createStackNavigator();


export class App extends Component {
  constructor(props) {
    super()
    this.state = {
      loaded: false,
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true,
        })
      } else {
        this.setState({
          loggedIn: true,
          loaded: true,
        })
      }
    })
  }
  render() {

    const { loggedIn, loaded } = this.state;
    if (!loaded) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text></Text>
        </View>
      )
    }

    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
          </Stack.Navigator>
        </NavigationContainer>
      );
    }

    return (
      <Provider store={store}>
        <NavigationContainer >
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="Add" component={AddScreen} navigation={this.props.navigation} options={{ headerShown: false }}/>
            <Stack.Screen name="Save" component={SaveScreen} navigation={this.props.navigation} options={{ headerShown: false }}/>
            <Stack.Screen name="Comment" component={CommentScreen} navigation={this.props.navigation} options={{ headerShown: false }}/>
            <Stack.Screen name="ShowInfo" component={InfoScreen} navigation={this.props.navigation} options={{ headerShown: false }}/>
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}

export default App