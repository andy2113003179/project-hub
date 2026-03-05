<template>
  <div class="home-page">
    <!-- 顶部 Header -->
    <header class="header">
      <div class="header-inner">
        <div class="logo">
          <div class="logo-icon">
            <el-icon size="28"><Grid /></el-icon>
          </div>
          <div class="logo-text">
            <span class="logo-title">晗笑AI</span>
            <span class="logo-sub">我的项目导航</span>
          </div>
        </div>
        <div class="header-actions">
          <!-- <el-button
            class="tool-btn"
            type="primary"
            @click="$router.push('/what-to-eat')"
          >
            🍜 晚上吃什么
          </el-button> -->
          <!-- <el-button
            class="admin-btn"
            @click="$router.push('/main')"
          >
            <el-icon><Setting /></el-icon>
            管理后台
          </el-button> -->
        </div>
      </div>
    </header>

    <!-- Hero 区域 -->
    <section class="hero">
      <div class="hero-bg">
        <div class="hero-bg-img">
          <img style="width: 200px;position: absolute;left: 25%;bottom: 0;" src="@/assets/images/bg.png" alt="hero-bg">
        </div>
      </div>
      <div class="hero-content">
        <h1 class="hero-title">
          我的<span class="gradient-text">项目空间</span>
        </h1>
        <p class="hero-desc">集中管理和展示所有已部署的项目，一键直达</p>
        <div class="hero-stats">
          <div class="stat-item">
            <span class="stat-num">{{ store.projects.length }}</span>
            <span class="stat-label">个项目</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-num">{{ store.categories.length - 1 }}</span>
            <span class="stat-label">个分类</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 分类筛选 -->
    <section class="filter-section">
      <div class="container">
        <div class="category-tabs">
          <button
            v-for="cat in store.categories"
            :key="cat"
            class="cat-tab"
            :class="{ active: store.activeCategory === cat }"
            @click="store.setCategory(cat)"
          >
            {{ cat }}
          </button>
        </div>
      </div>
    </section>

    <!-- 项目卡片区域 -->
    <main class="main-content">
      <div class="container">
        <!-- 加载骨架 -->
        <div v-if="store.loading" class="card-grid">
          <div v-for="i in 6" :key="i" class="skeleton-card">
            <div class="skeleton-img"></div>
            <div class="skeleton-body">
              <div class="skeleton-line w60"></div>
              <div class="skeleton-line w90"></div>
              <div class="skeleton-line w75"></div>
            </div>
          </div>
        </div>

        <!-- 项目卡片 -->
        <transition-group
          v-else-if="store.projects.length"
          name="card-fade"
          tag="div"
          class="card-grid"
        >
          <ProjectCard
            v-for="project in store.projects"
            :key="project.id"
            :project="project"
          />
        </transition-group>

        <!-- 空状态 -->
        <div v-else class="empty-state">
          <div class="empty-icon">📭</div>
          <p class="empty-text">该分类暂无项目</p>
          <el-button type="primary" @click="$router.push('/main/projects')">
            去添加项目
          </el-button>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <p>Project Hub · 统一管理你的线上项目</p>
      <div class="contact-links" style="margin-top: 8px; display: flex; gap: 20px; justify-content: center; align-items: center;">
        <span style="font-size: 14px; color: #888;">联系我们：</span>
        <a href="https://v.douyin.com/YT4VEjTyVE0/ 9@3.com :4pm" target="_blank" rel="noopener" title="抖音" style="display: flex; align-items: center; text-decoration: none; color: inherit;">
          <img src="https://www.douyin.com/favicon.ico" alt="抖音" style="width: 22px; height: 22px;">
          <span style="margin-left: 4px;">抖音</span>
        </a>
        <a href="https://b23.tv/k8JX8XO" target="_blank" rel="noopener" title="B站" style="display: flex; align-items: center; text-decoration: none; color: inherit;">
          <img src="https://www.bilibili.com/favicon.ico" alt="B站" style="width: 22px; height: 22px;">
          <span style="margin-left: 4px;">B站</span>
        </a>
        <a href="https://www.xiaohongshu.com/" target="_blank" rel="noopener" title="小红书" style="display: flex; align-items: center; text-decoration: none; color: inherit;">
          <img src="https://xiaohongshu.com/favicon.ico" alt="小红书" style="width: 22px; height: 22px;">
          <span style="margin-left: 4px;">小红书</span>
        </a>
        <a href="https://www.zhihu.com/people/" target="_blank" rel="noopener" title="知乎" style="display: flex; align-items: center; text-decoration: none; color: inherit;">
          <img src="https://static.zhihu.com/heifetz/favicon.ico" alt="知乎" style="width: 22px; height: 22px;">
          <span style="margin-left: 4px;">知乎</span>
        </a>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useProjectStore } from '@/stores/projectStore'
import ProjectCard from '@/components/ProjectCard.vue'

const store = useProjectStore()

onMounted(() => {
  store.fetchCategories()
  store.fetchPublicProjects()
})
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  background: #f0f2f5;
}

/* Header */
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.header-inner {
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-title {
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo-sub {
  font-size: 12px;
  color: #999;
  line-height: 1.2;
}

.tool-btn {
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
}

.admin-btn {
  border-radius: 8px;
  gap: 6px;
}

/* Hero */
.hero {
  position: relative;
  padding: 80px 24px 60px;
  text-align: center;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f64f59 100%);
  opacity: 0.08;
  pointer-events: none;
}

.hero-content {
  position: relative;
  max-width: 600px;
  margin: 0 auto;
}

.hero-title {
  font-size: 48px;
  font-weight: 800;
  color: #1a1a2e;
  line-height: 1.2;
  margin-bottom: 16px;
}

.gradient-text {
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-desc {
  font-size: 17px;
  color: #666;
  margin-bottom: 32px;
}

.hero-stats {
  display: inline-flex;
  align-items: center;
  gap: 24px;
  background: white;
  border-radius: 16px;
  padding: 16px 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.stat-item {
  text-align: center;
}

.stat-num {
  display: block;
  font-size: 28px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.stat-label {
  font-size: 13px;
  color: #888;
  margin-top: 4px;
  display: block;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: #e8e8e8;
}

/* 分类筛选 */
.filter-section {
  padding: 0 0 24px;
}

.container {
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 24px;
}

.category-tabs {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.cat-tab {
  padding: 8px 20px;
  border-radius: 20px;
  border: 2px solid transparent;
  background: white;
  color: #555;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.cat-tab:hover {
  border-color: #667eea;
  color: #667eea;
}

.cat-tab.active {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* 主内容 */
.main-content {
  padding-bottom: 80px;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

/* 骨架屏 */
.skeleton-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.skeleton-img {
  height: 180px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.skeleton-body {
  padding: 20px;
}

.skeleton-line {
  height: 14px;
  border-radius: 7px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  margin-bottom: 10px;
}

.w60 { width: 60%; }
.w90 { width: 90%; }
.w75 { width: 75%; }

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  color: #999;
  margin-bottom: 24px;
}

/* 卡片过渡动画 */
.card-fade-enter-active,
.card-fade-leave-active {
  transition: all 0.3s ease;
}

.card-fade-enter-from,
.card-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Footer */
.footer {
  text-align: center;
  padding: 24px;
  color: #bbb;
  font-size: 13px;
  border-top: 1px solid #eee;
  background: white;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 32px;
  }
  .card-grid {
    grid-template-columns: 1fr;
  }
}
</style>
