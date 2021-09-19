import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button } from 'react-native'

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
        <View>
                <Image
                style={{ width: '100%', height: '60%', marginBottom: 15 }}
                source={{uri: userPosts.downloadURL}}
                />
                <Text>{user.name}</Text>
                <Text>{user.email}</Text>
                <Text>{userPosts.caption}</Text>

            
        </View>
        
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        aspectRatio: 1 / 1
    }
})
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
})
export default connect(mapStateToProps, null)(ShowInfo);