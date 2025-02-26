import { View, Button, Navigator } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { useEffect, useState } from "react"
// import { getSession } from '@api/activity';
import Loading from '@coms/loading/loading'
import Config from '@config'
import './live.scss'

export default function ActivityLive(props) {
  const $instance = Taro.getCurrentInstance();
  const [loading,set_loading] = useState(true);
  const [hasPrevPage,set_hasPrevPage] = useState(true);
  const [room,set_room] = useState({});
  const [state,setState] = useState(null); // 2结束 1/进行中 0 未开始
  const [theme,setTheme] = useState();
  const [banner,setBanner] = useState('');
  useEffect(() => {
    Taro.setNavigationBarTitle({title: '直播'})
    const pages = Taro.getCurrentPages();
    if(pages.length > 1){
      set_hasPrevPage(true);
    }else{
      set_hasPrevPage(false);
    }
  }, [])

  useEffect(()=>{
    const { encodeId } = $instance.router.params;
    getRegistrationInfo(encodeId)
  },[])

  const getRegistrationInfo = (encodeId)=>{
    const { token, agencyId } = $instance.router.params;
    if(!encodeId) return;
    Taro.request({
      url: `${Config.baseUrl}/api/v1/cta/hub-api`,
      data: {
        action:'getEventInfo',
        agency_id:agencyId,
        event_id:encodeId,
        using_uuid: 'uuid',
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
    const { token } = $instance.router.params;
    Taro.showLoading();
    Taro.request({
      url: `${Config.baseUrl}/auth/get-session`,
      header:{
        Authorization: `Bearer ${token}`
      },
      success: (res)=>{
        Taro.navigateToMiniProgram({
          appId: 'wx48123a3ae14d8588',
          path: `/pks/stream/prepare/prepare?scene=${encodeURIComponent(`page=${state === 2 ? 'replay': 'live'}&room=${room.id}&session=${decodeURIComponent(res.data.data.session)}`)}`,
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
        !room && <View className="success_text nostart">暂无直播</View>
      }
      {
        room && <>
          <View className="success_text ing">直播已开始</View>
          <View className="success_text nostart">直播未开始</View>
          <View className="success_text end">直播已结束</View>
          <View className="desc">
            <View className="start_time">
              <View className="line"></View>
              <View className="text">开始时间</View>
              <View className="line"></View>
            </View>
            <View className="time">{room?.start_time}</View>
          </View>
          {
            state !== 2 && <Button className="text-white relative live_btn" onClick={toLive} style={{backgroundColor: theme}}>立即观看</Button>
          }
          {
            state === 2 && room.type === 5 && room.replay_enabled && room.ext?.replay_video && <Button className="text-white relative live_btn" onClick={toLive} style={{backgroundColor: theme}}>观看回放</Button>
          }
          
        </>
      }
        
        
        <View className="footer">
          {
            hasPrevPage &&  <View className="footer_btn" style={{color: theme,borderColor: theme}} onClick={()=>{
              Taro.navigateBack();
            }}>返回</View>
          }
          
          {/* <Navigator openType="switchTab" className="footer_btn" style={{color: theme,borderColor: theme}} url='/pages/index/index'>去首页</Navigator> */}
        </View>
      </View>
  </View>
}