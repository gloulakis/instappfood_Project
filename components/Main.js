import React, { Component } from 'react'
import { View,Text } from 'react-native'

import {connect} from 'react-redux'
import { bindActionCreators } from 'redux'
import {fetchUser} from '../redux/actions/index'

export class Main extends Component {
    componentDidMount(){

    }
    render() {
        return (
            <view style={{flex: 1, justifyContent:'center'}}>
                <Text>
                    user is logged in
                </Text>
            </view>

        )
    }
}



export default Main
