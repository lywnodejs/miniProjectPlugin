import { View, Input, Label,RadioGroup,Radio } from "@tarojs/components"
import { useRef, useEffect, useState } from 'react'
import './itemInput.scss'

export default function ItemRadio({label,options=[], placeholder, type = 'text', name, value, required = true,disabled = false,set_form_data}) {
    // const inputRef = useRef();
    // useEffect(() => {
    //     if (value && inputRef.current) {
    //         inputRef.current.value = value
    //     }
    // }, [inputRef.current, value])
    return (
        <View className="input_con">
            <Label className={`label ${required ? "before:content-['*'] before:text-red-500 before:mr-2" : "before:content-['*'] before:text-white before:mr-2"}`}>
                {label}
            </Label>
            <View className="input">
                <RadioGroup className="radioGroup" name={name} onChange={(e)=>{
                    set_form_data && set_form_data({
                        key:name,
                        value:e.detail.value
                    });
                }}>
                    {
                        options.map(item=>{
                            return <View className="radio-list_item">
                                <Radio checked={item.value === value} disabled={disabled} className='radio-list__radio' value={item.value} id={item.value}></Radio>
                                <Label className='radio-list__label' for={item.value} key={item.value}>{item.label}</Label>
                            </View> 
                        })
                    }
                </RadioGroup>
            </View>
        </View>
    )
}