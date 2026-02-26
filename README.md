# Project Hub - 项目导航中心

统一管理和展示所有已部署项目的导航平台。

## 功能特性

- **首页展示**：精美卡片网格，展示所有已部署项目，支持分类筛选，点击直达
- **管理后台**：完整的项目 CRUD 管理，支持图片上传、分类、标签、排序
- **工具集成**：通过 `/main/xxx` 路由可轻松集成自定义工具页面
- **响应式设计**：适配桌面和移动端

## 技术栈

| 端 | 技术 |
|---|---|
| 前端 | Vue3 + Vite + Element Plus + Pinia + Vue Router |
| 后端 | Node.js + Express + SQLite + Sequelize |

## 快速启动

### 1. 启动后端

```bash
cd backend
npm install
npm run dev   # 开发模式（nodemon 热重载）
# 或
npm start     # 生产模式
```

后端服务默认运行在 `http://localhost:3001`

### 2. 启动前端

```bash
cd frontend
npm install
npm run dev
```

前端服务默认运行在 `http://localhost:5173`

## 目录结构

```
project-hub/
├── backend/
│   ├── app.js              # 入口文件
│   ├── config/
│   │   └── database.js     # 数据库配置（SQLite）
│   ├── models/
│   │   └── Project.js      # 项目数据模型
│   ├── routes/
│   │   ├── projects.js     # 项目 CRUD API
│   │   └── upload.js       # 图片上传 API
│   ├── uploads/            # 上传的图片存储目录
│   └── data/               # SQLite 数据库文件
└── frontend/
    └── src/
        ├── views/
        │   ├── Home.vue              # 首页（项目展示）
        │   └── main/
        │       ├── Layout.vue        # 后台布局
        │       ├── Dashboard.vue     # 控制台
        │       ├── ProjectManage.vue # 项目管理
        │       └── ToolPlaceholder.vue
        ├── components/
        │   └── ProjectCard.vue      # 项目卡片组件
        ├── stores/
        │   └── projectStore.js      # Pinia Store
        ├── apis/
        │   └── index.js             # API 封装
        └── router/
            └── index.js             # 路由配置
```

## 添加自定义工具

1. 在 `frontend/src/views/main/` 目录下创建新的 Vue 组件，例如 `MyTool.vue`
2. 在 `frontend/src/router/index.js` 的 `/main` 子路由中添加：

```js
{
  path: 'my-tool',
  name: 'MyTool',
  component: () => import('@/views/main/MyTool.vue'),
  meta: { title: '我的工具' }
}
```

3. 在 `frontend/src/views/main/Layout.vue` 侧边菜单中添加菜单项：

```html
<el-menu-item index="/main/my-tool">
  <el-icon><Tools /></el-icon>
  <template #title>我的工具</template>
</el-menu-item>
```

## API 接口

| 方法 | 路径 | 说明 |
|---|---|---|
| GET | `/api/projects/public` | 获取首页展示的项目 |
| GET | `/api/projects/categories` | 获取所有分类 |
| GET | `/api/projects` | 获取项目列表（分页、搜索） |
| POST | `/api/projects` | 创建项目 |
| PUT | `/api/projects/:id` | 更新项目 |
| DELETE | `/api/projects/:id` | 删除项目 |
| POST | `/api/upload` | 上传图片 |

## 页面路由

| 路径 | 说明 |
|---|---|
| `/` | 首页 - 项目展示 |
| `/main/dashboard` | 管理后台 - 控制台 |
| `/main/projects` | 管理后台 - 项目管理 |
| `/main/xxx` | 自定义工具页面 |
