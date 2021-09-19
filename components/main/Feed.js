import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, TouchableOpacity,TouchableHighlight } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements'
import firebase from 'firebase'
require('firebase/firestore')
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { connect } from 'react-redux'

function Feed(props) {
    const [posts, setPosts] = useState([]);
    const navigation = useNavigation();
    useEffect(() => {
        if (props.usersFollowingLoaded == props.following.length && props.following.length !== 0) {
            props.feed.sort(function (x, y) {
                return x.creation - y.creation;
            })
            setPosts(props.feed);
        }
    }, [props.usersFollowingLoaded, props.feed])

    const onLikePress = (userId, postId) => {
        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .set({})
    }

    const onDislikePress = (userId, postId) => {
        firebase.firestore()
            .collection("posts")
            .doc(userId)
            .collection("userPosts")
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .delete()
    }


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.containerGallery}>
                <View>
 
                </View>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={posts}
                    renderItem={({ item }) => (
                        <View
                            style={styles.containerImage}>
                            <TouchableOpacity
                                onPress={() => props.navigation.navigate("Profile", {uid: item.user.uid})}>
                                <Text  style={styles.containerUser} >{item.user.name}</Text>
                            </TouchableOpacity>
                            <TouchableHighlight onPress={() => props.navigation.navigate('ShowInfo', { postId: item.id, uid: item.user.uid })}>
                                            <Image
                                                style={styles.image}
                                                source={{ uri: item.downloadURL }}
                                            />
                            </TouchableHighlight>
                            <View style={styles.rowContainer}>
                            { item.currentUserLike ?
                                (
                                    <TouchableHighlight onPress={()=>onDislikePress(item.user.uid, item.id)}>
                                        <View>
                                            <Icon name="heart" 
                                                type='font-awesome'
                                                color ='black'
                                                padding = '5%'
                                                fontSize = '12'
                                            >
                                            </Icon>
                                        </View>
                                    </TouchableHighlight>
                                )
                                :
                                (
                                    <TouchableHighlight onPress={()=>onLikePress(item.user.uid, item.id)}>
                                        <View>
                                            <Icon name="heart" 
                                                type='font-awesome'
                                                color ='red'
                                                padding = '5%'
                                                fontSize = '12'
                                            >
                                            </Icon>
                                        </View>
                                    </TouchableHighlight>
                                )
                            }                            
                                <TouchableHighlight onPress={() => props.navigation.navigate('Comment', { postId: item.id, uid: item.user.uid })}>
                                        <View>
                                            <Icon name="comment" 
                                                type='font-awesome'
                                                color ='black'
                                            >
                                            </Icon>
                                        </View>
                                </TouchableHighlight>
                            </View>
                            <View style={styles.rowContainer}>
                                <Text style = {{padding:1,fontWeight:'bold'}}>{item.user.name} </Text>
                                <Text style = {{padding:1}} >{item.caption}</Text>
                           </View>     

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
        marginTop: '1%'
    },
    rowContainer: {
        flexDirection: 'row',
        padding: '2%'
    },
    containerUser: {
        flex: 1,
        marginTop: '1%',
        padding:5,
        fontSize:15,
        fontWeight:'bold'
    },

    containerInfo: {
        marginTop: '5%'
    },
    containerGallery: {
        flex: 1,
        marginTop:'4%',
        paddingBottom:'5%'
    },
    containerImage: {
        flex: 1 / 3,
        paddingTop:'2%',
        paddingBottom:'2%',
        height: '100%',
        width: '100%',
        borderRadius: 20,

    },
    image: {
        flex: 1,
        aspectRatio: 1 / 1,
        paddingTop:'1%',
        paddingBottom:'2%',
        height: '100%',
        width: '100%',
        borderRadius: 2,
    }
})
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded,


})
export default connect(mapStateToProps, null)(Feed);