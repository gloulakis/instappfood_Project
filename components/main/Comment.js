import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, Button, TextInput,Image, KeyboardAvoidingView,StyleSheet } from 'react-native'

import firebase from 'firebase'
require('firebase/firestore')

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUsersData } from '../../redux/actions/index'
import {BlackLogo} from '../main/BlackLogo'

function Comment(props) {
    const [comments, setComments] = useState([])
    const [caption, setCaption] = useState([])
    const [postId, setPostId] = useState("")
    const [text, setText] = useState("")
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        function matchUserToComment(comments) {
            for (let i = 0; i < comments.length; i++) {
                if (comments[i].hasOwnProperty('user')) {
                    continue;
                }

                const user = props.users.find(x => x.uid === comments[i].creator)
                if (user == undefined) {
                    props.fetchUsersData(comments[i].creator, false)
                } else {
                    comments[i].user = user
                }
            }
            setComments(comments)
        }

        function matchUserToCaption(caption) {
            for (let i = 0; i < caption.length; i++) {
                if (caption[i].hasOwnProperty('user')) {
                    continue;
                }

                const user = props.users.find(x => x.uid === caption[i].creator)
                if (user == undefined) {
                    props.fetchUsersData(caption[i].creator, false)
                } else {
                    caption[i].user = user
                }
            }
            setCaption(caption)
        }

        if (props.route.params.postId !== postId) {
            firebase.firestore()
                .collection('posts')
                .doc(props.route.params.uid)
                .collection('userPosts')
                .doc(props.route.params.postId)
                .collection('comments')
                .get()
                .then((snapshot) => {
                    let comments = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data }
                    })
                    matchUserToComment(comments)
                })
            setPostId(props.route.params.postId)
        } else {
            matchUserToComment(comments)
        }

        if (props.route.params.postId !== postId) {
            firebase.firestore()
                .collection('posts')
                .doc(props.route.params.uid)
                .collection('userPosts')
                .doc(props.route.params.postId)
                .collection('caption')
                .get()
                .then((snapshot) => {
                    let comments = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return { id, ...data }
                    })
                    matchUserToCaption(caption)
                })
            setPostId(props.route.params.postId)
        } else {
            matchUserToCaption(caption)
        }


    }, [props.route.params.postId, props.users])


    const onCommentSend = () => {
        firebase.firestore()
            .collection('posts')
            .doc(props.route.params.uid)
            .collection('userPosts')
            .doc(props.route.params.postId)
            .collection('comments')
            .add({
                creator: firebase.auth().currentUser.uid,
                text
            })
    }

    return (
        <KeyboardAvoidingView style={styles.Screen} behavior="position">
            <BlackLogo/>
            <View style={styles.List}>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={posts}
                    renderItem={({ post }) => (
                        <View>
                            {item.user !== undefined ?
                                <Text style={styles.captionPost} >
                                    {item.caption}
                                </Text>
                                : null}
                            <Text style={styles.captionPost}>{post.caption}</Text>
                        </View>
                    )}    
                />
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    data={comments}
                    renderItem={({ item }) => (
                        <View>
                            {item.user !== undefined ?
                                <Text style={styles.captionUser}>
                                    {item.user.name}
                                </Text>
                                : null}
                            <Text style={styles.captionComment} >{item.text}</Text>
                        </View>
                    )}
                 />
            </View>

            <View style={{
                width:'100%',
                paddingTop:600
                }}>
                <TextInput
                    style={styles.comment}
                    placeholder='comment...'
                    onChangeText={(text) => setText(text)} />
                <Button
                    onPress={() => onCommentSend()}
                    title="Send"
                />
            </View>

        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
      captionComment:{
          textAlign:'auto',
          fontSize:15,
          margin:3,
          fontWeight:'300',
          paddingLeft:20
      },
      captionUser:{
        textAlign:'auto',
        fontSize:15,
        margin:3,
        fontWeight:'500'
    },
    TextInputComment:{
        margin:20,
        width:300,
        height:40
    },
    Screen:{
        flex:1,
        marginTop:'6%',
        marginLeft:'2%',
        alignContent:'center',
    },
    comment:{
        width: window.width,
        textAlign:'center',
        color:'black',
        fontWeight:'700',
        height: 50,
        borderRadius: 50,
        borderColor:'rgba(34, 49, 63, 1)',
        borderWidth:3,
        backgroundColor:'white',
      },
      List:{
        width:'100%',
        alignContent:'center',
    },
})

const mapStateToProps = (store) => ({
    users: store.usersState.users
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Comment);