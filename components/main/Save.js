import React, { useState } from 'react'
import { Alert, View, TextInput, Button, StyleSheet,KeyboardAvoidingView } from 'react-native'
import firebase from 'firebase'

require("firebase/firestore")
require("firebase/storage")


export default function Save(props) {
    const [title, setTitle] = useState("")
    const [products, setProducts] = useState("")
    const [instruction, setInstruction] = useState("")

    const [saving, setSaving] = useState(false);
    const savingRef = React.useRef(false);
    const uploadImage = async () => {
        if (savingRef.current) return;
        const uri = props.route.params?.image;
        if (!uri || !title.trim() || !products.trim() || !instruction.trim()) {
            Alert.alert('Recipe incomplete', 'Choose an image and enter a title, ingredients, and method.');
            return;
        }
        savingRef.current = true;
        setSaving(true);
        let blob;
        let uploaded;
        let saved = false;
        try {
            const uid = firebase.auth().currentUser.uid;
            const post = firebase.firestore().collection('posts').doc(uid).collection('userPosts').doc();
            const response = await fetch(uri);
            blob = await response.blob();
            const task = await firebase.storage().ref().child(`post/${uid}/${post.id}`).put(blob);
            uploaded = task.ref;
            const downloadURL = await uploaded.getDownloadURL();
            await post.set({ downloadURL, title: title.trim(), products: products.trim(),
                instruction: instruction.trim(), likesCount: 0,
                creation: firebase.firestore.FieldValue.serverTimestamp() });
            saved = true;
            props.navigation.popToTop();
        } catch (error) {
            if (uploaded && !saved) await uploaded.delete().catch(() => {});
            Alert.alert('Could not save recipe', error.message);
        } finally {
            if (blob && blob.close) blob.close();
            savingRef.current = false;
            setSaving(false);
        }
    };
    return (
        <KeyboardAvoidingView style={styles.SavePage} >
            <View style={styles.Page}>
            <Button  style={styles.ShareButton} title={saving ? "Sharing…" : "Share"} disabled={saving} onPress={() => uploadImage()} />
                     <TextInput
                        style={styles.inputTitle}
                        placeholder={"Title"}
                        onChangeText={(title) => setTitle(title)}
                    />
                    <TextInput
                        style={styles.multiline}
                        multiline={true}
                        numberOfLines={3}
                        placeholder="Ingredients"
                        underlineColorAndroid='transparent'
                        require={true}
                        onChangeText={(products) => setProducts(products)}
                    />
                    <TextInput
                        style={styles.multiline}
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
