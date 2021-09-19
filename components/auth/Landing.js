import React from 'react'
import {View, Button} from 'react-native'
import LoginScreen from './Login'

export default function Landing({navigation}) {
    return (
        <View style={{flex:1,marginBottom:'4%', justifyContent:'center'}}>
            <LoginScreen/>
            <View>
                <Button
                    color = "black"
                    title="Registration"
                    onPress={()=> navigation.navigate("Register")}
                />
            </View>

        </View>
    )
}
