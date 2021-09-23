import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import firebase from 'firebase'
require('firebase/firestore')
import { connect } from 'react-redux'
import { Icon } from 'react-native-elements'

function Profile(props) {
    const [userPosts, setUserPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [following, setFollowing] = useState(false)

    useEffect(() => {
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
                    }
                    else {
                        console.log('does not exist')
                    }
                })
            firebase.firestore()
                .collection("posts")
                .doc(props.route.params.uid)
                .collection("userPosts")
                .orderBy("creation", "asc")
                .get()
                .then((snapshot) => {
                    let posts = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data }
                    })
                    setUserPosts(posts)
                })
        }

        if (props.following.indexOf(props.route.params.uid) > -1) {
            setFollowing(true);
        } else {
            setFollowing(false);
        }

    }, [props.route.params.uid, props.following])

    const onFollow = () => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .set({})
    }
    const onUnfollow = () => {
        firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .delete()
    }

    const onLogout = () => {
        firebase.auth().signOut();
    }

    if (user === null) {
        return <View />
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.rowContainer}>
                    <Image
                        style={{ 
                            width: 70, 
                            height: 70,
                            borderRadius:50,
                            borderBottomWidth:5,
                            borderTopWidth:5,
                            borderLeftWidth:5,
                            borderRightWidth:5,
                            backgroundColor:'red'
                             }}
                        source={require('../Images/Logo.png') }
                        />
                <View style={styles.containerInfo}>
                <View>
                    </View>
                    <Text>{user.name}</Text>
                    <Text>{user.email}</Text>
                </View>
             
                
                <View style = {{justifyContent: 'flex-end',width:'20%',justifyContent:'center'}}>
                        {props.route.params.uid !== firebase.auth().currentUser.uid ? (
                            <View>
                                {following ? (
                                    <Icon
                                    reverse
                                    name='user'
                                    type='antdesign'
                                    color = 'green'
                                        onPress={() => onUnfollow()}
                                    />
                                ) :
                                    (
                                        <Icon
                                        reverse
                                        name='user'
                                        type='antdesign'
                                        color = 'red'
                                            onPress={() => onFollow()}
                                        />
                                    )}
                            </View>
                        ) :
                                <Icon
                                    reverse
                                    name='md-exit-outline'
                                    type='ionicon'
                                    color = 'red'
                                onPress={() => onLogout()}
                            />}
                </View>
               
            </View>
            <View  style={styles.Containerbio}>
                    <Text style={styles.bio}>{user.bio}</Text>
                </View>

            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={3}
                    horizontal={false}
                    data={userPosts}
                    renderItem={({ item }) => (
                        <View
                            style={styles.containerImage}>

                            <Image
                                style={styles.image}
                                source={{ uri: item.downloadURL }}
                            />
                        </View>

                    )}

                />
            </View>
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    rowContainer: {
        flexDirection: 'row',
        padding: '2%'
    },
    containerInfo: {
        margin: 20,
        width:'55%'
    },
    containerGallery: {
        flex: 1,
        backgroundColor:'#DDC9BC',
        borderRadius:12,
        margin:1
    },
    containerImage: {
        flex: 1 / 3,
        padding:0,
        margin:2,
        borderRadius:6,
        backgroundColor:'#DDC9BC'

    },
    image: {
        flex: 1,
        aspectRatio: 1 / 1,
        borderRadius:9,
    },
    bio:{
        padding: '2%',
        color:'white',
        fontSize:15,
        fontWeight:'normal'
    },
    Containerbio:{
        backgroundColor:'#8E7C68',
        borderRadius:10,
        padding:5,
        margin:4
    }
})
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    following: store.userState.following
})
export default connect(mapStateToProps, null)(Profile);