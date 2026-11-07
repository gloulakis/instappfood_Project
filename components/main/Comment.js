import React, { useState, useEffect } from 'react'
import { Alert, View, Text, FlatList, Button, TextInput,Image, KeyboardAvoidingView,StyleSheet } from 'react-native'

import firebase from 'firebase'
require('firebase/firestore')

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUsersData } from '../../redux/actions/index'
import {BlackLogo} from '../main/BlackLogo'

function Comment(props) {
    const [comments, setComments] = useState([]);
    const [text, setText] = useState('');
    const [sending, setSending] = useState(false);
    const { uid, postId } = props.route.params;

    useEffect(() => {
        setComments([]);
        return firebase.firestore().collection('posts').doc(uid)
            .collection('userPosts').doc(postId).collection('comments')
            .onSnapshot(snapshot => {
                setComments(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
            }, error => Alert.alert('Could not load comments', error.message));
    }, [uid, postId]);

    useEffect(() => {
        [...new Set(comments.map(comment => comment.creator))].forEach(creator => {
            if (!props.users.some(user => user.uid === creator)) props.fetchUsersData(creator, false);
        });
    }, [comments, props.users]);

    const onCommentSend = async () => {
        if (sending || !text.trim()) return;
        setSending(true);
        try {
            await firebase.firestore().collection('posts').doc(uid)
                .collection('userPosts').doc(postId).collection('comments').add({
                    creator: firebase.auth().currentUser.uid,
                    text: text.trim(),
                    creation: firebase.firestore.FieldValue.serverTimestamp()
                });
            setText('');
        } catch (error) { Alert.alert('Could not send comment', error.message); }
        finally { setSending(false); }
    };

    return (
        <KeyboardAvoidingView style={styles.Screen} behavior="position">
            <BlackLogo/>
            <View style={styles.List}>
                <FlatList
                    numColumns={1}
                    horizontal={false}
                    keyExtractor={item => item.id}
                    data={comments.map(comment => ({ ...comment, user: props.users.find(user => user.uid === comment.creator) }))}
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
                paddingTop:12
                }}>
                <TextInput
                    style={styles.comment}
                    value={text}
                    editable={!sending}
                    placeholder='comment...'
                    onChangeText={(text) => setText(text)} />
                <Button
                    onPress={() => onCommentSend()}
                    title={sending ? "Sending…" : "Send"}
                    disabled={sending || !text.trim()}
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
        width: '100%',
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
        flex: 1,
    },
})

const mapStateToProps = (store) => ({
    users: store.usersState.users
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch);

export default connect(mapStateToProps, mapDispatchProps)(Comment);