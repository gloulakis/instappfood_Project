import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button,ScrollView } from 'react-native'

import firebase from 'firebase'
require('firebase/firestore')
import { connect } from 'react-redux'
import { UserInterfaceIdiom } from 'expo-constants'

function ShowInfo(props) {
    const [userPosts, setUserPosts] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(()=>{
        const { currentUser, posts } = props;

           if (props.route.params.uid === firebase.auth().currentUser.uid) {
            setUser(currentUser)
            setUserPosts(posts)
        }
        else {
            firebase.firestore()
                .collection("users")
                .doc(props.route.params.uid)
                .get()
                .then((snapshot) => {
                    if (snapshot.exists) {
                        setUser(snapshot.data());
                        console.log(snapshot.data())
                    }
                    else {
                        console.log('does not exist')
                    }
                })
          
            firebase.firestore()
                .collection('posts')
                .doc(props.route.params.uid)
                .collection('userPosts')
                .doc(props.route.params.postId)
                .get()
                .then((snapshot) => {
                    setUserPosts(snapshot.data());
                    console.log(snapshot.data())
            })
            
        }
    },[props.route.params.postId,props.route.params.uid])

    if (user === null) {
        return <View />
    }

    return (
        <View style={styles.page}>
        <ScrollView>
             <View style={styles.containerTitle}>
                  <Text style={styles.TextTitle}>{userPosts.title}</Text>
            </View>
            <Image
                style={styles.image}
                source={{uri: userPosts.downloadURL}}/>

                <View style={styles.CreatedBy}>
                    <Text style={styles.CreatedBy}>Posted by {user.name}</Text>
                </View>
                
                <Text>{userPosts.products}</Text>
                <Text>{userPosts.instruction}</Text>
        </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerTitle:{
        backgroundColor:'black',
        borderRadius:20,
        padding:8,
        width:'80%',
        marginBottom:12,
        marginTop:10,
        marginRight:'10%',
        marginLeft:'10%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    TextTitle:{
        fontSize:17,
        color:'white',
        padding:'2%'
    },
    containerInfo: {
        margin: 20
    },
    containerGallery: {
        flex: 1
    },
    containerImage: {
        flex: 1 / 3

    },
    image: {
        flex: 1,
        aspectRatio: 1 / 1,
        paddingTop:'2%',
        paddingBottom:'2%',
        height: '100%',
        width: '100%',
        borderRadius: 20,
    },
    CreatedBy:{
        alignItems:'flex-end',
        marginRight:10,
        padding:1,
        fontWeight:'200',
        fontStyle:'italic'
    }
})
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
})
export default connect(mapStateToProps, null)(ShowInfo);