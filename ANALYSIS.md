# ozupu.com 前端文件详细解析

> 分析时间：2026-06-27
> 分析方式：下载所有 JS 文件，逐个分析导入、组件名、API、关键词

---

## 一、核心框架文件

| 文件 | 大小 | 用途 |
|------|------|------|
| `index.js` | 662KB | 主入口，包含 Vue 3 运行时 + axios + Element Plus + dayjs + 路由 + 状态管理 + 工具函数 |
| `main.css` | 160KB | 全局样式 + Element Plus 样式 |

---

## 二、族谱核心模块

### `BqGcfGZT2.js`（134KB）— 吊线图模式（ApexTree + SVG.js）

**组件名：** `ModeTree2`

**技术栈：**
- `svgjs` 出现 12 次 — SVG.js 操作底层 SVG 元素
- `apextree` 出现 2 次 — ApexTree 树布局引擎
- `hierarchy` 出现 1 次 — D3 hierarchy 数据层级处理
- `canvas` 出现 31 次 — Canvas 相关操作
- `svg` 出现 57 次 — SVG 元素操作

**功能：**
- 全量加载所有成员数据
- 用 ApexTree 做树布局计算
- 用 SVG.js 操作底层 SVG 元素（更高效的 DOM 操作）
- 支持缩放、拖拽、展开/折叠
- 节点垂直排列显示姓名
- 直角连线表示血缘关系
- 支持搜索、筛选、打印

**API：**
- `GET /genealogy/member/list` — 获取成员列表

---

### `CTWlQ-562.js`（38KB）— 树列表模式（vue-recycle-scroller）

**组件名：**
- `ItemView` — 列表项视图
- `ResizeObserver` — 尺寸变化监听
- `RecycleScroller` — 虚拟滚动核心组件
- `ActionButtons` — 操作按钮（编辑/添加/删除/变更父级）
- `TreeContentTpl` — 树节点内容模板

**技术栈：**
- `vue-recycle-scroller` 出现 12 次 — 虚拟滚动
- `svg` 出现 4 次 — SVG 图标

**功能：**
- 虚拟滚动，只渲染可见区域的节点（1898 人不卡顿）
- 树形列表，用缩进表示层级
- 支持展开/折叠子节点
- 支持搜索、筛选
- 每行显示：姓名 + 字辈 + 出生/去世日期 + 年龄
- 操作按钮：编辑、添加子女、添加父亲、变更父级、删除

**API：**
- `GET /genealogy/member/list` — 获取成员列表

---

### `CzKrFcvl.js`（17KB）— 族谱详情页（路由入口）

**组件名：**
- `OrgSearchBox` — 组织搜索框（搜索成员并定位）
- `SearchForm` — 高级筛选表单（日期范围、年龄范围、性别、幼殁）
- `genealogyDetail` — 族谱详情主组件

**功能：**
- 切换吊线图/树列表两种显示模式
- 搜索成员（输入姓名 → 定位到节点）
- 高级筛选（日期、年龄、性别）
- 还原族谱树（重置视图）
- 协作人管理
- 显示族谱标题和总人数

**API：**
- `GET /genealogy/detail` — 获取族谱详情
- `GET /genealogy/member/list` — 获取成员列表

---

### `CkmZsc_o2.js`（9KB）— 打印族谱

**组件名：**
- `ToolsPanel` — 自定义工具面板
- `zupu` — 打印主组件

**功能：**
- 自定义字体（默认字体/楷体/宋体）
- 自定义文字大小
- 自定义间距（节点间距、上边距、左边距）
- 自定义颜色（名字颜色、副标颜色、线条颜色）
- 旋转族谱树（0°/90°）
- 调用浏览器打印功能

**API：**
- `GET /genealogy/detail` — 获取族谱详情
- `GET /genealogy/member/list` — 获取成员列表

---

## 三、首页与族谱管理

### `CxswXFCr.js`（21KB）— 首页（族谱卡片列表）

