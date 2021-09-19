import React, { Component } from 'react'
import {View,Button,TextInput,Image} from 'react-native'
import firebase from 'firebase';
import Logo from './Logo'
import { Input, Card } from 'react-native-elements';

export class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            name: '',
            bio: ''
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
            <View style={{ flex: 1,marginTop: '10%', alignItems: 'center' }}>
                 <Logo/>
                <Input
                    placeholder="Username"
                    onChangeText={(name) => this.setState({ name })}
                />
                <Input
                    placeholder="Bio"
                    onChangeText={(bio) => this.setState({ bio })}
                />
                <Input
                    placeholder="E-Mail address"
                    onChangeText={(email) => this.setState({ email })}
                />
                <Input
                    placeholder="Password"
                    secureTextEntry={true}
                    onChangeText={(password) => this.setState({ password })}
                />
                <Button
                    onPress={() => this.onSignUp()}
                    title="Sign Up"
                />
            </View>
        )
    }
}

export default Register