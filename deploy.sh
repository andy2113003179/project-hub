#!/bin/bash

# Project Hub 一键部署脚本
# 使用方法：在服务器上运行 bash deploy.sh

set -e

echo "=========================================="
echo "  Project Hub 部署脚本"
echo "=========================================="

# 配置变量
PROJECT_DIR="/web/project-hub"
BACKEND_PORT=3001
FRONTEND_PORT=8888

echo ""
echo "📦 步骤 1: 更新代码..."
cd $PROJECT_DIR
# git pull  # 如果使用 Git 取消注释

echo ""
echo "📦 步骤 2: 部署后端..."
cd $PROJECT_DIR/backend
npm install --production

# 确保必要的目录存在
mkdir -p data uploads logs

# 重启后端服务
if pm2 list | grep -q "project-hub-backend"; then
    echo "重启现有后端服务..."
    pm2 restart project-hub-backend
else
    echo "首次启动后端服务..."
    pm2 start ecosystem.config.js
    pm2 save
fi

echo ""
echo "📦 步骤 3: 构建前端..."
cd $PROJECT_DIR/frontend
npm install
npm run build

echo ""
echo "✅ 部署完成！"
echo ""
echo "服务访问地址："
echo "  前端: http://YOUR_SERVER_IP:$FRONTEND_PORT"
echo "  后端: http://localhost:$BACKEND_PORT"
echo ""
echo "管理命令："
echo "  查看后端日志: pm2 logs project-hub-backend"
echo "  查看服务状态: pm2 status"
echo "  重启后端: pm2 restart project-hub-backend"
echo ""
