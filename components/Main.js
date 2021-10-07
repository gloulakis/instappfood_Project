import React, { Component } from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import firebase from 'firebase'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser, fetchUserPosts, fetchUserFollowing, clearData } from '../redux/actions/index'

import FeedScreen from './main/Feed'
import ProfileScreen from './main/Profile'
import SearchScreen from './main/Search'


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
    }
    render() {
        return (
            <Tab.Navigator initialRouteName="Feed" 
            labeled={false}
            shifting={true}
            labeled={false}
            sceneAnimationEnabled={false}
            activeColor="white"
            inactiveColor="#8E7C68"
            backgroundColor="black"
            barStyle={{ 
                backgroundColor: 'white',
                height:'8.8%',
                marginBottom:'0%',
                padding:'1%',
                borderColor: 'white',
                borderRadius:'30%',
                borderWidth:'4%',
                shadowColor:'black',
                shadowOpacity:0.2
            }}
            >
                <Tab.Screen name="Feed" component={FeedScreen}
                    options={{
                        headerShown: false ,
                        tabBarIcon: ({ color, size}) => (
                            <MaterialCommunityIcons name="chef-hat" color={color} size={27} />
                        ),
                    }} />
                <Tab.Screen name="Search" component={SearchScreen} navigation={this.props.navigation}
                    options={{
                        headerShown: false ,
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="magnify" color={color} size={27} />
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
                        headerShown: false ,
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="plus-box" color={color} size={27} />
                        ),
                    }} />
                <Tab.Screen name="Profile" component={ProfileScreen} 
                listeners={({ navigation }) => ({
                    tabPress: event => {
                        event.preventDefault();
                        navigation.navigate("Profile", {uid: firebase.auth().currentUser.uid})
                    }})}
                    options={{
                        headerShown: false ,
                        tabBarIcon: ({ color, size }) => (
                            <MaterialCommunityIcons name="account-circle" 
                            color={color} 
                            size={27} 
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