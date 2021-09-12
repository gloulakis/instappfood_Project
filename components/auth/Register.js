import React, { Component } from 'react'
import {View,Button,TextInput} from 'react-native'
import firebase from 'firebase';

export class Register extends Component {
    constructor(props){
        super(props);
        this.state= {
            email:'',
            password:'',
            name:''
        }
        this.onSignUp = this.onSignUp.bind(this)
    }

    onSignUp = (email, password)=>{
        const {name} = this.state
           try{
               firebase.auth().createUserWithEmailAndPassword(email,password)
               .then ((result)=> {
               firebase.firestore().collection("users")
               .doc(firebase.auth().currentUser.uid)
               .set({
                   name,
                   email
               })
            })
           } catch (error){
               console.log(error);
           }

    }

    render() {
        return (
            <View>
                <TextInput
                    placeholder= "Name"
                    onChangeText={(name) => this.setState({ name })}
                />
                 <TextInput
                    placeholder= "email"
                    onChangeText={(email) => this.setState({ email })}
                />
                 <TextInput
                    placeholder= "password"
                    secureTextEntry={true}
                    onChangeText={(password) => this.setState({ password })}
                />
                <Button
                    onPress={()=> this.onSignUp(this.state.email,this.state.password)}
                    title="Sign Up"
                />
            </View>
        )
    }
}

export default Register
