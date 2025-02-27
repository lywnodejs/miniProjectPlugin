import { View, Button, Navigator } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { useEffect, useState } from "react"
// import { getSession } from '@api/activity';
import Loading from '@coms/loading/loading'
import './live.scss'

let API_LIST = {
  dev: {
    baseUrl: 'https://api-agency-cms.agent.dragontrail.cn',
    liveUrl:'https://api-live.agent.dragontrail.cn',
  },
  prod: {
    baseUrl: 'https://api.agency-cms.dragontrail.com',
    liveUrl:'https://api.ctalive.com',
  }
}

export default function ActivityLive() {
  const $instance = Taro.getCurrentInstance();
  const [loading,set_loading] = useState(true);
  const [hasPrevPage,set_hasPrevPage] = useState(true);
  const [room,set_room] = useState({});
  const [state,setState] = useState(null); // 2结束 1/进行中 0 未开始
  const [theme,setTheme] = useState();
  const [banner,setBanner] = useState('');
  const [languageData,set_languageData] = useState({});

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

  useEffect(()=>{
    const { encodeId,lang,is_test } = $instance.router.params;
    console.log(encodeId,lang,is_test);
    
    getLanguageData(lang,is_test === 'true')
    getRegistrationInfo(encodeId,lang,is_test === 'true')
  },[])

  const getLanguageData = (lang,is_test)=>{
    Taro.request({
      url: `${API_LIST[is_test?'dev':'prod'].liveUrl}/locales/${lang}.json`,
      success: (res)=>{
        set_languageData(res.data);
        Taro.setNavigationBarTitle({title: res.data['common.text.live_title']})
      }
    })
  }

  const getRegistrationInfo = (encodeId,lang,is_test)=>{
    const { token, agencyId } = $instance.router.params;
    if(!encodeId) return;
    Taro.request({
      url: `${API_LIST[is_test?'dev':'prod'].baseUrl}/api/v1/cta/hub-api`,
      data: {
        action:'getEventInfo',
        agency_id:agencyId,
        event_id:encodeId,
        using_uuid: 'uuid',
        lang: lang
      },
      header:{
        Authorization: `Bearer ${token}`
      },
      success: (res)=>{
        set_loading(false)
        let eventData = res.data.data.event;
        let roomList = eventData.rooms;
        let live_item = null;
        if(res.data.data.landing_page){
          res.data.data.landing_page.modules.map(item=>{
            if(item.slug === 'live'){
              if(item.value){
                roomList.map(liveItem=>{
                  if(liveItem.id === item.value[0]){
                    live_item = liveItem;
                  }
                })
              }
            }
          })
        }
        initRoom(live_item);
        let banner_url = eventData.registration_form?.banner?.url;
        setTheme(res.data.data.landing_page.theme_color);
        setBanner(banner_url);
      }
    })
  }

  const initRoom = (room)=>{
    let roomInfo = room;
    set_room(roomInfo);
    if(!room){
      return setState(0)
    }
    let btn_type = roomInfo.phase > 0 && roomInfo.phase !== 15 ? 1 : roomInfo.phase === 0 ? 0: 2; // 2结束 1/进行中 0 未开始
    setState(btn_type);
  }

  const toLive = ()=>{
    const { token,lang,is_test } = $instance.router.params;
    let test = is_test === 'true';
    Taro.showLoading();
    Taro.request({
      url: `${API_LIST[test?'dev':'prod'].baseUrl}/auth/get-session`,
      header:{
        Authorization: `Bearer ${token}`
      },
      success: (res)=>{
        Taro.navigateToMiniProgram({
          envVersion: test ? 'trial' : 'release',
          appId: 'wx48123a3ae14d8588',
          path: `/pks/stream/prepare/prepare?scene=${encodeURIComponent(`page=${state === 2 ? 'replay': 'live'}&room=${room.id}&session=${decodeURIComponent(res.data.data.session)}&lang=${lang}`)}`,
        })
      },
      complete: ()=>{
        Taro.hideLoading()
      }
    })
  }

    if (loading) {
      return <View className='flex justify-center items-center h-screen'><Loading /></View>
    }

    return <View className="bg-gray-a2 min-h-full activity-live">
      {
        banner && <View class='banner'>
          <Image mode="widthFix" className='banner-img' src={banner}></Image>
      </View>
      }
      <View className={`box ${state === 2 && 'end'} ${state === 1 && 'ing'} ${state === 0 && 'nostart'}`}>
      {/* nostart ing end */}
      {
        !room && <View className="success_text nostart">{t('live.text.no_live')}</View>
      }
      {
        room && <>
          <View className="success_text ing">{t('live.tip.live_start')}</View>
          <View className="success_text nostart">{t('live.tip.live_no_start')}</View>
          <View className="success_text end">{t('live.tip.live_end')}</View>
          <View className="desc">
            <View className="start_time">
              <View className="line"></View>
              <View className="text">{t('common.tip.start_time')}</View>
              <View className="line"></View>
            </View>
            <View className="time">{room?.start_time}</View>
          </View>
          {
            state !== 2 && <Button className="text-white relative live_btn" onClick={toLive} style={{backgroundColor: theme}}>{t('live.button.watch_now')}</Button>
          }
          {
            state === 2 && room.type === 5 && room.replay_enabled && room.ext?.replay_video && <Button className="text-white relative live_btn" onClick={toLive} style={{backgroundColor: theme}}>{t('live.button.watch_replay')}</Button>
          }
          
        </>
      }
        
        
        <View className="footer">
          {
            hasPrevPage &&  <View className="footer_btn" style={{color: theme,borderColor: theme}} onClick={()=>{
              Taro.navigateBack();
            }}>{t('common.button.back')}</View>
          }
          
          {/* <Navigator openType="switchTab" className="footer_btn" style={{color: theme,borderColor: theme}} url='/pages/index/index'>去首页</Navigator> */}
        </View>
      </View>
  </View>
}