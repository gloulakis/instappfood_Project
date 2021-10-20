import React from 'react'
import {View, Button} from 'react-native'
import LoginScreen from './Login'

export default function Landing({navigation}) {
    return (
        <View style={{flex:1, justifyContent:'center',backgroundColor:'rgba(228, 241, 254, 1)'}}>
            <LoginScreen/>
            <View style={{paddingBottom:'5%',shadowColor:'aqua',shadowOpacity:'.3'}}>
                <Button
                    color = "rgba(51, 110, 123, 1)"
                    title="Registration"
                    onPress={()=> navigation.navigate("Register")}
                />
            </View>

        </View>
    )
}
