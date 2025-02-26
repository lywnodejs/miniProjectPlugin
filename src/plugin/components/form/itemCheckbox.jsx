import { View, Input, Label,CheckboxGroup,Checkbox } from "@tarojs/components"
import { useRef, useEffect, useState } from 'react'
import './itemInput.scss'
export default function ItemInput({label,options=[], placeholder, set_form_data, name, value=[], required = true,disabled = false}) {
    const inputRef = useRef();
    useEffect(() => {
        if (value && inputRef.current) {
            inputRef.current.value = value
        }
        console.log(value);
        
    }, [inputRef.current, value])
    return (
        <View className="input_con">
            <Label className={`label ${required ? "before:content-['*'] before:text-red-500 before:mr-2" : "before:content-['*'] before:text-white before:mr-2"}`}>
                {label}
            </Label>
            <View className="input">
                <CheckboxGroup className="radioGroup" name={name} onChange={(e)=>{
                    set_form_data && set_form_data({
                        key:name,
                        value:e.detail.value
                    });
                }}
                >
                    {
                        options.map(item=>{
                            return <View key={item.value} className="radio-list_item">
                                <Checkbox checked={value.includes(item.value)} disabled={disabled} className='radio-list__radio' value={item.value} id={item.value}></Checkbox>
                                <Label className='radio-list__label' for={item.value} key={item.value}>{item.label}</Label>
                            </View> 
                        })
                    }
                </CheckboxGroup>
            </View>
        </View>
    )
}