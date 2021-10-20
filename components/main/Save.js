import React, { useState } from 'react'
import { View, TextInput, Button, StyleSheet,KeyboardAvoidingView } from 'react-native'
import firebase from 'firebase'

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
        <KeyboardAvoidingView style={styles.SavePage} >
            <View style={styles.Page}>
            <Button  style={styles.ShareButton} title="Share" onPress={() => uploadImage()} />
                     <TextInput
                        style={styles.inputTitle}
                        placeholder={"Title"}
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
            </View>
        </KeyboardAvoidingView>
    )
}
const styles = StyleSheet.create({
    inputTitle: {
      height: '10%',
      width:'100%',
      margin: 1,
      backgroundColor:'white',
      borderRadius:20,
      shadowOpacity:0.08,
      fontWeight:'bold',
      padding: 10,
    },
    multiline: {
        height: '37%',
        width:'100%',
        borderRadius:20,
        backgroundColor:'white',
        textAlign:'justify',
        shadowOpacity:0.08,
        padding: 20,
        margin:10
    },
    SavePage:{
        margin:10,
        marginTop:30
    },
    Page:{
        paddingBottom:'1%',
        margin:'4%',
        alignContent:'center',
        alignItems:'center',
    }
  });
