import React, { Component } from 'react'
import {Image,View} from 'react-native'

export class BlackLogo extends Component {
    render() {
        return (
            <Image 
            source={require('../Images/MonoChromeLogo.png')}  
            style={{
                aspectRatio: 4,
                margin:'2%',
                height:'5%',
                resizeMode:'contain',
                alignContent:'center',
                alignItems:'center'
            }}
            />

            

        )
    }
}

export default BlackLogo
