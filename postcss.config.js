module.exports = {
    plugins: {
      tailwindcss: {},
      'postcss-rem-to-responsive-pixel': {
            // 16 意味着 1rem = 16rpx
            rootValue: 16,
            // 默认所有属性都转化
            propList: ['*'],
            // 转化的单位,可以变成 px / rpx
            transformUnit: 'rpx',
            unitPrecision: 1,
        },
    },
}