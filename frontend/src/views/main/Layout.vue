<template>
  <el-container class="admin-layout">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapsed ? '64px' : '220px'" class="sidebar">
      <!-- Logo -->
      <div class="sidebar-logo" :class="{ collapsed: isCollapsed }">
        <div class="logo-icon">
          <el-icon size="22"><Grid /></el-icon>
        </div>
        <transition name="fade">
          <span v-if="!isCollapsed" class="logo-name">Project Hub</span>
        </transition>
      </div>

      <!-- 菜单 -->
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapsed"
        :collapse-transition="false"
        class="sidebar-menu"
        router
      >
        <el-menu-item index="/main/dashboard">
          <el-icon><DataAnalysis /></el-icon>
          <template #title>控制台</template>
        </el-menu-item>

        <el-menu-item index="/main/projects">
          <el-icon><FolderOpened /></el-icon>
          <template #title>项目管理</template>
        </el-menu-item>

        <el-divider class="menu-divider" />

        <div v-if="!isCollapsed" class="menu-group-label">工具集成</div>

        <!-- 预留工具菜单项 - 可在此处添加更多工具 -->
        <el-menu-item index="/main/tools-placeholder" disabled>
          <el-icon><Tools /></el-icon>
          <template #title>更多工具 (开发中)</template>
        </el-menu-item>
      </el-menu>

      <!-- 折叠按钮 -->
      <div class="collapse-btn" @click="isCollapsed = !isCollapsed">
        <el-icon size="18">
          <component :is="isCollapsed ? 'Expand' : 'Fold'" />
        </el-icon>
      </div>
    </el-aside>

    <!-- 主区域 -->
    <el-container class="main-container">
      <!-- 顶部 Header -->
      <el-header class="admin-header">
        <!-- 面包屑 -->
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/main' }">管理后台</el-breadcrumb-item>
          <el-breadcrumb-item>{{ currentTitle }}</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 右侧操作区 -->
        <div class="header-right">
          <el-tooltip content="访问首页" placement="bottom">
            <el-button circle plain @click="$router.push('/')">
              <el-icon><House /></el-icon>
            </el-button>
          </el-tooltip>
          <div class="avatar">
            <el-icon size="18"><UserFilled /></el-icon>
          </div>
        </div>
      </el-header>

      <!-- 内容区 -->
      <el-main class="admin-main">
        <router-view v-slot="{ Component }">
          <transition name="page-fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isCollapsed = ref(false)

const activeMenu = computed(() => route.path)

const titleMap = {
  '/main/dashboard': '控制台',
  '/main/projects': '项目管理'
}

const currentTitle = computed(() => titleMap[route.path] || route.meta?.title || '页面')
</script>

<style scoped>
.admin-layout {
  height: 100vh;
  overflow: hidden;
}

/* 侧边栏 */
.sidebar {
  background: #1a1a2e;
  display: flex;
  flex-direction: column;
  transition: width 0.25s ease;
  overflow: hidden;
}

.sidebar-logo {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  gap: 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-shrink: 0;
}

.sidebar-logo.collapsed {
  padding: 0;
  justify-content: center;
}

.logo-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.logo-name {
  font-size: 16px;
  font-weight: 700;
  color: white;
  white-space: nowrap;
}

.sidebar-menu {
  flex: 1;
  border-right: none !important;
  background: transparent !important;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 8px 0;
}

:deep(.el-menu-item) {
  color: rgba(255, 255, 255, 0.65) !important;
  margin: 2px 8px;
  border-radius: 8px;
  height: 44px;
}

:deep(.el-menu-item:hover) {
  background: rgba(255, 255, 255, 0.08) !important;
  color: white !important;
}

:deep(.el-menu-item.is-active) {
  background: linear-gradient(135deg, #667eea, #764ba2) !important;
  color: white !important;
}

:deep(.el-menu--collapse .el-menu-item) {
  margin: 2px 8px;
}

.menu-divider {
  border-color: rgba(255, 255, 255, 0.1) !important;
  margin: 8px 16px;
}

.menu-group-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.3);
  padding: 4px 20px 8px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.collapse-btn {
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  transition: color 0.2s;
  flex-shrink: 0;
}

.collapse-btn:hover {
  color: rgba(255, 255, 255, 0.8);
}

/* Header */
.admin-header {
  background: white;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  height: 56px !important;
  flex-shrink: 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
}

/* 主内容 */
.main-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.admin-main {
  background: #f5f7fa;
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

/* 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.page-fade-enter-active,
.page-fade-leave-active {
  transition: all 0.2s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
