import React, { useState, useEffect } from 'react'
import { StyleSheet,View, Text, Image, FlatList,TouchableHighlight } from 'react-native'
import { Icon } from 'react-native-elements'
import firebase from 'firebase'
require('firebase/firestore')
import { connect } from 'react-redux'

function Feed(props) {
    const [posts, setPosts] = useState([]);

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
        <View style={styles.container}>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={posts}
                    borderRadius = {10}
                    extraData={posts}
                    renderItem={({ item }) => (
                        <View style={styles.Card}>
                            <TouchableHighlight onPress={() => props.navigation.navigate('ShowInfo', { postId: item.id, uid: item.user.uid })}>
                                            <Image
                                                style={styles.image}
                                                source={{ uri: item.downloadURL }}
                                            />
                            </TouchableHighlight>
                            <View style={styles.header}>
                                <Text style={styles.headerText}>{item.title}</Text>
                            </View>
                            <View style={styles.header2}>
                                <Text style={styles.headerText2} onPress={() => props.navigation.navigate("Profile", {uid: item.user.uid})}>
                                     Posted by {item.user.name} </Text>
                            </View>
                            <View style={styles.HartContainer}>
                                <View>
                                    { item.currentUserLike ?
                                        (
                                            <TouchableHighlight onPress={()=>onDislikePress(item.user.uid, item.id)}>
                                                <View>
                                                    <Icon name="heart" 
                                                        type='font-awesome'
                                                        color ='white'
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
                                                        color = 'red'
                                                        padding = '5%'
                                                        fontSize = '50'
                                                    >
                                                    </Icon>
                                                </View>
                                            </TouchableHighlight>
                                        )
                                    } 
                                </View>
                            </View>
                            <View style={styles.CommentContainer}>
                                <TouchableHighlight onPress={() => props.navigation.navigate('Comment', { postId: item.id, uid: item.user.uid })}>
                                            <View>
                                                <Icon name="comment" 
                                                    type='font-awesome'
                                                    color ='orange'
                                                    padding='4%'
                                                >
                                                </Icon>
                                            </View>
                                </TouchableHighlight>
                            </View>
                        </View>
                    )}
                />
            </View>
    
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop:20,
        paddingTop:15
      },
      image:{
        width:null,
        height:300
    },
    header:{
        width: '100%',
        height:35,
        position:'relative',
        shadowRadius:20,
        backgroundColor: 'black',
      },
      headerText:{
        fontSize:20,
        color:'white',
        shadowColor:'white',
        shadowOpacity:0.5,
        margin:3,
        fontFamily:'AvenirNext-Bold',
        fontWeight:'bold'
    },
    header2:{
        width: '100%',
        height:30,
        position:'relative',
        alignItems:'flex-end',
        backgroundColor: 'black',
      },
    headerText2:{
        fontSize:12,
        color:'yellow',
        shadowColor:'white',
        shadowOpacity:0.7,
        padding:5,
        fontFamily:'Noteworthy',
        fontWeight:'bold'
    },
    HartContainer:{
        flexWrap: "wrap",
        position:'absolute',
        top:'85%',
        shadowOpacity:100,
        shadowRadius:60,
        paddingLeft:'90%'
    },
    CommentContainer:{
        flexDirection: "row",
        flexWrap: "wrap",
        position:'absolute',
        top:'5%',
        paddingLeft:'90%',
        shadowOpacity:50,
        shadowRadius:10,
    },
    Card:{
        paddingTop:30,
    }
})
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded,


})
export default connect(mapStateToProps, null)(Feed);