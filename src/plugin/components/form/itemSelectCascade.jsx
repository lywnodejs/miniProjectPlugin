import { View, Input, Label,Picker } from "@tarojs/components"
import { useRef, useEffect,useState } from 'react'
import CustomPicker from './customPicker/customPickerM'
import './itemInput.scss'

const getEffectiveOptions = (options = [], chinaOnly = false, defaultCountryId = 6906) => {
    if (!chinaOnly) {
        return options;
    }
    return options.find(item => `${item.value}` === `${defaultCountryId}`)?.children || [];
}

const normalizeCascadeValue = (value, chinaOnly = false, defaultCountryId = 6906) => {
    if (value === '' || value === undefined || value === null) {
        return '';
    }

    const nextValue = (Array.isArray(value) ? value : `${value}`.split(','))
        .filter(item => item !== '' && item !== undefined && item !== null);

    if (nextValue.length === 0) {
        return '';
    }
    if (!chinaOnly) {
        return nextValue;
    }
    if (`${nextValue[0]}` !== `${defaultCountryId}`) {
        return '';
    }
    return [defaultCountryId, ...nextValue.slice(1, 3)];
}

const getCascadeMeta = (options = [], value, chinaOnly = false, defaultCountryId = 6906) => {
    if (!value || value.length === 0) {
        return {
            labels: null,
            pickerValue: [0, 0, 0]
        };
    }

    if (chinaOnly) {
        const currentOptions = getEffectiveOptions(options, true, defaultCountryId);
        const provinceIndex = currentOptions.findIndex(item => `${item.value}` === `${value[1]}`);
        if (provinceIndex === -1) {
            return {
                labels: null,
                pickerValue: [0, 0, 0]
            };
        }

        const province = currentOptions[provinceIndex];
        const cityOptions = province.children || [];
        const cityIndex = cityOptions.findIndex(item => `${item.value}` === `${value[2]}`);
        const labels = [province.label];
        if (cityIndex !== -1) {
            labels.push(cityOptions[cityIndex].label);
        }

        return {
            labels,
            pickerValue: [provinceIndex, cityIndex === -1 ? 0 : cityIndex, 0]
        };
    }

    const countryIndex = options.findIndex(item => `${item.value}` === `${value[0]}`);
    if (countryIndex === -1) {
        return {
            labels: null,
            pickerValue: [0, 0, 0]
        };
    }

    const country = options[countryIndex];
    const labels = [country.label];
    let provinceIndex = 0;
    let cityIndex = 0;

    if (Array.isArray(country.children)) {
        provinceIndex = country.children.findIndex(item => `${item.value}` === `${value[1]}`);
        if (provinceIndex !== -1) {
            labels.push(country.children[provinceIndex].label);
            const cityOptions = country.children[provinceIndex].children || [];
            cityIndex = cityOptions.findIndex(item => `${item.value}` === `${value[2]}`);
            if (cityIndex !== -1) {
                labels.push(cityOptions[cityIndex].label);
            }
        }
    }

    return {
        labels,
        pickerValue: [countryIndex, provinceIndex === -1 ? 0 : provinceIndex, cityIndex === -1 ? 0 : cityIndex]
    };
}

export default function ItemSelectCascade({label,options, placeholder, name, value, required = true,disabled = false,languageData,chinaOnly = false,defaultCountryId = 6906}) {
    const inputRef = useRef();
    const [isOpened,set_isOpened] = useState(false);
    const [values,setValues] = useState(null);
    const [pickerValue, setPickerValue] = useState([0,0,0]);

    useEffect(() => {
        const normalizedValue = normalizeCascadeValue(value, chinaOnly, defaultCountryId);
        if (inputRef.current) {
            inputRef.current.value = normalizedValue || '';
        }

        const cascadeMeta = getCascadeMeta(options, normalizedValue, chinaOnly, defaultCountryId);
        setValues(cascadeMeta.labels);
        setPickerValue(cascadeMeta.pickerValue);
    }, [options, value, chinaOnly, defaultCountryId])


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
                            value={pickerValue}
              languageData={languageData}
              rangeKey="label"
                            range={getEffectiveOptions(options, chinaOnly, defaultCountryId) || []}
              onChange={(params)=>{
                setValues(params.label);
                                inputRef.current.value = chinaOnly ? [defaultCountryId, ...params.value] : params.value;
              }}
            >
            </CustomPicker>
            
        </View>
    )
}