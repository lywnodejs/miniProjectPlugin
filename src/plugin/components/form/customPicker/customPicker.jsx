import classNames from 'classnames'
import Taro from '@tarojs/taro'
import { Component } from 'react'
import { View, PickerView, PickerViewColumn } from '@tarojs/components'
import './customPicker.scss'

class CustomPicker extends Component{
    constructor(props) {
        super(props)
        const { isOpened, value } = props
        this.state = {
            _isOpened: isOpened,
            value: value,
        }
    }
    componentWillReceiveProps(nextProps) {
        const { isOpened, value } = nextProps
        if (isOpened !== this.state._isOpened) {
            this.setState({
                _isOpened: isOpened
            })
            !isOpened && this.close()
        }
        
        if (value != this.state.value) {
            this.setState({
                value:value
            })
        }
    }
    handleClose = () => {
        if (typeof this.props.onClose === 'function') {
            this.props.onClose()
        }
    }
    close() {
        this.setState({
            _isOpened: false
        }, this.handleClose )
    }
    changeData() {
        this.props.onChange(this.state.value || this.props.range[0].value)
        Taro.nextTick(() => {
            this.close()
        })
    }
    renderColumn(data,index) {
        let rangeKey = this.props.rangeKey || ''
        let value = this.state.value;
        let selectIndex = this.props.range.findIndex(item=>item.value === value);
        return <PickerViewColumn>
            {
                data.map((e,index) => {
                    return (
                        <View className={`picker-view-column ${selectIndex == index?'active':''}`}>
                            {e[rangeKey]}
                        </View>
                    )
                })
            }
        </PickerViewColumn>
    }
    onChange(e) {
        if (!this.state._isOpened) return
        let value = this.props.range[e.detail.value].value;
        this.setState({
            value: value
        },() => {
            if (!this.state._isOpened) {
                this.changeData()
            }
            typeof this.props.onColumnChange === 'function' && this.props.onColumnChange(value)
        })
    }
    render() {
        const { _isOpened, value } = this.state
        const { range,languageData } = this.props
        
        const rootClass = classNames('custom-picker',{
            'custom-picker-active': _isOpened
        })
        const dfStyle = `height:500rpx`
        return (
            <View className={rootClass}>
                <View onClick={e => this.close(e)} className='custom-picker-overlay' />
                <View className='custom-picker-container'>
                    <View className='custom-picker-head'>
                        <View className='custom-picker-cancel' onClick={this.close.bind(this)}>{languageData['common.button.cancel']}</View>
                        <View className='custom-picker-ok' onClick={this.changeData.bind(this)}>{languageData['common.button.confirm']}</View>
                    </View>
                    {
                        this.props.renderHeader?
                        <View>{this.props.renderHeader}</View>:null
                    }
                    <PickerView 
                        indicatorClass='custom-picker-main'
                        value={[this.props.range.findIndex(item=>item.value === value)]}
                        style={dfStyle}
                        onChange={this.onChange.bind(this)}
                    >
                        {this.renderColumn(range)}
                    </PickerView>
                </View>
            </View>
        )
    }
}
export default CustomPicker