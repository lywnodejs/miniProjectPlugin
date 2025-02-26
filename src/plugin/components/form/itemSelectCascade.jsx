import { View, Input, Label,Picker } from "@tarojs/components"
import { useRef, useEffect,useState } from 'react'
import CustomPicker from './customPicker/customPickerM'
import './itemInput.scss'

export default function ItemSelectCascade({label,options, placeholder, name, value, required = true,disabled = false,languageData}) {
    const inputRef = useRef();
    const [isOpened,set_isOpened] = useState(false);
    const [values,setValues] = useState(null);
    useEffect(() => {
        if (value && inputRef.current) {
            inputRef.current.value = value
        }
        
    }, [inputRef.current, value])

    useEffect(()=>{
        let arr = [];
        value = value || [];
        options.map((item)=>{
            if(item.value == value[0]){
                arr.push(item.label);
                if(Array.isArray(item.children)){
                    item.children.map((itemB)=>{
                        if(itemB.value == value[1]){
                            arr.push(itemB.label);
                            if(Array.isArray(itemB.children)){
                                itemB.children.map((itemC)=>{
                                    if(itemC.value == value[2]){
                                        arr.push(itemC.label);
                                    }
                                })
                            }
                        }
                    })
                }
            }
        })
        if(arr.length > 0){
            setValues(arr);
        }
        
    },[options])


    return (
        <View className="input_con">
            <Label className={`label ${required ? "before:content-['*'] before:text-red-500 before:mr-2" : "before:content-['*'] before:text-white before:mr-2"}`}>
                {label}
            </Label>
            <View className={`input ${disabled && 'disabled'}`}>
            <View className={`value ${inputRef?.current?.value ? 'has-value' : ''}`} onClick={()=>{if(!disabled){set_isOpened(true)}}}>{values ? values.join('/') : placeholder}</View>
            <Input className="select_input" ref={inputRef} name={name}></Input>
            </View>
            <CustomPicker
              isOpened={isOpened}
              onClose={() => set_isOpened(false)}
              value={[0,0,0]}
              languageData={languageData}
              rangeKey="label"
              range={options || []}
              onChange={(params)=>{
                setValues(params.label);
                inputRef.current.value = params.value;
              }}
            >
            </CustomPicker>
            
        </View>
    )
}