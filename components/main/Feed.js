import React, { useState, useEffect } from 'react'
import { StyleSheet,View, Text, Image, FlatList,TouchableHighlight } from 'react-native'
import { Icon } from 'react-native-elements'
import firebase from 'firebase'
require('firebase/firestore')
import { connect } from 'react-redux'
import LottieView from 'lottie-react-native';


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
                                                <Image 
                                                    source={require('../Images/dislike.gif')}  
                                                    style={{
                                                        width:60, 
                                                        height:60,
                                                        borderRadius:20,
                                                        alignContent:'center',
                                                        alignItems:'center',
                                                        backgroundColor:'#4682b4'
                                                    }}
                                                />
                                                </View>
                                            </TouchableHighlight>
                                        )
                                        :
                                        (
                                            <TouchableHighlight onPress={()=>onLikePress(item.user.uid, item.id)}>
                                                <View>
                                                <Image 
                                                    source={require('../Images/like.gif')}  
                                                    style={{
                                                        width:60, 
                                                        height:60,
                                                        borderRadius:20,
                                                        alignContent:'center',
                                                        alignItems:'center',
                                                    }}
                                                />
                                                </View>
                                            </TouchableHighlight>
                                        )
                                    } 
                                </View>
                            </View>
                            <View style={styles.CommentContainer}>
                                <TouchableHighlight onPress={() => props.navigation.navigate('Comment', { postId: item.id, uid: item.user.uid })}>
                                            <View>
                                            <Image 
                                                    source={require('../Images/comment2.gif')}  
                                                    style={{
                                                        width:60, 
                                                        height:60,
                                                        borderRadius:40,
                                                        alignContent:'center',
                                                        alignItems:'center',
                                                    }}
                                                />
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
        backgroundColor: '#4682b4',
      },
      headerText:{
        fontSize:20,
        color:'white',
        shadowColor:'#4682b4',
        shadowOpacity:0.2,
        margin:3,
        fontFamily:'AvenirNext-Bold',
        fontWeight:'bold'
    },
    header2:{
        width: '100%',
        height:30,
        position:'relative',
        alignItems:'flex-end',
        backgroundColor: '#b0c4de',
        borderBottomLeftRadius:10,
        borderBottomRightRadius:10,
      },
    headerText2:{
        fontSize:12,
        color:'#191970',
        shadowColor:'white',
        shadowOpacity:0.1,
        padding:5,
        fontFamily:'Noteworthy',
        fontWeight:'bold'
    },
    HartContainer:{
        flexWrap: "wrap",
        position:'absolute',
        top:'75%',
        shadowColor:'#b0c4de',
        shadowOpacity:100,
        shadowRadius:60,
        paddingLeft:'85%',
    },
    CommentContainer:{
        flexDirection: "row",
        flexWrap: "wrap",
        position:'absolute',
        top:'2%',
        paddingLeft:'85%',
        shadowOpacity:20,
        shadowRadius:4,
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