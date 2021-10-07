import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, SafeAreaView, StatusBar,ScrollView, PermissionsAndroid } from 'react-native'

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
        <ScrollView style={styles.scrollView}>
            <StatusBar hidden />
            <View style={styles.container}>
                <Image
                    style={styles.image}
                    source={{uri: userPosts.downloadURL}}
                />
                <View style={styles.header}>
                    <Text style={styles.headerText}>{userPosts.title} </Text>
                </View>
                <View style={styles.header2}><Text style={styles.header2Text}>Posted by {user.name}</Text></View>
                <View style={styles.header3}><Text style={styles.header3Text}> ────────────────────────</Text></View>
            </View>
            <View style={styles.receipeContainer}>
                <Text style={styles.title}>Ingredient</Text>
                <Text style={styles.Products}>{userPosts.products}</Text>
                <Text style={styles.title}>Method</Text>
                <Text style={styles.Method}>{userPosts.instruction}</Text>
            </View>
        </ScrollView>
        
    )
}

const styles = StyleSheet.create({
    scrollView: {
        marginHorizontal: 0,
        marginBottom:30
      },
      container: {
        flex: 1,
        height:300,
        backgroundColor: 'black',
      },
      image:{
          width:null,
          height:300
      },
      header:{
        width: '100%',
        height: 90,
        position: 'absolute',
        top: 179,
        left: 0,
        backgroundColor: 'rgba(96,94,93,0.70)',
      },
      headerText:{
          fontSize:30,
          color:'white',
          margin:5,
          fontFamily:'GillSans-UltraBold',
          fontWeight:'bold'

      },
      header2:{
        width: '100%',
        height: 20,
        alignContent:'flex-end',
        alignItems:'flex-end',
        position: 'absolute',
        top: 240,
        left: 0,
      },
      header2Text:{
        color:'white',
        padding:3,
        fontFamily:'Chalkduster',
        fontWeight:'bold'
    },
    header3:{
        width: '100%',
        height: 20,
        alignContent:'flex-end',
        alignItems:'flex-end',
        position: 'absolute',
        top: 220,
        left: 0,
      },
      header3Text:{
        color:'rgba(255,253,166,0.70)',
        padding:3,
        fontFamily:'Chalkduster',
        fontWeight:'bold'
    },
    receipeContainer:{
        marginHorizontal: 10,
        marginTop:20,
    },
    Products:{
        fontSize:15,
        fontWeight:'500',
        fontFamily:'Baskerville',
        padding:20
    },
    Method:{
        fontSize:15,
        fontFamily:'Baskerville',
        textAlign:'justify',
        paddingTop:5
    },
    title:{
        fontSize:20,
        padding:4,
        fontFamily:'AvenirNextCondensed-Heavy',
        color:'white',
        backgroundColor:'rgba(154, 154, 150, 0.72)'
    }
 

})
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts,
})
export default connect(mapStateToProps, null)(ShowInfo);