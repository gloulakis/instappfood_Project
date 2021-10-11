import React, { Component } from 'react'
import {Image} from 'react-native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import firebase from 'firebase'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser, fetchUserPosts, fetchUserFollowing, clearData } from '../redux/actions/index'

import FeedScreen from './main/Feed'
import ProfileScreen from './main/Profile'
import SearchScreen from './main/Search'

import LottieView from 'lottie-react-native';

const Tab = createMaterialBottomTabNavigator();

const EmptyScreen = () => {
    return (null)
}

export class Main extends Component {
    componentDidMount() {
        this.props.clearData();
        this.props.fetchUser();
        this.props.fetchUserPosts();
        this.props.fetchUserFollowing();
        this.animation.play();
    }
    render() {
        return (
            <Tab.Navigator initialRouteName="Feed" 
            labeled={false}
            shifting={true}
            labeled={false}
            sceneAnimationEnabled={false}
            barStyle={{
                marginBottom:20,
                backgroundColor:'white'
            }}
            >
                <Tab.Screen name="Feed" component={FeedScreen}
                      options={{
                        tabBarIcon: ({ color }) => 
                        <LottieView
                            source={require('../assets/Lottie/BurgerProfile.json')}
                            ref={animation => {
                                this.animation = animation;
                              }}
                              style={{
                                width:60,
                                height:60,
                                alignItems:'flex-start',
                              }}
                            />
                       }}
                />

                <Tab.Screen name="Search" component={SearchScreen} navigation={this.props.navigation}
                    options={{
                        headerShown: false ,
                        tabBarIcon: () => (
                            <Image 
                                source={require('../assets/search.gif')}  
                                style={{
                                    width:60, 
                                    height:60,
                                    alignContent:'center',
                                    alignItems:'center'
                                }}
                            />
                        ),
                    }} />
                <Tab.Screen name="AddContainer" component={EmptyScreen}
                    listeners={({ navigation }) => ({
                        tabPress: event => {
                            event.preventDefault();
                            navigation.navigate("Add")
                        }
                    })}
                    options={{
                        tabBarIcon: () => (
                            <Image 
                                source={require('../assets/receipe.gif')}  
                                style={{
                                    width:60, 
                                    height:60,
                                    alignContent:'center',
                                    alignItems:'center'
                                }}
                            />
                        ),
                    }} />
               <Tab.Screen name="Profile" component={ProfileScreen} 
                listeners={({ navigation }) => ({
                    tabPress: event => {
                        event.preventDefault();
                        navigation.navigate("Profile", {uid: firebase.auth().currentUser.uid})
                    }})}
                    options={{
                        tabBarIcon: () => (
                            <Image 
                                source={require('../assets/profile.gif')}  
                                style={{
                                    width:60, 
                                    height:60,
                                }}
                            />
                        ),
                    }} />
            </Tab.Navigator>
        )
    }
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUser, fetchUserPosts, 
    fetchUserFollowing, clearData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Main);