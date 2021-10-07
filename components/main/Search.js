import React, { useState } from 'react'
import { View, Text,StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/FontAwesome';
import firebase from 'firebase';
require('firebase/firestore');

export default function Search(props) {
    const [users, setUsers] = useState([])

    const fetchUsers = (search) => {
        firebase.firestore()
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
        <SafeAreaView
        style={{ flex: 1,marginTop:20, justifyContent: 'space-between', alignItems: 'center' }}
          >
            <FlatList
                numColumns={1}
                horizontal={false}
                data={users}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => props.navigation.navigate("Profile", {uid: item.id})}>
                        <Text>{item.name}</Text>
                    </TouchableOpacity>

                )}
            />
            <View style={styles.Search}>
                <TextInput
                    placeholder="Search"
                    style={styles.Search}
                    onChangeText={(search) => fetchUsers(search)} 
                    leftIcon={{ type: 'font-awesome', name: 'search'}}/>
            </View>



        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    Search:{
        width: '70%',
        borderRadius:26,
        color:'white',
      }
})