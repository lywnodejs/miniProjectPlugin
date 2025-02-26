import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Button, Image } from '@tarojs/components'
import './index.scss'

// const myPluginInterface = Taro.requirePlugin('myPlugin')

export default class Index extends Component {
  state = {
    encodeId: '511e510b' // 501879cb
  }
  componentDidMount () {
    // myPluginInterface.sayHello()
    // const answer = myPluginInterface.answer
    // console.log('answer: ', answer)
    Taro.login({
      success: (res) => {
        console.log('res: ', res);
      }
    })
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  handleClick = () => {
    console.log('clicked')
    Taro.setStorageSync('encodeId', this.state.encodeId)
    Taro.navigateTo({
      // url: '/pages/event/event?encodeId=' + this.state.encodeId
      url: '/pages/subPackages/activity/register/activity-register'
    })
  }

  handleInput = (e) => {
    this.setState({
      encodeId: e.target.value
    })
  }

  render () {
    return (
      <View className='index'>
        {/* <Input defaultValue={this.state.encodeId} placeholder='请输入活动encodeId' onInput={this.handleInput} /> */}

        <Button className='my-10' onClick={this.handleClick}>点击进入活动首页</Button>
        {/* <Navigator url='plugin://myPlugin/list'>
          Go to pages/list!
        </Navigator> */}
        
        <View>小程序本身不涉及直播服务，</View>
        <View>1. 进入测试小程序后 点击 ”进入活动首页“</View>
        <View>2. 填写信息后 点击”提交“  ，提示报名成功，点击”去观看直播“按钮</View>
        <View>3.  点击立即观看，会提示打开”旅游微讲堂公开课“小程序</View>
        <View>以上是测试步骤</View>
        <View>报名成功后会出现"观看直播"按钮 点击进入后点击立即观看，会跳转第三方小程序中，</View>
        <View>***由于是测试插件的小程序，并没有真实token，进入第三方小程序可能会导致其他问题，但和本插件无关</View>
        <View></View>
        <Image mode='widthFix' src={require('@/assets/image.png')}></Image>
      </View>
    )
  }
}
