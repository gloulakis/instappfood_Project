import React, { useState } from 'react'
import { View, TextInput, Image, Button, StyleSheet,ScrollView, Keyboard } from 'react-native'
import { Card, Overlay, Icon } from 'react-native-elements'
import firebase from 'firebase'
import { NavigationContainer } from '@react-navigation/native'
require("firebase/firestore")
require("firebase/firebase-storage")


export default function Save(props) {
    const [title, setTitle] = useState("")
    const [products, setProducts] = useState("")
    const [instruction, setInstruction] = useState("")

    const uploadImage = async () => {
        const uri = props.route.params.image;
        const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;
        console.log(childPath)

        const response = await fetch(uri);
        const blob = await response.blob();

        const task = firebase
            .storage()
            .ref()
            .child(childPath)
            .put(blob);

        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }

        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                savePostData(snapshot);
                console.log(snapshot)
            })
        }

        const taskError = snapshot => {
            console.log(snapshot)
        }

        task.on("state_changed", taskProgress, taskError, taskCompleted);
    }

    const savePostData = (downloadURL) => {

        firebase.firestore()
            .collection('posts')
            .doc(firebase.auth().currentUser.uid)
            .collection("userPosts")
            .add({
                downloadURL,
                title,
                products,
                instruction,
                likesCount: 0,
                creation: firebase.firestore.FieldValue.serverTimestamp()
            }).then((function () {
                props.navigation.popToTop()
            }))
    }
    return (
        <View style={styles.SavePage}>
  
            <Card  style={styles.CardStyle} onPress={Keyboard.dismiss}>
            <Button  style={styles.ShareButton} title="Share" onPress={() => uploadImage()} />
                <TextInput
                    style={styles.inputTitle}
                    placeholder="Title"
                    onChangeText={(title) => setTitle(title)}
                />
                <TextInput
                    style={styles.multiline}
                    placeholder="Products"
                    multiline={true}
                    numberOfLines={3}
                    placeholder="Ingredients"
                    underlineColorAndroid='transparent'
                    require={true}
                    onChangeText={(products) => setProducts(products)}
                />
                <TextInput
                    style={styles.multiline}
                    placeholder="Instruction"
                    multiline={true}
                    numberOfLines={3}
                    placeholder="Method"
                    underlineColorAndroid='transparent'
                    require={true}
                    onChangeText={(instruction) => setInstruction(instruction)}
                />

            </Card>
        
        </View>
    )


}
const styles = StyleSheet.create({
    inputTitle: {
      height: '10%',
      margin: 12,
      borderWidth: 1,
      borderRadius:6,
      borderColor:'#8E7C68',
      backgroundColor: '#DDC9BC',
      shadowOpacity:0.1,
      justifyContent:'center',
      alignContent:'center',
      fontWeight:'bold',
      padding: 10,
    },
    multiline: {
        height: '37%',
        margin: 12,
        borderWidth: 1,
        borderRadius:2,
        borderColor:'#8E7C68',
        backgroundColor: '#DDC9BC',
        textAlign:'justify',
        shadowOpacity:0.1,
        padding: 10,
    },
    SavePage:{
        backgroundColor:'#DDC9BC',
        paddingBottom:'1%',
        height:'100%',
        width:'100%'
    },
    ShareButton:{

    }
  });
