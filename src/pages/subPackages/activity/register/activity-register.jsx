import Taro from '@tarojs/taro'
import Config from '@config'
import {useState,useEffect} from 'react'
import { View } from '@tarojs/components'

export default function ActivityRegister() {

  const eid = Taro.getStorageSync('encodeId')
  const offline = false;
  const [detail,set_detail]= useState();
  const [regions,set_regions] = useState([]);

  

  useEffect(() => {
    getRegistrationInfo();
    getRegions();
  }, [])

  const getRegistrationInfo = (user)=>{
    console.log('eid: ', Config.baseUrl);
    Taro.request({
      url:  Config.baseUrl + `/api/v1/cta/hub-api?agency_id=${Config.agencyId}&action=getEventInfo&event_id=${eid}`,
    }).then(res=>{
      set_detail(res.data);
    })
  }

  const getRegions = ()=>{
    Taro.request({
      url:  Config.liveUrl + `/api/v1/system/regions`,
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
    parsedParams:{l:'1'},
    eid:eid, // 活动id
    lang:'zh-CN', // 语言
    agencyId:Config.agencyId, // 机构id
    userInfo:{}, // 用户信息
    token:'', // 用户token
    detail:detail, // 活动详情
    regions:regions, // 地区
    customCompany:true, // 是否自定义公司选择
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

  return <register props={extraProps} />
}