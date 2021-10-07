import React, { Component } from 'react'
import {View,Button} from 'react-native'
import firebase from 'firebase';
import { Input } from 'react-native-elements';
import Logo from './Logo';


export class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
        }

        this.onSignIn = this.onSignIn.bind(this)
    }

    onSignIn =async ()=> {
        const { email, password } = this.state;
        await firebase.auth().signInWithEmailAndPassword(email, password)
            .then( (result) => {
                console.log(result)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    render() {
        return (
            
            <View style={{ flex: 1,marginTop: '30%', alignItems: 'center' }}>
                <Logo/>
                <View style={{marginTop: '9%',width: '70%'}}>
                    <Input
                        placeholder=" E-mail"
                        onChangeText={(email) => this.setState({ email })}
                        leftIcon={{ type: 'font-awesome', name: 'envelope'}}
                    />
                    <Input
                        placeholder=" Password"
                        secureTextEntry={true}
                        onChangeText={(password) => this.setState({ password })}
                        leftIcon={{ type: 'font-awesome', name: 'unlock-alt' }}
                    />
                </View>
                <View style={{marginTop: '5%'}}>
                    <Button
                        color = '#2196F3'
                        onPress={() => this.onSignIn()}
                        title="Sign In"
                    />
                </View>
            </View>

        )
    }
}



export default Login