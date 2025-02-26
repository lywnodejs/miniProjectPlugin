import { View, Input, Label } from "@tarojs/components"
import { useRef, useEffect,useState } from 'react'
import CustomPicker from './customPicker/customPicker'
import './itemInput.scss'

export default function ItemSelect({label,options, placeholder, name,name_en, value, required = true,disabled = false,set_form_data,languageData}) {
    const inputRef = useRef();
    const [isOpened,set_isOpened] = useState(false);
    const [label_en,set_label] = useState('');
    useEffect(() => {
        if(value !== '' && value !== undefined && value !== null && options){
            if(name_en === 'position_id'){
                let _options = options.map(item=>item.value+'');
                if(!_options.includes(value+'')){
                    value = 0;
                }
            }
            if (inputRef.current) {
                inputRef.current.value = value
            }
            let val = options.find(item=>item.value == value);
            if(val){
                set_label(val.label)
            }
        }
        
    }, [inputRef.current, value,options])
    return (
        <View className="input_con">
            <Label className={`label ${required ? "before:content-['*'] before:text-red-500 before:mr-2" : "before:content-['*'] before:text-white before:mr-2"}`}>
                {label}
            </Label>
            <View className={`input ${disabled && 'disabled'}`}>
                <View className={`value ${label_en ? 'has-value' : ''}`} onClick={()=>{if(!disabled){set_isOpened(true)}}}>{label_en ? label_en : placeholder}</View>
                <Input className="select_input" ref={inputRef} name={name}></Input>
            </View>
            <CustomPicker 
              isOpened={isOpened}
              onClose={() => set_isOpened(false)}
              value={inputRef?.current?.value}
              rangeKey='label'
              languageData={languageData}
              range={options}
              onChange={(val)=>{
                inputRef.current.value = val;
                set_label(options.find(item=>item.value == val).label);
                set_form_data && set_form_data({
                    key:name,
                    value:val
                });
            }}
            />
        </View>
    )
}