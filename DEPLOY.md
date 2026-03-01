# Project Hub 部署文档

## 服务器环境要求

- Node.js >= 16.x
- Nginx
- PM2（进程管理）
- 至少 500MB 可用磁盘空间

## 快速部署

### 1️⃣ 首次部署

```bash
# 1. 创建目录并上传代码
mkdir -p /web/project-hub
cd /web/project-hub
# 上传项目文件或 git clone

# 2. 安装 PM2
npm install -g pm2

# 3. 部署后端
cd backend
npm install --production
mkdir -p data uploads logs
pm2 start ecosystem.config.js
pm2 startup
pm2 save

# 4. 构建前端
cd ../frontend
npm install
npm run build

# 5. 配置 Nginx
# 将项目根目录的 nginx.conf 内容添加到 /etc/nginx/nginx.conf
sudo nano /etc/nginx/nginx.conf
sudo nginx -t
sudo nginx -s reload

# 6. 访问应用
# http://YOUR_SERVER_IP:8888
```

### 2️⃣ 更新部署

```bash
# 使用一键部署脚本（推荐）
cd /web/project-hub
bash deploy.sh

# 或手动更新
cd /web/project-hub
git pull
cd backend && npm install --production && pm2 restart project-hub-backend
cd ../frontend && npm install && npm run build
```

## 端口配置

| 服务 | 默认端口 | 说明 |
|-----|---------|-----|
| 后端 API | 3001 | 仅内网访问 |
| 前端 Nginx | 8888 | 公网访问（可修改） |

## 目录结构

```
/web/project-hub/
├── backend/
│   ├── data/              # SQLite 数据库
│   ├── uploads/           # 上传的图片
│   ├── logs/              # PM2 日志
│   └── ecosystem.config.js # PM2 配置
├── frontend/
│   └── dist/              # 打包后的静态文件
├── deploy.sh              # 一键部署脚本
└── nginx.conf             # Nginx 配置模板
```

## 常见问题

### Q1: 端口被占用？

```bash
# 查看端口占用
sudo lsof -i :3001
sudo lsof -i :8888

# 修改后端端口
# 编辑 backend/ecosystem.config.js 中的 PORT
# 编辑 nginx.conf 中的 proxy_pass 地址

# 修改前端端口
# 编辑 nginx.conf 中的 listen 端口
```

### Q2: 后端服务无法启动？

```bash
# 查看日志
pm2 logs project-hub-backend

# 检查 Node.js 版本
node -v  # 需要 >= 16.x

# 重新安装依赖
cd /web/project-hub/backend
rm -rf node_modules package-lock.json
npm install --production
```

### Q3: 前端页面 404？

```bash
# 检查 dist 目录是否存在
ls -la /web/project-hub/frontend/dist

# 重新构建
cd /web/project-hub/frontend
npm run build

# 检查 Nginx 配置
sudo nginx -t
```

### Q4: 图片上传失败？

```bash
# 检查 uploads 目录权限
sudo chown -R www-data:www-data /web/project-hub/backend/uploads
sudo chmod -R 755 /web/project-hub/backend/uploads

# 检查 Nginx 配置中的 client_max_body_size
```

### Q5: API 请求跨域错误？

后端已配置 CORS，如果还有问题：

```javascript
// 检查 backend/app.js 中的 cors 配置
app.use(cors({
  origin: '*',  // 生产环境建议改为具体域名
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))
```

## 性能优化建议

### 1. 启用 Gzip 压缩（已在全局配置）

你的 nginx 已启用 gzip，无需额外配置。

### 2. 配置静态资源缓存

```nginx
# 在 location / 块中添加
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    root /web/project-hub/frontend/dist;
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### 3. 使用 PM2 集群模式

```javascript
// ecosystem.config.js 中修改
instances: 'max',  // 使用所有 CPU 核心
exec_mode: 'cluster'
```

## 安全建议

1. **修改默认端口**：避免使用常见端口
2. **配置防火墙**：只开放必要端口
3. **定期备份数据库**：
   ```bash
   # 备份数据库
   cp /web/project-hub/backend/data/project-hub.sqlite /backup/project-hub-$(date +%Y%m%d).sqlite
   ```
4. **配置 HTTPS**：使用 Let's Encrypt 免费证书
5. **限制 CORS 来源**：生产环境不要使用 `origin: '*'`

## 监控和维护

```bash
# 查看服务状态
pm2 status

# 查看实时日志
pm2 logs project-hub-backend --lines 100

# 监控资源使用
pm2 monit

# 查看 Nginx 日志
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# 定期清理日志
pm2 flush  # 清空 PM2 日志
```

## 联系方式

如有问题，请查看：
- 项目 README: [README.md](README.md)
- Nginx 配置: [nginx.conf](nginx.conf)
- 部署脚本: [deploy.sh](deploy.sh)
