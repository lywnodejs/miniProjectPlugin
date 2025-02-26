import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, Input, Image } from '@tarojs/components'
import { debounce } from '../../index'

class InputNameBox extends Component{
    constructor(props) {
        super(props)
        this.state = {
            inputVal: props.value || '',
        }
    }
    componentWillReceiveProps(props) {
        if (props.show) {
            this.setState({
                inputVal: props.value
            })
        } else {
            this.setState({
                inputVal: ''
            })
        }
    }
    close() {
        this.props.close()
    }
    change = debounce((e) => {
        let val = e.detail.value
        this.setState({
            inputVal: val
        })
    }, 500)
    confirm = debounce(() => {
        let val = this.state.inputVal
        if (!val.trim()) {
            Taro.showToast({
                title: '不能为空',
                icon: 'error',
                mask: true
            })
            return 
        }
        this.props.change(val,() => {
            this.props.close()
            this.setState({
                inputVal: ''
            })
        })
    }, 500)
    handleTouchMove = (e) => {
        e.stopPropagation()
        e.preventDefault()
    }
    render() {
        const rootClass = this.props.show?'action-drowbox action-drowbox-active':'action-drowbox'
        return (
            <View onTouchMove={ e => this.handleTouchMove(e)} className={rootClass}>
                <View className='action-drowbox-overlay'></View>
                <View className='action-drowbox-main'>
                    <View className='action-drowbox-close' onClick={this.close.bind(this)}>
                        <View className='close-icon'><Image src={require('@assets/guanbi.png')}></Image></View>
                    </View>
                    <View className='adm-body'>
                        <View className='adm-body-head'>
                            <View className='input-company-view'>
                                {this.props.show && <Input alwaysSystem className='input-company-name' value={this.state.inputVal} onInput={this.change.bind(this)}/>}
                            </View>

                            {this.props.renderHead}
                        </View>
                        <View className='btn-add' onClick={this.confirm.bind(this)}>
                            <View className='btn-add-zh'>确认添加</View>
                            <View className='btn-add-en'>Confirm</View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

export default InputNameBox