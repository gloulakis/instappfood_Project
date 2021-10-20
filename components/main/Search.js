import React, { useState } from 'react'
import { View,Image, Text,KeyboardAvoidingView,StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import firebase from 'firebase';
require('firebase/firestore');
import {BlackLogo} from '../main/BlackLogo'

export default function Search(props) {
    const [users, setUsers] = useState([])

    const fetchUsers = async (search) => {
        await firebase.firestore()
            .collection('users')
            .where('name', '>=', search)
            .get()
            .then((snapshot) => {
                let users = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return { id, ...data }
                });
                setUsers(users);
            })
    }
    return (
        <KeyboardAvoidingView style={styles.Screen} behavior="height">
            <BlackLogo/>
            <FlatList
                numColumns={1}
                horizontal={false}
                data={users}
                style={styles.List} 
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.userProfile}
                        onPress={() => props.navigation.navigate("Profile", {uid: item.id})}>
                     <View style={styles.rowContainer}>
                        <Image 
                            source={require('../Images/user.gif')}  
                            style={{
                                width:30, 
                                height:30,
                                borderRadius:40,
                                alignContent:'center',
                                alignItems:'center',
                                }}
                        />
                        <Text style={{padding:5,fontWeight:'800',color:'white'}}>{item.name}</Text> 
                     </View>
                      
                    </TouchableOpacity>
                )}
            />
            <View>
                <TextInput
                    style={styles.Search}
                    placeholder="Search"
                    onChangeText={(search) => fetchUsers(search)} 
                    leftIcon={{ type: 'font-awesome', name: 'search'}}/>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    Search:{
        width: 300,
        textAlign:'center',
        color:'black',
        fontWeight:'700',
        height: 50,
        marginBottom:'7%',
        borderRadius: 50,
        borderColor:'rgba(34, 49, 63, 1)',
        borderWidth:3,
        backgroundColor:'white',
      },
      Screen:{
        flex:1,
        marginTop:'6%',
        alignItems:'center',
        alignContent:'center',
        backgroundColor:'white'
      },
      List:{
          width:'100%',
          alignContent:'center',
          backgroundColor:'white'
      },
      userProfile:{
          flex:1,
          marginTop:30,
          backgroundColor:'#508FCC',
          height:50,
      },
      rowContainer: {
        flexDirection: 'row',
        alignItems:'stretch',
        padding: '2%'
    },
})