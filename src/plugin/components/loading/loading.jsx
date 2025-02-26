import { Component } from 'react'
import { View } from '@tarojs/components'
import './loading.scss'

class Loading extends Component{
    render() {
        const { color } = this.props

        const colorStyle = {
            border: color ? `1px solid ${color}` : '',
            borderColor: color ? `${color} transparent transparent transparent` : ''
        }
        const ringStyle = Object.assign({}, colorStyle)
        return (
            <View className='at-loading'>
                <View className='at-loading__ring' style={ringStyle}></View>
                <View className='at-loading__ring' style={ringStyle}></View>
                <View className='at-loading__ring' style={ringStyle}></View>
            </View>
        )
    }
}
Loading.defaultProps = {
    size: 0,
    color: ''
}
export default Loading