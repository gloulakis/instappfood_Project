import React, { Component } from 'react'
import {View,Button,ImageBackground,KeyboardAvoidingView,Alert} from 'react-native'
import firebase from 'firebase';
import { Input } from 'react-native-elements';
import {Logo} from '../main/Logo'
import LottieView from 'lottie-react-native';

export class Login extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            user: null
        }
        this.onSignIn = this.onSignIn.bind(this)
       
    }
    

    onSignIn = async ()=> {
        const { email, password } = this.state;
        await firebase.auth().signInWithEmailAndPassword(email, password)
            .then( (result) => {
                console.log(result)
            })
            .catch((error) => {
                Alert.alert(
                    'Your Email or Password is not correct please try again!'
                 )
            })
    }



    render() {
        return (
            <View style={{ flex: 1,width:'100%',height:'100%', alignItems: 'center',backgroundColor:'black' }}>
   
                <ImageBackground source={require('../Images/bakc2.jpg')} resizeMode='cover' 
                    style={{justifyContent:'center',width:'100%',height:'100%'}}>
                   
                    <KeyboardAvoidingView 
                        style={{
                                backgroundColor:'white', 
                                shadowColor:'black',
                                shadowOpacity:'.1',
                                alignItems:'center',
                                borderRadius:'40%',
                                padding:20,
                                width:'96%',
                                marginLeft:'2%',
                                marginRight:'1%'
                            }}
                            behavior='padding'>
                                  <LottieView
                            source={require('../Images/11517-christmas-bounce.json')}
                            autoPlay
                              style ={{
                                position:'absolute',
                                height:'70%',
                                width:'100%',
                                alignContent:'center',
                                opacity: 0.5
                              }}
                            />
                            <Logo/>
                            <View style={{
                                width:'100%',
                                alignItems:'center',
                                alignContent:'center',
                                padding:'5%',
                                borderRadius:'100%'}}>
                          
                                <View style={{
                                    width: '90%',
                                    shadowOpacity:'0.1',
                                    shadowColor:'#088F8F'
                                                }}>
                                    <Input
                                        placeholder=" E-mail"
                                        placeholderTextColor ='#088F8F'
                                        color='black'
                                        opacity ='.5'
                                        padding='1%'
                                        marginTop='12%'
                                        onChangeText={(email) => this.setState({ email })}
                                    />
                                    <Input
                                        placeholder=" Password"
                                        placeholderTextColor ='#088F8F'
                                        color='black'
                                        opacity ='.5'
                                        padding='1%'
                                        marginTop='12%'
                                        secureTextEntry={true}
                                        onChangeText={(password) => this.setState({ password })}
                                    />
                                </View>
                            </View>
                          
                        <View style={{
                            marginTop: '10%',
                            backgroundColor:'rgba(0, 181, 204, 1)',
                            shadowColor:'pink',
                            shadowOpacity:.3,
                            borderTopLeftRadius:'0',
                            borderTopRightRadius:'30',
                            borderBottomLeftRadius:'30',
                            borderBottomRightRadius:'30',
                            padding:6,
                            marginBottom:5
                             }}>
                            <Button
                                color = 'white'
                                onPress={() => this.onSignIn()}
                                title="Sign In"
                            />
                        </View>
                       
                    </KeyboardAvoidingView>  
                    
                </ImageBackground>
            </View>
        )
    }
}



export default Login