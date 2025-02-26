import { View, Textarea, Label } from "@tarojs/components"
import { useRef, useEffect } from 'react'
import './itemInput.scss'
export default function ItemTextarea({label, maxlength, placeholder, type = 'text', name, value, required = true,disabled = false}) {
    const inputRef = useRef()
    useEffect(() => {
        if (value && inputRef.current) {
            inputRef.current.value = value
        }
    }, [inputRef.current, value])
    return (
        <View className="input_con">
            <Label className={`label ${required ? "before:content-['*'] before:text-red-500 before:mr-2" : "before:content-['*'] before:text-white before:mr-2"}`}>
                {label}
            </Label>
            <View className="input">
                <Textarea maxlength={maxlength} disabled={disabled} ref={inputRef} name={name} type={type} placeholder={placeholder} />
            </View>
        </View>
    )
}