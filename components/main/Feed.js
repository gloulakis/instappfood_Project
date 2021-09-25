import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList,TouchableHighlight } from 'react-native'
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
        console.log(posts)

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
          <View style={styles.containerGallery2}>
            <View style={styles.containerGallery}>
       
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={posts}
                    borderRadius = {20}
                    renderItem={({ item }) => (
                        <View
                            style={styles.containerImage}>
                            <View style={styles.containerTitle}>
                                    <Text style={styles.TextTitle} >{item.title}</Text>
                            </View>
                           
                            <TouchableHighlight onPress={() => props.navigation.navigate('ShowInfo', { postId: item.id, uid: item.user.uid })}>
                                            <Image
                                                style={styles.image}
                                                source={{ uri: item.downloadURL }}
                                            />
                            </TouchableHighlight>
                            <View style={styles.CreatedBy}>
                                <Text style = {{padding:1,fontWeight:'200',fontStyle:'italic'}}
                                 onPress={() => props.navigation.navigate("Profile", {uid: item.user.uid})}
                                 >Posted by {item.user.name} </Text>
                           </View >    
                            <View style={styles.rowContainer}>
                                <View>
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
                                </View>
                                             
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
                        </View>
                    )}
                />
            </View>
          </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: '0.1%',
        borderRadius: 10,
        margin:'1%',
        marginTop:'8.2%'
    },
    containerTitle:{
        borderRadius:20,
        width:'80%',
        marginRight:'10%',
        marginLeft:'10%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    TextTitle:{
        fontSize:20,
        color:'black',
        fontFamily:"Georgia",
        padding:'1%',
        shadowOpacity:0.1
    },
    rowContainer: {
        flexDirection: 'row',
        padding: '2%',

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
        marginTop:'3%',
        paddingBottom:'2%'
    },
    containerGallery2:{
        flex: 1,
        margin:4,
        borderRadius:30
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
        height: '100%',
        width: '95%',
        borderRadius: 20,
        margin:10,
    },
    CreatedBy:{
        alignItems:'flex-end',
        marginRight:10
    }
})
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    following: store.userState.following,
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded,


})
export default connect(mapStateToProps, null)(Feed);