export default {
  pages: [
    'pages/index/index',
    'pages/event/event'
  ],
  subPackages: [
    {
      root: 'pages/subPackages/activity',
      pages: [
        'register/activity-register', // 报名
      ]
    },
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  plugins: {
    myPlugin: {
      version: 'dev',
      provider: 'wxd3c622771732fbab'
    }
  }
}
