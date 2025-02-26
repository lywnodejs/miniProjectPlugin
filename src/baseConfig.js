import Taro from '@tarojs/taro'
// const 
const baseConfig = {
    options: {
        agencyId: 28,
        tokenExpireTime: 24 * 60 * 60 * 1000,// 一天
        tabBarPage: [
            '/pages/tabBarPage/home/home',
            '/pages/tabBarPage/tradeActivitys/tradeActivitys',
            '/pages/tabBarPage/specialistTraining/specialistTraining',
            '/pages/tabBarPage/tradeData/tradeData',
            '/pages/tabBarPage/memberCenter/memberCenter',
        ],
        shareTitle: '洛杉矶旅游局天使汇',
        talkAppid: 'wxd3c622771732fbab',
        talkUrl: 'uni/pages/template?mid=33&path=%2Fhurtigruten%2Fzh%2Fmap%2Fexhibitors%2F717%3Fshow_back%3D1%26hide_title%3D1%26hide_menus%3D1%26source%3Dother',
        ctaUrl: 'https://m.chinatravelacademy.com',
        liveAppid: 'wx48123a3ae14d8588',
        livePath: 'pages/ctalive?scene=agency%3D28',
        liveLessPath: 'pages/lead?scene=room%3D',
    },
    prod: function(){
        return {
            baseUrl: 'https://api.agency-cms.dragontrail.com',
            liveUrl:'https://api.ctalive.com',
            baseUrlStatic: 'https://static.agency-cms.dragontrail.com/static/newZealand', // 资源路径
            livePageUrl: 'https://ctalive.com',
            knowLedgeUrl: 'https://knowledgebank.hellola.cn',
            talkUrl: 'uni/pages/template?mid=33&path=%2Fhurtigruten%2Fzh%2Fmap%2Fexhibitors%2F2775%3Fshow_back%3D1%26hide_title%3D1%26hide_menus%3D1%26source%3Dother',
            lesson_id:1842
        }
    },
    dev: function() {
        return {
            liveUrl:'https://api-live.agent.dragontrail.cn',
            livePageUrl: 'https://live.agent.dragontrail.cn',
            baseUrlStatic: 'https://static-agency-cms.agent.dragontrail.cn/static/newZealand',
            baseUrl: 'https://api-agency-cms.agent.dragontrail.cn',
            knowLedgeUrl: 'https://knowledgebank.hellola.cn',
            lesson_id:1846
        }
    }
}
function getConfig() {
    let info = Taro.getAccountInfoSync()
    let env = info.miniProgram.envVersion
    return env == 'release' ? baseConfig.prod() : baseConfig.dev()
}
const bc = getConfig()
// const bc = baseConfig.prod()

export default Object.assign({},baseConfig.options,bc)