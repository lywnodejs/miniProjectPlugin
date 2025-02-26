import { View, Input, Label, ScrollView, RichText,Image } from "@tarojs/components"
import Taro from '@tarojs/taro'
import Loading from '@coms/loading/loading'
import { useRef, useEffect,useState } from 'react'
import Config from '@config'
import InputNameBox from './inputNameBox'
import './itemInput.scss'
import './itemSelectCompany.scss'
import { brightenKeyword, debounce } from '../../index'

export default function ItemSelectCompany({label, placeholder, name,code_name, value, required = true,disabled = false,onChange,languageData}) {
    const inputRef = useRef();
    const companyInput = useRef();
    const [isOpened,set_isOpened] = useState(false);
    const [showBoxPro,set_showBoxPro] = useState(false);
    const [loading,set_loading] = useState(false);
    const [resultCompanys,set_resultCompanys] = useState([]);
    const [label_en,set_label] = useState('');
    const [keyword,set_keyword] = useState('');
    useEffect(() => {
        if (value && inputRef.current) {
            inputRef.current.value = value;
            set_label(value);
        }
    }, [inputRef.current, value])

    const t = (key,...args)=>{
  
        if(!languageData){return ''}
        let transform_text = languageData[key] || '';
        if (args.length === 0) {return transform_text}
        let argIndex = 0;
        let replaced = transform_text.replace(/\{.*?\}/g, (match) => {
          return args[argIndex] !== undefined ? args[argIndex++] : match;
        });
        return replaced;
      }


    const showCompanyBox = () => {
        set_isOpened(true);
    }
    const closeCompanyBox = () => {
        set_isOpened(false);
    }

    const changeCompanyName = debounce(val => {
        if (!val.trim()) {
            set_resultCompanys([]);
            set_keyword('');
        } else {
            set_loading(true);
            set_keyword(val);
            set_resultCompanys([]);
            Taro.nextTick(() => {
                searchCompanyName(val)
            }) 
        }
    },500)

    const searchCompanyName = (val) => {
        val = typeof val === 'string' ? val.trim() : val
        let data = {
            page: 1,
            pageSize: 50,
            agency_id: 0,
        }
        data[code_name === 'company_en' ? 'en_name' : 'name'] = val;
        Taro.request({
            url: Config.baseUrl + '/api/system/company',
            data: data,
            method: 'GET',
        }).then(res => {
            console.log(res);
            if (res.data.status) {
                set_resultCompanys([...res.data.data.data]);
                set_loading(false);
            }
        }).catch(() => {
            set_loading(false);
        })
    }
    const renderCompanys = () => {
        let type = code_name === 'company_en' ? 'en_name' : 'name';
        return resultCompanys.map((e,i) => {
            return (
                <View key={i} className='bsg-item' onClick={()=>{
                    form_send_val(e[type],e)
                }}
                >
                    <RichText nodes={brightenKeyword(e[type],keyword)}></RichText>
                </View>
                
            )
        })
    }

    const form_send_val = (val,companyInfo)=>{
        set_label(val);
        set_isOpened(false);
        set_keyword('');
        set_resultCompanys([]);
        set_showBoxPro(false);
        inputRef.current.value = val;
        if(companyInfo && val){
            onChange && onChange(companyInfo);
        }
    }

    const boxCallBackUpdateData = (val,cal) => {
        form_send_val(val,false)
        Taro.nextTick(() => {
            cal()
        })
    }

    return (
        <View className="input_con">
            <Label className={`label ${required ? "before:content-['*'] before:text-red-500 before:mr-2" : "before:content-['*'] before:text-white before:mr-2"}`}>
                {label}
            </Label>
            <View className={`input ${disabled && 'disabled'}`}>
                <View className={`value ${label_en ? 'has-value' : ''}`} onClick={()=>{if(!disabled){showCompanyBox()}}}>{label_en ? label_en : placeholder}</View>
                <Input alwaysSystem className="select_input" ref={inputRef} name={name} type='text' />
            </View>

            <View catchMove className={`action-drowbox ${isOpened ? 'action-drowbox-active' : ''}`}>
                <View className='action-drowbox-overlay' onClick={() => closeCompanyBox()}></View>
                <View className='action-drowbox-container'>
                    <View className='action-drowbox-close' onClick={() => closeCompanyBox()}>
                        <View className='close-icon'><Image src={require('@assets/guanbi.png')}></Image></View>
                    </View>
                    <View className='adc-body'>
                        <View className='adc-body-head'>
                            <View className='adc-body-title'>
                                <View className='company-title-zh'>{languageData['register_form.text.input_select']}{label}</View>
                            </View>
                            <View className={`adc-body-search ${loading?'loading':''}`}>
                                {isOpened && <Input alwaysSystem className='search-input' ref={companyInput} placeholder={languageData['register_form.text.search'] + label} onInput={e => changeCompanyName(e.detail.value)} />}
                                {
                                    loading?
                                    <View className='search-loading'><Loading /></View>:null
                                }
                            </View>
                        </View>
                        {
                            loading && <View className='body-scroll-notdata'></View>
                        }
                        {
                            resultCompanys.length > 0?
                            <ScrollView scrollY className='body-scroll'>
                            {
                                resultCompanys.length > 0?
                                <View className='body-scroll-group'>
                                    {renderCompanys()}
                                </View>
                                :null
                            }
                            </ScrollView>
                            :null
                        }
                        {
                            resultCompanys.length==0 && keyword && !loading?
                            <View className='body-scroll-notdata'>
                                <View onClick={() => {
                                    set_isOpened(false);
                                    set_showBoxPro(true);
                                }}
                                >
                                    <View className='icon_jia'>
                                        +
                                    </View>
                                    <View className='notdata-title'>
                                        <View className='notdata-title-zh'>{t('register_form.text.select_nodata_tip')}</View>
                                    </View>
                                </View>
                            </View>:null
                        }
                        {
                            resultCompanys.length==0 && !keyword?
                            <View className='body-scroll-notdata'>
                                <View className='notdata-title'>
                                    <View className='notdata-title-zh'>
                                        <View>{t('register_form.text.select_tip')}</View>
                                        <View>{t('register_form.text.select_push_tip')}</View>
                                    </View>
                                </View>
                            </View>:null
                        }
                    </View>
                </View>
            </View>

            <InputNameBox 
              show={showBoxPro}
              close={() => set_showBoxPro(false)}
              value={keyword}
              change={(val,cal) => boxCallBackUpdateData(val,cal)}
              renderHead={(
                <View className='body-head-title'>
                    <View className='title-zh'>{t('register.tip.input_label',label)}</View>
                </View>
              )}
            />

        </View>
    )
}