**组件名：**
- `Collaborator` — 协作人管理（添加/移除协作人、设置权限）
- `GenealogyTransfer` — 转让族谱
- `GenealogyCard` — 族谱卡片组件
- `index` — 首页主组件

**功能：**
- 我的族谱列表 / 公开族谱列表切换
- 创建新族谱
- 编辑/删除族谱
- 分享族谱（生成分享链接）
- 导出族谱（Excel）
- 转让族谱给其他用户
- 设置协作人（添加/移除/设置权限）
- 族谱配置（显示设置）
- 按姓氏搜索公开族谱
- 无限滚动加载

**API：**
- `GET /genealogy/list` — 获取族谱列表
- `POST /genealogy/delete` — 删除族谱
- `GET /genealogy/export` — 导出族谱
- `GET /genealogy/collaborator/list` — 获取协作人列表
- `POST /genealogy/collaborator/update` — 更新协作人
- `POST /genealogy/collaborator/permission/update` — 更新协作人权限
- `POST /genealogy/transfer` — 转让族谱

---

## 四、用户与认证

### `eqJwn6ln.js`（5KB）— 登录页

**组件名：**
- `ForgotPassword` — 忘记密码表单
- `login` — 登录主组件

**功能：**
- 账号密码登录
- 忘记密码（通过邮箱重置）
- 演示用户登录
- 免费注册入口

**API：**
- `POST /login/token` — 登录获取 Token
- `POST /account/password/reset` — 重置密码

---

### `BN_iJS5J2.js`（20KB）— 用户管理

**组件名：**
- `TheDateTime` — 日期时间组件
- `AutoRecharge` — 自动充值设置
- `EditUser` — 编辑用户
- `RechargePoints` — 充值积分
- `SponsorHistory` — 赞助历史

**功能：**
- 用户列表（分页、搜索）
- 创建用户
- 编辑用户信息
- 充值积分
- 自动充值设置
- 查看赞助历史

**API：**
- `POST /user/add` — 创建用户
- `POST /user/update` — 更新用户
- `GET /common/fans/list` — 获取粉丝列表
- `POST /points/admin/recharge` — 管理员充值
- `POST /points/auto/recharge` — 自动充值设置

---

### `Ccam-xUn2.js`（354B）— 注册页

**组件名：** `register`

**功能：** 用户注册

---

### `CgYrIXjw.js`（370B）— 初始化页

**组件名：** `initialized`

**功能：** 系统初始化（首次使用）

---

### `a6FnZw4P.js`（3KB）— 邮箱重置密码

**组件名：** `emailResetPassword`

**功能：** 通过邮箱链接重置密码

---

### `DvMgo_2A.js`（811B）— 邮箱验证

**组件名：** `emailVerify`

**功能：** 验证邮箱地址

---

## 五、权限与角色

### `CLiw1Asf2.js`（6KB）— 角色管理

**组件名：**
- `SetMenuAndResource` — 设置菜单和资源权限
- `UpdateRole` — 新增/编辑角色
- `role` — 角色列表主组件

**功能：**
- 角色列表（启用/禁用状态）
- 新增角色
- 编辑角色（名称、描述、默认角色、状态）
- 删除角色
- 设置角色的菜单权限
- 设置角色的资源权限

**API：**
- `GET /role/list` — 获取角色列表
- `POST /role/add` — 新增角色
- `POST /role/info/update` — 更新角色
- `GET /common/resource/list` — 获取资源列表
- `GET /menu/list` — 获取菜单列表

---

## 六、内容管理

### `Cye7K0TU.js`（9KB）— 文章管理

**组件名：** `index`（文章列表）

**功能：**
- 文章列表（按年份分组）
- 搜索文章
- 创建/编辑/删除文章
- 分享文章
- 无限滚动加载

**API：**
- `GET /article/list` — 获取文章列表
- `POST /article/delete` — 删除文章

---

### `C3JaZsIF.js`（801B）— 新增文章

**组件名：** `add`

**功能：** 创建新文章

