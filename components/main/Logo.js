import React, { Component } from 'react'
import {Image} from 'react-native'

export class Logo extends Component {
    render() {
        return (
            <Image 
            source={require('../Images/logo.png')}  
            style={{
                height:'12%',
                width:'60%',
                marginTop:'1%',
                alignContent:'center',
                alignItems:'center',
            }}
        />
        )
    }
}

export default Logo
