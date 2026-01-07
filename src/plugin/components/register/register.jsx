import Taro from '@tarojs/taro'
import { useState, useEffect } from 'react'
import { View, Button, Form, Image, Navigator,Icon } from '@tarojs/components'
import ItemInput from '@coms/form/itemInput'
import ItemSelect from '@coms/form/itemSelect'
import ItemTextarea from '@coms/form/itemTextarea'
import ItemRadio from '@coms/form/itemRadio'
import ItemCheckbox from '@coms/form/itemCheckbox'
import ItemSelectCascade from '@coms/form/itemSelectCascade'
import ItemSelectCompany from '@coms/form/itemSelectCompany'
import Loading from '@coms/loading/loading'
import { convertTimeByOffset } from '../../index.js';
import Config from '@config'
import './register.scss'
import Schema from "async-validator"

export default function Register (props) {

  const parsedParams = props.parsedParams; // 暂时保留的参数 后期可能需要
  const eid = props.eid;
  const lang = props.lang;
  const customCompany = props.customCompany;
  const is_test = props.is_test;
  const languageData = props.languageData || {};
  const token = props.token;
  const agencyId = props.agencyId;
  const offline = parsedParams?.l === '1';
  const user_limit_exceed = parsedParams?.e === '1'; // 是否忽略报名限制
  const user = props.userInfo;
  const regions = props.regions;
  const [hasPrevPage, set_hasPrevPage] = useState(true);
  const [userInfo, set_userInfo] = useState({});
  const [detail, set_detail] = useState();
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState('');
  const [showLive, setShowLive] = useState(false);
  const [theme, setTheme] = useState();
  const [name_array, set_name_array] = useState([]);
  const [form_validFrom, set_form_validFrom] = useState({});
  const [show_success, set_show_success] = useState(false);
  const [form_data, set_form_data] = useState({});
  const [company, set_company] = useState({});
  const [is_off, set_is_off] = useState(true); // 开关
  const [user_limit_exceed_btn, set_user_limit_exceed_btn] = useState(false); // 报名人数已达上限或者报名已关闭按钮

  const [current_registrable, set_current_registrable] = useState(false); // 当前是否可以报名
  const [registration_state, set_registration_state] = useState(0); // 已报名状态 0 未报名 ·1 审核中 2 已通过 3 已拒绝
  const [off_registration_cancelable, set_off_registration_cancelable] = useState(false); // 是否可以取消报名
  const [off_checkin, set_off_checkin] = useState(false); // 是否已报名未签到
  const [check_status, set_check_status] = useState(1); // 0 签到失败 1 签到成功

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


  useEffect(() => {
    const pages = Taro.getCurrentPages();
    if(pages.length > 1){
      set_hasPrevPage(true);
    }else{
      set_hasPrevPage(false);
    }
  }, [])


  useEffect(() => {
    if (props.detail && is_off) {
      set_is_off(false);
      getRegistrationInfo(props.detail);
    }
  }, [props.detail])

  const handleErrors = msg => {
    Taro.showToast({
        icon: 'none',
        title: msg,
    })
  }

  const show_toast = (data) => {
    if(!data?.event?.registrable){
      Taro.showToast({icon: 'none',title: t('event.tip.register_closed'),duration: 3000});
      set_current_registrable(false);
      set_user_limit_exceed_btn(true);
      return false;
    }
    if(data.event.user_limit_exceed){
      Taro.showToast({icon: 'none',title: t('event.tip.register_full'),duration: 3000});
      set_current_registrable(false);
      set_user_limit_exceed_btn(true);
      return false;
    }
  }


  const getRegistrationInfo = (res) => {
    if (res.data) {
      let fromOffset = {offset:8,timezone:'UTC+08:00'};
      if(res.data.event?.timezones && res.data.event.timezones.length > 0){
        fromOffset = res.data.event.timezones[0];
      }
      res.data.event.registration_start_time = convertTimeByOffset(res.data.event.registration_start_time,8,fromOffset.offset) + `（${fromOffset.timezone}）`;
      res.data.event.registration_deadline = convertTimeByOffset(res.data.event.registration_deadline,8,fromOffset.offset) + `（${fromOffset.timezone}）`;
      set_detail(res.data);
      set_off_registration_cancelable(res.data?.event.registration_cancelable || false);
      let registrable = res.data?.event.registrable;
      if (!offline) {
        set_current_registrable(res.data?.event.registration_state === 1 && registrable);
      } else {
        set_current_registrable(true);
      }
      if(!user_limit_exceed){
        if(!(res.data.registration && !res.data.registration?.canceled_at)){
          show_toast(res.data);
        }
      }
      
    }
    if (res.data.registration !== null) {
      let registration = res.data.registration;
      let user_info = registration.values;
      set_userInfo(user_info);
      set_form_data(user_info);
      let use_registration_state = 0;
      if (registration?.state !== 3) {
        use_registration_state = registration?.state;
      }
      if (registration?.canceled_at) {
        use_registration_state = 0;
      }

      if (offline) {
        if (registration?.checkin_at) {
          use_registration_state = 2;
          set_show_success(true);
        } else {
          if (registration?.created_at && !registration?.canceled_at) {
            use_registration_state = 1;
            set_off_checkin(true);
            set_show_success(true);
          } else {
            use_registration_state = 0;
          }
        }
      }
      set_registration_state(use_registration_state);
    }
    let event = res.data.event;
    let copy_user = {
      ...user,
      phone: user.tel,
      region: user.country_id === 0 ? '' : [user.country_id, user.province_id, user.city_id]
    };
    let form_user_data = {};
    let banner_url = event.registration_form?.banner?.url;
    if (res.data.landing_page) {
      res.data.landing_page.modules.map(item => {
        if (item.slug === 'live' && item.show) {
          if (item.value && item.value.length !== 0) { setShowLive(true); }
        }
      })
    }
    let fields = event.registration_form?.fields;
    let form_valid_from = {};
    let form_names_array = [];

    let renderRule = (item) => {
      let attributes_type = item.attributes.type === 'checkbox' || item.attributes.type === 'cascade' || item.attributes.type === 'address';
      if (attributes_type) {
        if (!form_names_array.includes(item.uuid)) {
          form_names_array.push(item.uuid);
        }
      }
      let rule = {
        type: 'string',
        required: item.validations.required,
        whitespace: attributes_type ? false : true,
      }
      if (item.name === 'email' || item.name === 'phone') {
        rule.validator = (rule, value) => {
          value = typeof value === 'number' ? value.toString().trim() : value;
          if (value) {
            let test_reg = item.name === 'email' ? /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/ : /^[+\d][\d-]+\d$/;
            if (!test_reg.test(value)) {
              handleErrors(t('register.tip.format_error',item.label))
              return false
            }
          } else {
            if (!item.validations.required) {
              return true
            } else {
              handleErrors(t('register.tip.input_label',item.label))
              return false
            }
          }
          return true;
        }
      } else {
        rule.message = () => handleErrors(t('register.tip.input_label',item.label));
      }
      if(item.attributes.type === 'radio' || item.attributes.type === 'checkbox' || item.type === 'select'){
        rule.message = () => handleErrors(t('register.tip.select_label',item.label));
      }

      if (item.name === 'region') {
        form_user_data[item.uuid] = copy_user['region'];
      }
      if (item.name === 'phone') {
        form_user_data[item.uuid] = copy_user['phone'];
      }
      if (copy_user[item.name] !== '' || copy_user[item.name] !== undefined || copy_user[item.name] !== null) {
        form_user_data[item.uuid] = copy_user[item.name];
      }

      return rule
    }
    fields && fields.map(item => {
      form_valid_from[item.uuid] = renderRule(item);
      if (item.attributes.type === 'radio' || item.attributes.type === 'single') {
        item.attributes.options.map(im => {
          if (im.children) {
            im.children.map(im_children => {
              form_valid_from[im_children.uuid] = renderRule(im_children);
            })
          }
        })
      }
    })
    if (res.data.registration === null && user?.id) {
      set_userInfo(form_user_data);
      set_form_data(form_user_data);
    }
    set_name_array(form_names_array);
    set_form_validFrom(form_valid_from)

    setTheme(res.data.landing_page.theme_color);
    if (banner_url) {
      setBanner(banner_url);
    }
    setLoading(false);
  }

  const oldUserDisabled = (item) => {
    let val_bool = false;
    let value = userInfo[item.uuid];
    if (value !== '' && value !== undefined && value !== null) {
      val_bool = true;
    }
    return registration_state !== 0 || !current_registrable || val_bool && !item.editable && !!user.id
  }

  const setFormData = (data) => {
    set_form_data({ ...form_data, [data.key]: data.value })
  }


  const formChange = (val, item) => {
    let copy_userInfo = { ...userInfo };
    if (item.name === 'company_en') {
      if (!copy_userInfo[company.company]) {
        copy_userInfo[company.company] = val.name;
      }
    } else {
      if (!copy_userInfo[company.company_en]) {
        copy_userInfo[company.company_en] = val.en_name;
      }
    }
    set_userInfo(copy_userInfo);

  }

  const renderFormItem = (item) => {
    if (item.type === 'input') {
      if (item.attributes.type === 'text') {
        if (customCompany) {
          if (item.name === 'company_en' || item.name === 'company') {
            let copy_company = { ...company };
            if (!copy_company[item.name]) {
              copy_company[item.name] = item.uuid;
              set_company(copy_company);
            }
            return <ItemSelectCompany languageData={languageData} maxlength={item.validations.maxLength} required={item.validations.required} disabled={oldUserDisabled(item)} label={item.label} placeholder={item.placeholder} code_name={item.name} name={item.uuid} value={userInfo[item.uuid]} onChange={(val) => formChange(val, item)} />
          }
        }

        return <ItemInput maxlength={item.validations.maxLength} required={item.validations.required} disabled={oldUserDisabled(item)} label={item.label} placeholder={item.placeholder} name={item.uuid} value={userInfo[item.uuid]} />
      }
      if (item.attributes.type === 'radio') {
        return <>
          <ItemRadio options={item.attributes.options} required={item.validations.required} disabled={oldUserDisabled(item)} label={item.label} placeholder={item.placeholder} name={item.uuid} value={userInfo[item.uuid] || form_data[item.uuid]} set_form_data={setFormData} />
          {
            item.attributes.options.map(im => {
              if (im.children && form_data[item.uuid] == im.value) {
                return im.children.map(opt_im => {
                  return opt_im.enabled && renderFormItem(opt_im);
                })
              }
            })
          }
        </>
      }
      if (item.attributes.type === 'checkbox') {
        return <ItemCheckbox options={item.attributes.options} required={item.validations.required} disabled={oldUserDisabled(item)} label={item.label} placeholder={item.placeholder} name={item.uuid} value={userInfo[item.uuid] || form_data[item.uuid]} set_form_data={setFormData} />
      }
    }
    if (item.type === 'textarea') {
      return <ItemTextarea maxlength={item.validations.maxLength} required={item.validations.required} disabled={oldUserDisabled(item)} label={item.label} placeholder={item.placeholder} name={item.uuid} value={userInfo[item.uuid]} />
    }
    if (item.type === 'select') {
      if (item.attributes.type === 'cascade') {
        return <ItemSelectCascade languageData={languageData} options={item.attributes.options} required={item.validations.required} disabled={oldUserDisabled(item)} label={item.label} placeholder={item.placeholder} name={item.uuid} value={userInfo[item.uuid]} />
      }
      if (item.attributes.type === 'address') {
        return <ItemSelectCascade languageData={languageData} options={regions} required={item.validations.required} disabled={oldUserDisabled(item)} label={item.label} placeholder={item.placeholder} name={item.uuid} value={userInfo[item.uuid]} />
      }
      if (item.attributes.type === 'single') {
        return <>
          <ItemSelect languageData={languageData} options={item.attributes.options} required={item.validations.required} disabled={oldUserDisabled(item)} label={item.label} placeholder={item.placeholder} name={item.uuid} name_en={item.name} value={userInfo[item.uuid]} set_form_data={setFormData} />
          {
            item.attributes.options.map(im => {
              if (im.children && form_data[item.uuid] == im.value) {
                return im.children.map(opt_im => {
                  return opt_im.enabled && renderFormItem(opt_im);
                })
              }
            })
          }
        </>
      }
    }
  }

  const formSubmit = (e) => {
    if (offline === true) {
      if (registration_state !== 0) {
        return props.handleCheckin(data=>{
          if(data.code === 200  || data.code === 0){
            if(data?.data?.is_bug){
              set_check_status(0);
            }
            set_registration_state(2);
            set_show_success(true);
          }
        }) // 签到
      } 
    }
    let data = e.detail.value
    let filters_form_validFrom = {}; // 更新之后的表单验证规则
    name_array.map(item => { // 表单值为数组格式的，转为字符串
      if (Array.isArray(data[item])) {
        data[item] = data[item].join(',');
      }
    })
    Object.keys(data).map(key=>{ // 变单值为字符串的，前后置空+更新表单规则
      if(!Array.isArray(data[key])){
        if(typeof value !== 'number'){
          data[key] = data[key].trim();
        }
      }
      filters_form_validFrom[key] = form_validFrom[key];
    })
    const validator = new Schema(filters_form_validFrom);
    validator.validate(data, (errors) => {
      if (errors) {
        console.log("出错啦", errors)
        return 
      }
      name_array.map(item=>{
        if(data[item]){
          if(data[item] !== ''){
            data[item] = data[item].split(',');
          }else{
            data[item] = [];
          }
        }
      })
      data.action = 'eventRegister';
      // 可以提交
      props.handleSubmit(data,(data)=>{
        if(data.code === 200 || data.code === 0){
          const off_registration_approval_required = detail?.event.registration_approval_required || false;
          if(off_registration_approval_required && !offline){
            set_registration_state(1);
          }else{
            if(data?.data?.is_bug){
              if(offline){
                set_check_status(0);
                set_registration_state(2);
                set_show_success(true);
              }else{
                Taro.showToast({icon: 'none',title: t('apply_info_need_audit'),duration: 3000});
                set_registration_state(1);
              }
            }else{
              set_registration_state(2);
              set_show_success(true);
            }
          }
        }else{
          Taro.showToast({icon: 'none', title: data?.message || t('common.tip.network_error')})
        }
        
      });
    })
  }

  const canceled_click = () => {
    props.handleCancel && props.handleCancel();
  }

  const getBtnText = () => {
    if(detail.is_special_events){
      return '提交成功'
    }
    return t('register.tip.register_success')
  }


  const registration_form = detail?.event.registration_form;

  if (loading) {
    return <View className='flex justify-center items-center h-screen'><Loading /></View>
  }

  return (

    <View className="bg-gray-a2 min-h-screen activity-register">
      {
        banner && <View class='banner'>
          <Image mode="widthFix" className='banner-img' src={banner}></Image>
        </View>
      }

      <View className="box">
        {registration_form?.title && !off_checkin && registration_state !== 2 && <View className="page_title">{registration_form.title}</View>}
        {registration_form?.remark && !off_checkin && registration_state !== 2 && <View className="page_desc">{registration_form.remark}</View>}

        {
          registration_state !== 2 && off_checkin && <View className="checkin_box">
            <View className="page_title">{t('register.title.sign_in')}</View>
            <Image mode="widthFix" src={require('@/assets/checkin.png')} />
          </View>
        }

        <Form onSubmit={formSubmit}>
          {
            show_success ? '' :
              <View className="">
                <View className="px-8.75 bg-white pt-10 pb-2">
                  <View className="input-view">
                    {
                      registration_form?.fields && registration_form?.fields.map(item => item.enabled && renderFormItem(item))
                    }
                  </View>
                </View>
              </View>
          }
          <View className={`px-16 py-14 ${!current_registrable && registration_state !== 2 && 'hidden'}`}>
            {
              offline && registration_state !== 2 ? <>
                <Button formType="submit" className='text-white relative live_submit' style={{ backgroundColor: theme }}>
                  {t('register.button.sign_in')}
                </Button>
              </>
                :
                <>
                  {
                    !show_success && <>
                      <Button formType={registration_state !== 0 ? ' ' : "submit"} className={`text-white relative live_submit ${registration_state !== 0 && 'disabled'}`} style={{ backgroundColor: theme }}>
                        {registration_state === 1 ? t('register.text.register_auditing') : registration_state === 2 ? getBtnText() : (registration_form.submit_text || t('register.button.submit'))}
                      </Button>
                      {registration_state === 1 && off_registration_cancelable && <View className='canceled_click' onClick={canceled_click}>{t('register.button.register_cancel')}</View>}
                    </>
                  }

                </>
            }
          </View>

          {
            !current_registrable && registration_state !== 2 && <View className="time_box">
              <View className='px-10 py-14'>
                <Button className='text-white relative live_submit disabled' style={{ backgroundColor: theme }}>
                  {detail?.event.registration_state === 0 && !detail.is_special_events && t('event.tip.register_not_start')}
                  {detail?.event.registration_state === 2 && !detail.is_special_events && t('event.tip.register_end')}

                  {detail?.event.registration_state === 0 && detail.is_special_events && '未开始'}
                  {detail?.event.registration_state === 2 && detail.is_special_events && '已截止'}
                </Button>
                
              </View>

              {detail?.event.registration_state === 0 && !detail.is_special_events && `${t('event.text.apply_time_start')}：${detail.event.registration_start_time}`}
              {detail?.event.registration_state === 2 && !detail.is_special_events && `${t('event.text.apply_time_end')}：${detail.event.registration_deadline}`}

              {detail?.event.registration_state === 0 && detail.is_special_events && `开始时间：${detail.event.registration_start_time}`}
              {detail?.event.registration_state === 2 && detail.is_special_events && `截止时间：${detail.event.registration_deadline}`}
            </View>
          }

          {
            user_limit_exceed_btn && <View className="time_box">
            <View className='px-10 py-14'>
                <Button className='text-white relative live_submit disabled' style={{ backgroundColor: theme }}>
                  {registration_form.submit_text || t('register.button.submit')}
                </Button>
              </View>
            </View>
          }
        </Form>
        {
          registration_state === 2 && show_success && <View className="success">
            <View className="text-center mb-4"><Icon type={check_status === 1 ? 'success' : 'warn'} size="60" /></View>
            {
              !detail.is_special_events && <View className="success_text">{offline ? check_status === 1 ? t('register.tip.sign_success') : '签到失败' : t('register.tip.register_success')}</View>
            }
            {
              detail.is_special_events && <View className="success_text">提交成功</View>
            }
            
            {
              showLive && !offline && <Navigator style={{ backgroundColor: theme }} className='text-white text-center relative rounded-xl live_btn py-6 px-10' url={`plugin-private://wxd3c622771732fbab/pages/live/live?encodeId=${eid}&token=${token}&agencyId=${agencyId}&lang=${lang}&is_test=${is_test}`}>
              {t('file.text.play_live')}
            </Navigator>
            }
          </View>
        }

        <View className={`footer pb-20 ${detail.is_special_events ? '!hidden' : ''}`}>
          <View className='back footer_btn' style={{ color: theme, borderColor: theme }} onClick={() => {
            if (hasPrevPage) { return props.navigateBack() }
            props.toEventHome && props.toEventHome();
          }}>{t('common.button.back')}</View>
          <View className='footer_btn' style={{ color: theme, borderColor: theme }} onClick={() => {
            props.toMiniProgramHome && props.toMiniProgramHome();
          }}>{t('register.button.go_home')}</View>
        </View>

      </View>
    </View>

  )
}