**API：**
- `POST /article/add` — 新增文章

---

### `BNbWnN-1.js`（1KB）— 编辑文章

**组件名：** `[id]`

**功能：** 编辑文章

**API：**
- `POST /article/update` — 更新文章

---

### `BwO1AvbT.js`（2KB）— 文章详情

**组件名：** `[id]`

**功能：** 查看文章详情

---

## 七、字派管理

### `DjPXfaaW2.js`（5KB）— 字派管理

**组件名：**
- `UpdateZipai` — 新增/编辑字派
- `zipai` — 字派列表主组件

**功能：**
- 字派列表
- 新增字派
- 编辑字派
- 删除字派

**API：**
- `GET /dict/list` — 获取字派列表
- `POST /dict/add` — 新增字派
- `POST /dict/update` — 更新字派
- `POST /dict/delete` — 删除字派

---

### `B-L5VIBi.js`（5KB）— 字典管理

**组件名：**
- `UpdateDict` — 新增/编辑字典
- `dict` — 字典列表主组件

**功能：** 通用字典管理（与字派类似）

**API：**
- `GET /dict/list` — 获取字典列表
- `POST /dict/add` — 新增字典
- `POST /dict/update` — 更新字典
- `POST /dict/delete` — 删除字典

---

## 八、订单与支付

### `D5vzeHnY2.js`（8KB）— 订单管理

**组件名：**
- `ZUserSelect` — 用户选择器
- `CreateOrder` — 创建订单
- `orders` — 订单列表主组件

**功能：**
- 订单列表（分页、搜索）
- 手动创建订单
- 更新订单状态
- 选择用户

**API：**
- `GET /pay/order/list` — 获取订单列表
- `POST /pay/order/create/manual` — 手动创建订单
- `POST /pay/order/update/status` — 更新订单状态
- `GET /user/list/simple` — 获取用户列表（简化）
- `GET /common/user/levels` — 获取用户等级

---

### `vviXsJd-2.js`（2KB）— 微信支付赞助

**组件名：** `SponsorByWechatPay`

**功能：** 微信支付赞助作者

**API：**
- `GET /common/user/levels` — 获取用户等级

---

## 九、积分系统

### `nJqeHA7c2.js`（3KB）— 积分记录

**组件名：** `pointsRecords`

**功能：** 查看积分充值/消费记录

**API：**
- `GET /points/admin/records` — 获取积分记录

---

### `c6lkgFFg.js`（2KB）— 邀请码管理

**组件名：** `inviteCodes`

**功能：**
- 邀请码列表
- 生成邀请码
- 更新邀请码状态

**API：**
- `GET /inviteCode/list` — 获取邀请码列表
- `POST /inviteCode/generate` — 生成邀请码
- `POST /inviteCode/updateStatus` — 更新状态

---

## 十、AI 功能

### `Cr73eL_6.js`（6KB）— AI 渠道管理

**组件名：**
- `UpdateAiChannel` — 新增/编辑 AI 渠道
- `aiChannel` — AI 渠道列表主组件

**功能：**
- AI 渠道列表（名称、标识、API 地址、模型列表、最大并发、启用状态）
- 新增 AI 渠道
- 编辑 AI 渠道
- 删除 AI 渠道
- 启用/禁用渠道

**API：**
- `GET /ai-channel/list` — 获取渠道列表
- `POST /ai-channel/add` — 新增渠道
- `POST /ai-channel/update` — 更新渠道
- `POST /ai-channel/delete` — 删除渠道

---

### `Dk9vgKrE.js`（5KB）— AI 模型配置

**组件名：**
- `UpdateAiModelConfig` — 新增/编辑模型配置
- `aiModelConfig` — 模型配置列表主组件

**功能：**
- AI 模型配置列表
- 新增/编辑/删除模型配置
- 从渠道获取可用模型

