const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const { sequelize } = require('./config/database')

const app = express()
const PORT = process.env.PORT || 3001

// 确保数据目录存在
const dataDir = path.join(__dirname, 'data')
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// 静态资源
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// 路由
app.use('/api/projects', require('./routes/projects'))
app.use('/api/upload', require('./routes/upload'))

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ code: 200, message: 'Server is running', time: new Date().toISOString() })
})

// 初始化数据库并启动服务
sequelize.sync({ alter: true }).then(async () => {
  const Project = require('./models/Project')
  const count = await Project.count()
  if (count === 0) {
    await Project.bulkCreate([
      {
        name: '金来官网',
        description: '公司官方网站，展示公司介绍、产品服务、联系方式等信息',
        url: 'http://www.jinlai.fun',
        category: '官网',
        color: '#409eff',
        sort: 1,
        visible: true
      },
      {
        name: '档案管理系统',
        description: '企业档案数字化管理平台，支持档案录入、检索、归档、借阅等全流程管理',
        url: 'http://8.141.120.243:9000/',
        category: '管理系统',
        color: '#67c23a',
        sort: 2,
        visible: true
      }
    ])
    console.log('已初始化示例数据')
  }
  app.listen(PORT, () => {
    console.log(`✅ 后端服务启动成功: http://localhost:${PORT}`)
    console.log(`📦 API 地址: http://localhost:${PORT}/api`)
  })
}).catch(err => {
  console.error('数据库初始化失败:', err)
  process.exit(1)
})
