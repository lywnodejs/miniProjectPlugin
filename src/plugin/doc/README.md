# 小程序插件开发文档

## Register 组件

### 功能说明
Register组件用于处理活动报名表单，包括报名信息填写、提交、签到等功能。

### Props 参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| parsedParams | Object | 解析后的参数 |
| eid | String | 活动ID |
| customCompany | Boolean | 是否自定义公司信息 |
| token | String | 用户token |
| agencyId | String | 机构ID |
| userInfo | Object | 用户信息 |
| regions | Array | 地区数据 |
| lang | String | 语言 |
| languageData | Object | 语言数据 |
| is_test | Boolean | 是否是测试环境 |
| detail | Object | 活动详情 |
| handleSubmit | Function | 提交回调，参数为表单数据和回调函数 |
| handleCheckin | Function | 签到回调，参数为回调函数 |
| handleCancel | Function | 取消报名回调 |
| navigateBack | Function | 返回上一页回调 |
| toEventHome | Function | 返回活动首页回调 |
| toMiniProgramHome | Function | 返回小程序首页回调 |

### 主要方法

#### getRegistrationInfo(res)
获取报名信息

**参数：**
- res: Object - 接口返回的活动详情数据

**功能：**
- 初始化表单数据
- 设置报名状态
- 设置表单验证规则
- 设置banner图片

#### formSubmit(e)
处理表单提交

**参数：**
- e: Object - 表单提交事件对象

**功能：**
- 表单数据校验
- 处理签到逻辑
- 调用handleSubmit提交表单

#### formChange(val, item)
处理表单值变化

**参数：**
- val: Any - 变化后的值
- item: Object - 当前表单项配置

**功能：**
- 更新表单数据
- 处理公司信息相关字段

#### renderFormItem(item)
渲染表单项

**参数：**
- item: Object - 表单项配置

**返回：**
- ReactElement - 渲染的表单项组件

**功能：**
- 根据表单项类型渲染不同的输入组件
- 处理表单项的联动逻辑

#### canceled_click()
处理取消报名

**功能：**
- 调用handleCancel回调


## Live 页面

### 功能说明
Live页面用于展示和管理直播活动，包括直播状态显示、观看直播、观看回放等功能。

### 主要功能

#### 获取直播信息
- 通过活动ID获取直播房间信息
- 设置直播banner图片
- 初始化直播状态

#### 直播状态管理
- 未开始：显示开始时间
- 进行中：显示"立即观看"按钮
- 已结束：显示"观看回放"按钮（如果支持回放）

#### 观看直播/回放
- 调用小程序跳转接口进入直播页面
- 支持直播和回放两种模式
- 处理观看前的鉴权逻辑

#### 页面导航
- 提供返回上一页功能
- 支持返回小程序首页

### Props 参数

| 参数名 | 类型 | 说明 |
|--------|------|------|
| encodeId | String | 活动ID |
| token | String | 用户token |
| agencyId | String | 机构ID |
| lang | String | 语言 |
| is_test | Boolean | 是否是测试环境 |

### 主要方法

#### getRegistrationInfo(encodeId)
获取直播信息

**参数：**
- encodeId: String - 活动ID

**功能：**
- 请求活动详情接口
- 初始化直播房间信息
- 设置直播状态
- 设置banner图片

#### toLive()
处理观看直播/回放

**功能：**
- 获取观看权限
- 跳转到直播小程序
- 根据直播状态跳转到直播或回放页面
