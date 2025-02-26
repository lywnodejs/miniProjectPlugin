import { WebView } from "@tarojs/components"
import Taro from '@tarojs/taro'
import Config from '@config'

export default function ActivityHome() {
  const $instance = Taro.getCurrentInstance();
  const { encodeId } = $instance.router.params;
  Taro.setStorageSync('encodeId', encodeId)
  const src = Config.livePageUrl + '/event/' + encodeId + '?pageType=miniprogram'
  return  <WebView src={src}></WebView>

}