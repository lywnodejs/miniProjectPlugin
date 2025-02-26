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
            values: value,
            options:[],
            options1:[],
            options2:[]
        }
    }

    componentWillReceiveProps(nextProps) {
        const { isOpened, value, range } = nextProps
        if (isOpened !== this.state._isOpened) {
            this.setState({
                _isOpened: isOpened
            })
            !isOpened && this.close()
        }
        let val = Array.isArray(value)?value:[value]
        if (val != this.state.values) {
            this.setState({
                values: val
            })
        }

        let values = this.state.values;
        if(range.length !==0){
            let arr = [];
            range.map(item=>{
                arr.push({label:item.label,value:item.value});
            })
            this.setState({options:arr})
            this.renderOptions(values,true,true,true)
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
        let {values,options,options1,options2} = this.state;
        let value = [];
        let label = [];
        if(options){value.push(options[values[0]].value);label.push(options[values[0]].label)}
        if(options1.length !==0){value.push(options1[values[1]].value);label.push(options1[values[1]].label)}
        if(options2.length !==0){value.push(options2[values[2]].value);label.push(options2[values[2]].label)}
        this.props.onChange({value,label});
        Taro.nextTick(() => {
            this.close()
        })
    }
    renderOptions = (val,lev,lev1,lev2)=>{
        
        let range = this.props.range;
        let _values = val || [];
        let arr1 = [];
        let arr2 = [];
        
        if(lev && range[val[0]]?.children){
            _values=[val[0],0,0];
        }
        if(lev1 && range[_values[0]]?.children[_values[1]]?.children){
            _values=[_values[0],_values[1],0];
        }
        if(lev2){
            _values = [_values[0],_values[1],val[2]];
        }
        range[_values[0]]?.children && range[_values[0]].children.map(item=>{
            arr1.push({label:item.label,value:item.value});
        })
        range[_values[0]]?.children[_values[1]]?.children && range[_values[0]]?.children[_values[1]]?.children.map(item=>{
            arr2.push({label:item.label,value:item.value});
        })
        this.setState({
            options1:arr1,
            options2:arr2,
            values:_values
        });
    }
    onChange(e) {
        if (!this.state._isOpened) return
        let val = e.detail.value
        let {values} = this.state;

        if(val[0] !== undefined){
            if(val[0] !== values[0]){
                this.renderOptions(val,true,true);
            }
        }
        if(val[1] !== undefined){
            if(val[1] !== values[1]){
                this.renderOptions(val,false,true);
            }
        }
        if(val[2] !== undefined){
            if(val[2] !== values[2]){
                this.renderOptions(val,false,false,true);
            }
        }
    }
    render() {
        const { _isOpened, values, options,options1, options2 } = this.state
        const rootClass = classNames('custom-picker',{
            'custom-picker-active': _isOpened
        })
        const dfStyle = `height:500rpx`
        return (
            <View className={rootClass}>
                <View onClick={e => this.close(e)} className='custom-picker-overlay' />
                <View className='custom-picker-container'>
                    <View className='custom-picker-head'>
                        <View className='custom-picker-cancel' onClick={this.close.bind(this)}>取消</View>
                        <View className='custom-picker-ok' onClick={this.changeData.bind(this)}>确定</View>
                    </View>
                    {
                        this.props.renderHeader?
                        <View>{this.props.renderHeader}</View>:null
                    }
                    <PickerView 
                        indicatorClass='custom-picker-main'
                        value={values}
                        style={dfStyle}
                        onChange={this.onChange.bind(this)}
                    >
                        <PickerViewColumn>
                            {
                                options.map((e,index) => {
                                    return (
                                        <View className={`picker-view-column ${values[0] == index?'active':''}`}>
                                            {e['label']}
                                        </View>
                                    )
                                })
                            }
                        </PickerViewColumn>
                        {
                            options1.length!==0 && <PickerViewColumn>
                                {
                                    options1.map((e,index) => {
                                        return (
                                            <View className={`picker-view-column ${values[1] == index?'active':''}`}>
                                                {e['label']}
                                            </View>
                                        )
                                    })
                                }
                            </PickerViewColumn>
                        }
                        {
                            options2.length!==0 && <PickerViewColumn>
                                {
                                    options2.map((e,index) => {
                                        return (
                                            <View className={`picker-view-column ${values[2] == index?'active':''}`}>
                                                {e['label']}
                                            </View>
                                        )
                                    })
                                }
                            </PickerViewColumn>
                        }
                        
                        
                    </PickerView>
                </View>
            </View>
        )
    }
}
export default CustomPicker