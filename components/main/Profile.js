import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, TouchableHighlight, Alert,Modal } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import firebase from 'firebase'
require('firebase/firestore')
import { connect } from 'react-redux'
import {BlackLogo} from '../main/BlackLogo'
import LottieView from 'lottie-react-native';

function Profile(props) {
    const profileUid = props.route.params?.uid || firebase.auth().currentUser.uid;
    const [userPosts, setUserPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [following, setFollowing] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        setFollowing(props.following.includes(profileUid));
    }, [profileUid, props.following]);

    useEffect(() => {
        if (profileUid === firebase.auth().currentUser.uid) {
            setUser(props.currentUser);
            setUserPosts(props.posts);
            return;
        }
        setUser(null);
        setUserPosts([]);
        const onError = error => Alert.alert('Could not load profile', error.message);
        const stopUser = firebase.firestore().collection('users').doc(profileUid)
            .onSnapshot(snapshot => setUser(snapshot.exists ? snapshot.data() : null), onError);
        const stopPosts = firebase.firestore().collection('posts').doc(profileUid)
            .collection('userPosts').orderBy('creation', 'desc')
            .onSnapshot(snapshot => setUserPosts(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))), onError);
        return () => { stopUser(); stopPosts(); };
    }, [profileUid, props.currentUser, props.posts]);

    const onFollow = async () => {
         await firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(profileUid)
            .set({})
    }
    const onUnfollow = async () => {
         await firebase.firestore()
            .collection("following")
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(profileUid)
            .delete()
    }



    const onLogout = async () => {
        await firebase.auth().signOut();
    }

    if (user === null) {
        return <View />
    }

    const deleteItem = (id) => {
        if (profileUid !== firebase.auth().currentUser.uid) return;
        Alert.alert('Delete post?', 'Are you sure you want to remove this post?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: async () => {
                try {
                    await firebase.firestore().collection('posts').doc(profileUid)
                        .collection('userPosts').doc(id).delete();
                    setUserPosts(posts => posts.filter(post => post.id !== id));
                } catch (error) {
                    Alert.alert('Could not delete post', error.message);
                }
            } }
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.rowContainer}>
                <View style={styles.LogoContainer}>
                <TouchableHighlight onPress={() => props.navigation.navigate("Feed")}
                style ={{
                    height:'100%'
                }} >
                    <BlackLogo/>
                </TouchableHighlight>
                </View>
                <View style={{width:'50%',justifyContent:'center',alignContent:'center',alignItems:'flex-end'}}>
                        {profileUid !== firebase.auth().currentUser.uid ? (
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
             <View style={styles.Containerbio}>
             <Text style={styles.bio}>{user.bio}</Text>
             </View>
            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={3}
                    horizontal={false}
                    data={userPosts}
                    extraData={userPosts}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <View
                            style={styles.containerImage}>
                                 {profileUid !== firebase.auth().currentUser.uid ? (
                                             <TouchableHighlight onPress={() => props.navigation.navigate("ShowInfo", { uid: profileUid, postId: item.id })}>
                                             <Image
                                                     style={styles.image}
                                                     source={{ uri: item.downloadURL }}
                                                 />
                                            </TouchableHighlight>
                                 ):
                                 (
                                    <TouchableHighlight
                                    onPress={() => props.navigation.navigate("ShowInfo", { uid: profileUid, postId: item.id })}
                                    onLongPress={() => deleteItem(item.id)}>
                                    <Image
                                            style={styles.image}
                                            source={{ uri: item.downloadURL }}
                                        />
                                </TouchableHighlight>
                                 )}


                        </View>

                    )}
                />
                     {profileUid !== firebase.auth().currentUser.uid ? (
                                        <View style={styles.containerInfo}>
                                             <Text style={styles.containerInfo2}>{user.name}</Text>
                                             <Text style={styles.containerInfo2}>{user.email}</Text>
                                         </View>
                                 ):
                                 (
                                    <View>
                                    <View style={styles.containerInfo}>
                                             <Text style={styles.containerInfo2}>{user.name}</Text>

                                             <Text style={styles.containerInfo2}>{user.email}</Text>
                                         </View>
                                </View>
                                 )}


            </View>
            <LottieView
                            source={require('../Images/christmassantaclaus.json')}
                            autoPlay
                              style ={{
                                position:'absolute',
                                marginTop:'4%',
                                paddingRight:'66%',
                                height:'37%',
                                alignContent:'center',
                                alignItems:'center'
                              }}
                            />
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