**API：**
- `GET /ai-model-config/list` — 获取模型配置列表
- `POST /ai-model-config/add` — 新增配置
- `POST /ai-model-config/update` — 更新配置
- `POST /ai-model-config/delete` — 删除配置
- `GET /ai-model-config/channel-models` — 获取渠道模型

---

## 十一、系统管理

### `C3P_HcyX2.js`（5KB）— 系统设置

**组件名：** `settings`

**功能：**
- 系统设置列表
- 更新设置
- AES 加密配置

**API：**
- `GET /settings/list` — 获取设置列表
- `POST /settings/update` — 更新设置
- `POST /settings/aes` — AES 配置

---

### `CuNVo3em.js`（3KB）— 菜单管理

**组件名：**
- `MenuEdit` — 编辑菜单
- `menu` — 菜单列表主组件

**功能：**
- 菜单列表（名称、路由、排序、状态）
- 编辑菜单

**API：**
- `GET /menu/list` — 获取菜单列表
- `POST /menu/update` — 更新菜单

---

## 十二、分享功能

### `GIGjjQWZ2.js`（3KB）— 分享族谱

**组件名：** `[id]`

**功能：**
- 带密码保护的族谱分享
- 验证密码后显示族谱

**API：**
- `POST /share/zupu` — 获取分享的族谱

---

## 十三、统计与路由

### `BxW8mbHD2.js`（521KB）— 统计分析

**组件名：**
- `skeleton-item` — 骨架屏项
- `skeleton` — 骨架屏
- `StatsChart` — 统计图表
- `StatsPage` — 统计页面
- `stats` — 统计主组件

**功能：**
- 活跃用户统计
- 注册统计
- 赞助统计
- 图表展示

**API：**
- `GET /stats/active-user` — 活跃用户统计
- `GET /stats/registration` — 注册统计
- `GET /stats/sponsor` — 赞助统计

---

### `CvXzcmgN.js`（618B）— 新版族谱详情路由

**组件名：** `[id]`

**功能：** 新版族谱详情页的路由入口

---

### `DVstKwSc.js`（228B）— 404 页面

**功能：** 页面未找到

---

## 十四、依赖关系图

```
index.js (主入口)
├── CzKrFcvl.js (族谱详情页)
│   ├── CTWlQ-562.js (吊线图模式 - ApexTree + SVG.js)
│   └── BqGcfGZT2.js (树列表模式 - vue-recycle-scroller)
├── CxswXFCr.js (首页)
├── Cye7K0TU.js (文章管理)
├── CLiw1Asf2.js (角色管理)
├── eqJwn6ln.js (登录)
├── BN_iJS5J2.js (用户管理)
├── D5vzeHnY2.js (订单管理)
├── DjPXfaaW2.js (字派管理)
├── Cr73eL_6.js (AI 渠道)
├── Dk9vgKrE.js (AI 模型)
├── C3P_HcyX2.js (系统设置)
├── CuNVo3em.js (菜单管理)
├── BxW8mbHD2.js (统计)
└── ...其他小模块
```

---

## 十五、技术栈总结

| 层 | 技术 |
|---|---|
| 框架 | Vue 3（Composition API） |
| UI 库 | Element Plus |
| 构建 | Vite |
| 路由 | Vue Router |
| HTTP | axios |
| 日期 | dayjs |
| 图表 | ECharts |
| 树形图（吊线图） | **ApexTree + SVG.js** |
| 树形图（列表） | **vue-recycle-scroller**（虚拟滚动） |
| 图标 | 自定义 SVG 图标 |

---

## 十六、关键发现

1. **树形渲染方案**：吊线图模式用 ApexTree + SVG.js，树列表模式用 vue-recycle-scroller 虚拟滚动
2. **虚拟滚动**：树列表模式只渲染可见区域的节点，1898 人不卡顿
3. **两种显示模式**：用户可切换吊线图/树列表
4. **SVG.js 的作用**：用 SVG.js 操作底层 SVG 元素，比 ApexTree 默认的 DOM 操作更高效
5. **自研组件居多**：大部分组件是自研的，没有使用太多第三方库
