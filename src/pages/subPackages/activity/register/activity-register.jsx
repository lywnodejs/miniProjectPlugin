import Taro from '@tarojs/taro'
import Config from '@config'
import {useState,useEffect} from 'react'
import { View } from '@tarojs/components'

export default function ActivityRegister() {

  let api_list = {
    baseUrl: 'https://api-agency-cms.agent.dragontrail.cn',
    liveUrl:'https://api-live.agent.dragontrail.cn',
  }

  const eid = Taro.getStorageSync('encodeId')
  const offline = false;
  const [detail,set_detail]= useState();
  const [regions,set_regions] = useState([]);
  const [languageData,set_languageData] = useState({});

  

  useEffect(() => {
    getRegistrationInfo();
    getRegions();
    getLanguageData();
  }, [])

    const getLanguageData = ()=>{
    Taro.request({
      url: `${api_list.liveUrl}/locales/zh-CN.json`,
      success: (res)=>{
        set_languageData(res.data);
      }
    })
  }

  const getRegistrationInfo = (user)=>{
    console.log('eid: ', api_list.baseUrl);
    Taro.request({
      url:  api_list.baseUrl + `/api/v1/cta/hub-api?agency_id=${Config.agencyId}&action=getEventInfo&event_id=${eid}`,
    }).then(res=>{
      set_detail(res.data);
    })
  }

  const getRegions = ()=>{
    Taro.request({
      url:  api_list.liveUrl + `/api/v1/system/regions`,
    }).then(res=>{
      const filters_data = (item)=>{
        item.map(im=>{
          im.value = im.id+ '';
          im.label = im.name;
          if(im.children){
            filters_data(im.children)
          }
        })
      }
      filters_data(res.data.data);
      set_regions(res.data.data);
    })
  }



  const extraProps = {
    parsedParams:{l:'2'},
    eid:eid, // 活动id
    lang:'zh-CN', // 当前语言
    agencyId:Config.agencyId, // 机构id
    userInfo:{}, // 用户信息
    token:'', // 用户token
    languageData:languageData, // 语言数据
    detail:detail, // 活动详情
    regions:regions, // 地区
    customCompany:false, // 是否自定义公司选择
    is_test:true, //是否是测试环境
    handleSubmit:(data,callback)=>callback({code:200}), // 提交
    handleCheckin:(callback)=>callback({code:200}), // 签到
    handleCancel:()=>{}, // 取消报名
    navigateBack:Taro.navigateBack,
    toEventHome:()=>{
      Taro.redirectTo({
        url: `/pages/subPackages/activity/home/activity-home?scene=${encodeURIComponent('eid=' + eid)}`,
      })
    },
    toMiniProgramHome:()=>{
      Taro.navigateTo({
        url: '/pages/index/index'
      })
    }
  }

  return languageData && <register props={extraProps} />
}