<template>
  <div class="dashboard">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2 class="page-title">控制台</h2>
      <p class="page-desc">欢迎回来，这里是你的项目管理中心</p>
    </div>

    <!-- 统计卡片 -->
    <div class="stat-cards">
      <div class="stat-card" v-for="stat in stats" :key="stat.label">
        <div class="stat-icon" :style="{ background: stat.gradient }">
          <el-icon size="24"><component :is="stat.icon" /></el-icon>
        </div>
        <div class="stat-info">
          <div class="stat-value">{{ stat.value }}</div>
          <div class="stat-label">{{ stat.label }}</div>
        </div>
        <div class="stat-bg" :style="{ background: stat.gradient }"></div>
      </div>
    </div>

    <!-- 分类分布 + 最近项目 -->
    <div class="dashboard-grid">
      <!-- 分类分布 -->
      <el-card class="chart-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>分类分布</span>
          </div>
        </template>
        <div v-if="categoryStats.length" class="category-list">
          <div v-for="item in categoryStats" :key="item.category" class="category-row">
            <span class="cat-name">{{ item.category }}</span>
            <div class="cat-bar-wrap">
              <div
                class="cat-bar"
                :style="{
                  width: (item.count / maxCount * 100) + '%',
                  background: `linear-gradient(90deg, #667eea, #764ba2)`
                }"
              ></div>
            </div>
            <span class="cat-count">{{ item.count }}</span>
          </div>
        </div>
        <el-empty v-else description="暂无数据" :image-size="80" />
      </el-card>

      <!-- 最近添加 -->
      <el-card class="recent-card" shadow="never">
        <template #header>
          <div class="card-header">
            <span>最近添加</span>
            <el-button text type="primary" @click="$router.push('/main/projects')">
              查看全部
            </el-button>
          </div>
        </template>
        <div v-if="recentProjects.length" class="recent-list">
          <div
            v-for="project in recentProjects"
            :key="project.id"
            class="recent-item"
            @click="window.open(project.url, '_blank')"
          >
            <div class="recent-avatar" :style="{ background: project.color }">
              {{ project.name?.[0] }}
            </div>
            <div class="recent-info">
              <div class="recent-name">{{ project.name }}</div>
              <div class="recent-url">{{ project.url }}</div>
            </div>
            <el-tag :type="project.visible ? 'success' : 'info'" size="small" round>
              {{ project.visible ? '展示中' : '已隐藏' }}
            </el-tag>
          </div>
        </div>
        <el-empty v-else description="还没有项目" :image-size="80">
          <el-button type="primary" @click="$router.push('/main/projects')">
            添加第一个项目
          </el-button>
        </el-empty>
      </el-card>
    </div>

    <!-- 快捷操作 -->
    <el-card class="quick-card" shadow="never">
      <template #header>
        <span>快捷操作</span>
      </template>
      <div class="quick-actions">
        <div class="quick-item" @click="$router.push('/main/projects')">
          <div class="quick-icon" style="background: linear-gradient(135deg, #667eea, #764ba2)">
            <el-icon size="22"><Plus /></el-icon>
          </div>
          <span>添加新项目</span>
        </div>
        <div class="quick-item" @click="$router.push('/')">
          <div class="quick-icon" style="background: linear-gradient(135deg, #f6d365, #fda085)">
            <el-icon size="22"><View /></el-icon>
          </div>
          <span>查看首页</span>
        </div>
        <div class="quick-item" @click="$router.push('/main/projects')">
          <div class="quick-icon" style="background: linear-gradient(135deg, #a8edea, #fed6e3)">
            <el-icon size="22" style="color: #555"><Edit /></el-icon>
          </div>
          <span>管理项目</span>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { projectApi } from '@/apis'

const allProjects = ref([])
const loading = ref(false)

const stats = computed(() => [
  {
    label: '项目总数',
    value: allProjects.value.length,
    icon: 'FolderOpened',
    gradient: 'linear-gradient(135deg, #667eea, #764ba2)'
  },
  {
    label: '展示中',
    value: allProjects.value.filter(p => p.visible).length,
    icon: 'Monitor',
    gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)'
  },
  {
    label: '分类数',
    value: new Set(allProjects.value.map(p => p.category)).size,
    icon: 'Collection',
    gradient: 'linear-gradient(135deg, #f6d365, #fda085)'
  },
  {
    label: '已隐藏',
    value: allProjects.value.filter(p => !p.visible).length,
    icon: 'Hide',
    gradient: 'linear-gradient(135deg, #a18cd1, #fbc2eb)'
  }
])

const categoryStats = computed(() => {
  const map = {}
  allProjects.value.forEach(p => {
    map[p.category] = (map[p.category] || 0) + 1
  })
  return Object.entries(map).map(([category, count]) => ({ category, count })).sort((a, b) => b.count - a.count)
})

const maxCount = computed(() => Math.max(...categoryStats.value.map(i => i.count), 1))

const recentProjects = computed(() =>
  [...allProjects.value].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
)

async function load() {
  loading.value = true
  try {
    const res = await projectApi.list({ pageSize: 100 })
    allProjects.value = res.data.list
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  margin-bottom: 4px;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 6px;
}

.page-desc {
  color: #888;
  font-size: 14px;
}

/* 统计卡片 */
.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.stat-card {
  position: relative;
  background: white;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}

.stat-info {
  position: relative;
  z-index: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: 800;
  color: #1a1a2e;
  line-height: 1;
}

.stat-label {
  font-size: 13px;
  color: #999;
  margin-top: 4px;
}

.stat-bg {
  position: absolute;
  right: -20px;
  top: -20px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  opacity: 0.06;
}

/* 中间区域 */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

:deep(.el-card) {
  border-radius: 16px;
  border: 1px solid #f0f0f0;
}

:deep(.el-card__header) {
  border-bottom: 1px solid #f5f5f5;
  padding: 16px 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 15px;
  font-weight: 600;
  color: #1a1a2e;
}

/* 分类分布 */
.category-list {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.category-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cat-name {
  width: 70px;
  font-size: 13px;
  color: #555;
  flex-shrink: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.cat-bar-wrap {
  flex: 1;
  height: 8px;
  background: #f0f2f5;
  border-radius: 4px;
  overflow: hidden;
}

.cat-bar {
  height: 100%;
  border-radius: 4px;
  transition: width 0.6s ease;
}

.cat-count {
  width: 24px;
  text-align: right;
  font-size: 13px;
  font-weight: 600;
  color: #667eea;
  flex-shrink: 0;
}

/* 最近项目 */
.recent-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 8px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.15s;
}

.recent-item:hover {
  background: #f5f7fa;
}

.recent-avatar {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
}

.recent-info {
  flex: 1;
  min-width: 0;
}

.recent-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recent-url {
  font-size: 12px;
  color: #bbb;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 快捷操作 */
.quick-actions {
  display: flex;
  gap: 16px;
}

.quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px 32px;
  border-radius: 14px;
  cursor: pointer;
  border: 2px dashed #e8e8e8;
  transition: all 0.2s;
  font-size: 13px;
  color: #666;
}

.quick-item:hover {
  border-color: #667eea;
  color: #667eea;
  background: #f5f6ff;
}

.quick-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

@media (max-width: 1100px) {
  .stat-cards {
    grid-template-columns: repeat(2, 1fr);
  }
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>
