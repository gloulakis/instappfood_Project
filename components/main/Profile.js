import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, TouchableHighlight, Alert,RefreshControl } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import firebase from 'firebase'
require('firebase/firestore')
import { connect } from 'react-redux'
import {BlackLogo} from '../main/BlackLogo'

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

  

    const onFollow = async () => {
         await firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .set({})
    }
    const onUnfollow = async () => {
         await firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .delete()
    }

    const onLogout = async () => {
        await firebase.auth().signOut();
    }

    if (user === null) {
        return <View />
    }

    const updateItem = (id) =>{
         setUserPosts((prevState)=>{
                    const removed = prevState.splice(1)
                    return[...prevState]
                    console.log(id)})
    }

    const deleteItem = (id) => {
        return Alert.alert(
            "Are your sure?",
            "Are you sure you want to remove this Post?",
            [
              {
                text: "Yes",
                onPress:  () => {
                 setUserPosts(async(prevState)=>{
                    await firebase.firestore()
                    .collection('posts')
                    .doc(firebase.auth().currentUser.uid)
                    .collection('userPosts')
                    .doc(id)
                    .delete()
                    const removed = prevState.splice(id,1)
                    return[...prevState]
                    console.log(removed)
                 }
                 )},
              },
              {
                text: "No",
              },
            ]
          );
       
    }

    return (
        
        <SafeAreaView style={styles.container}>
            <View style={styles.rowContainer}>
                <View style={styles.LogoContainer}>
                    <BlackLogo/>
                </View>
                <View style={{width:'50%',justifyContent:'center',alignContent:'center',alignItems:'flex-end'}}>
                        {props.route.params.uid !== firebase.auth().currentUser.uid ? (
                            <View>
                                {following ? (
                                    <Text style={{color:'green', fontWeight:'800'}} onPress={() => onUnfollow()}> Following </Text>
                                ) :
                                (
                                    <Text style={{color:'red',fontWeight:'800'}} onPress={() => onFollow()}> Follow </Text>
                                )}
                            </View>
                        ) :
                                <Text style={{color:'red',fontWeight:'800'}} onPress={() => onLogout()} > Logout </Text>
                        }
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
                    extraData={userPosts}
                    
                    onPress={() => deleteItem(item.id)}
                    renderItem={({ item }) => (
                        <View
                            style={styles.containerImage}>
                                 {props.route.params.uid !== firebase.auth().currentUser.uid ? (
                                             <TouchableHighlight>
                                             <Image
                                                     style={styles.image}
                                                     source={{ uri: item.downloadURL }}
                                                 />
                                            </TouchableHighlight>
                                 ):
                                 (
                                    <TouchableHighlight 
                                    onPress={() => deleteItem(item.id)}>
                                    <Image
                                            style={styles.image}
                                            source={{ uri: item.downloadURL }}
                                        />
                                </TouchableHighlight>
                                 )}
                         
                        </View>
                   
                    )}
                />
                    <View style={styles.containerInfo}>
                        <Text style={styles.containerInfo2}>{user.name}</Text>
                        <Text style={styles.containerInfo2}>{user.email}</Text>
                    </View>
                       
            </View>
                          
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom:-20
    },
    LogoContainer:{
        flex:1,
        height:980
    },
    rowContainer: {
        flexDirection: 'row',
        padding: '1%',
        width:'100%',
        height:'9%',
    },
    containerInfo: {
        margin:'1%',
        width:'60%',
        padding:5,
        borderRadius:10,
        backgroundColor:'black' 
    },
    containerInfo2: {
        color:'white',
        fontWeight:'700'
        
    },
    containerGallery: {
        flex: 1,
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
        color:'gray',
        fontSize:15,
        color:'white',
        fontWeight:'500',
       
    },
    Containerbio:{
        width:'99%',
        shadowOpacity:.8,
        backgroundColor:'rgba(25, 22, 2, 0.9)',
        borderBottomRightRadius:50,
        marginTop:'1%',
        marginBottom:'2%'
        
    }
})
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
    following: store.userState.following
})
export default connect(mapStateToProps, null)(Profile);