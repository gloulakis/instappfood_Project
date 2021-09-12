import { StatusBar } from 'expo-status-bar';
import React,{component} from 'react';
import firebase from 'firebase/app';
import { View,Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Component } from 'react';

import { Provider } from 'react-redux';
import { createStore,applyMiddleware} from 'redux'
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk'
const store = createStore(rootReducer,applyMiddleware(thunk))

import LandingScreen from './components/auth/Landing'
import RegisterScreen from './components/auth/Register'
import MainScreen from './components/Main'
import AddScreen from './components/main/Add'
import SaveScreen from './components/main/Save'

const firebaseConfig = {
  apiKey: "AIzaSyDq9NKaC2mkb9dlBiAVlY_cVHiuBBucAXE",
  authDomain: "instappfood.firebaseapp.com",
  projectId: "instappfood",
  storageBucket: "instappfood.appspot.com",
  messagingSenderId: "492271644212",
  appId: "1:492271644212:web:d58de0e3abab725d3b2461",
  measurementId: "G-ZSER294L9P"
};

if (firebase.apps.length ===0) {
  firebase.initializeApp(firebaseConfig);
  }



const Stack = createStackNavigator();

export class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      loaded:false,
    }
  }
  componentDidMount(){
    firebase.auth().onAuthStateChanged((user)=>{
      if(!user){
        this.setState({
          loggedIn:false,
          loaded:true,
        })
      }else{
        this.setState({
          loggedIn:true,
          loaded:true,
        })
      }
  })
}
  render() {
    const {loggedIn,loaded} = this.state;
  
    if(!loaded){
      return(
        <View style={{flex:1 , justifyContent:'center'}}>
          <Text>Loading</Text>
          </View>
      )
    }
    if(!loggedIn){
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName = "Landing">
            <Stack.Screen name = "Landing" component = {LandingScreen} options ={{headerShown : false}}/>
            <Stack.Screen name = "Register" component = {RegisterScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
       
      );
    }
    return(
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
            <Stack.Screen name ="Main" component = { MainScreen} options = {{headerShown: false}}/>
            <Stack.Screen name ="Add" component = { AddScreen} navigation={this.props.navigation}/>
            <Stack.Screen name ="Save" component = { SaveScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
      
    )
  }
}

export default App
