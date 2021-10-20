import React, { Component } from 'react'
import {View,Button,TextInput,Text,KeyboardAvoidingView,ImageBackground} from 'react-native'
import firebase from 'firebase';
import { Input} from 'react-native-elements';
import Logo from '../main/Logo';

export class Register extends Component {

    constructor(props) {
        
        super(props);

        this.state = {
            email: '',
            password: '',
            name: '',
            bio: '',

        }
 
        this.onSignUp = this.onSignUp.bind(this)
    }

    onSignUp() {
        const { email, password, name,bio } = this.state;
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((result) => {
                firebase.firestore().collection("users")
                    .doc(firebase.auth().currentUser.uid)
                    .set({
                        name,
                        bio,
                        email
                    })
            })
            .catch((error) => {
                console.log(error)
            })
    }
    

    render() {
        return (
            <View style={{ 
                flex: 1,
                width:'100%',
                height:'100%', 
                alignItems: 'center'
                }}>
                 <ImageBackground source={require('../Images/bakc2.jpg')} resizeMode='cover' 
                    style={{justifyContent:'center',width:'100%',height:'100%'}}>
                <KeyboardAvoidingView  style={{
                        width:'98%',
                        backgroundColor:'white',
                        borderRadius:'50%',
                        marginBottom:'5%',
                        marginLeft:'1%',
                        alignContent:'center',
                        alignItems:'center',
                        shadowColor:'black',
                        shadowOpacity:'0.2'
                        }}
                    behavior='padding'
                    >
                    <Logo/>
              
                    <Input
                        placeholder="Username"
                        placeholderTextColor ='#088F8F'
                        color='black'
                        opacity ='.6'
                        padding='1%'
                        marginTop='12%'
                        onChangeText={(name) => this.setState({ name })}
                    />
                    <TextInput
                            placeholder="Bio"
                            placeholderTextColor ='#088F8F'
                            color='black'
                            opacity ='.6'
                            padding='1%'
                            marginTop='12%'
                            multiline={true}
                            numberOfLines={5}
                            require={true}
                            style={{
                                width:'96%',
                                margin:8,
                                alignContent:'center',
                                alignItems:'center',
                                fontSize:20,
                                height: '15%',
                                borderWidth:0.2,
                                borderColor:'black',
                                padding:4
                            
                            }}
                            onChangeText={(bio) => this.setState({ bio })}
                        />         
                    <Input
                        placeholder="E-Mail address"
                        placeholderTextColor ='#088F8F'
                        color='black'
                        opacity ='.6'
                        padding='1%'
                        marginTop='12%'
                        onChangeText={(email) => this.setState({ email })}
                    />
                    <Input
                        placeholder="Password"
                        placeholderTextColor ='#088F8F'
                        color='black'
                        opacity ='.6'
                        padding='1%'
                        marginTop='12%'
                        secureTextEntry={true}
                        onChangeText={(password) => this.setState({ password })}
                    />
                     <View style={{
                              marginTop: '10%',
                              backgroundColor:'rgba(0, 181, 204, 1)',
                              shadowColor:'pink',
                              shadowOpacity:.3,
                              borderTopLeftRadius:'30',
                              borderTopRightRadius:'30',
                              borderBottomLeftRadius:'30',
                              borderBottomRightRadius:'0',
                              padding:6,
                              marginBottom:33
                             }}>
                                 <Button
                                    color={'white'}
                                    onPress={() => this.onSignUp()}
                                    title="Sign Up"
                                />
                             </View>
                    
                </KeyboardAvoidingView>
                                        
                </ImageBackground>
            </View>
        )
    }
}

export default Register


