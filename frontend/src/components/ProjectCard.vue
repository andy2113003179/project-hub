<template>
  <div class="project-card" @click="openProject">
    <!-- 封面图 -->
    <div class="card-cover" :style="coverStyle">
      <img v-if="project.image" :src="project.image" :alt="project.name" @error="onImgError" />
      <div v-else class="cover-placeholder">
        <span class="cover-letter">{{ project.name?.[0] }}</span>
      </div>
      <!-- 分类标签 -->
      <span class="category-badge">{{ project.category }}</span>
      <!-- 悬浮遮罩 -->
      <div class="card-overlay">
        <div class="overlay-btn">
          <el-icon size="20"><Link /></el-icon>
          <span>打开项目</span>
        </div>
      </div>
    </div>

    <!-- 卡片内容 -->
    <div class="card-body">
      <h3 class="card-title">{{ project.name }}</h3>
      <p class="card-desc">{{ project.description || '暂无介绍' }}</p>

      <!-- 标签 -->
      <div v-if="project.tags?.length" class="card-tags">
        <span v-for="tag in project.tags.slice(0, 3)" :key="tag" class="tag">{{ tag }}</span>
      </div>

      <!-- 底部 -->
      <div class="card-footer">
        <span class="card-url" :title="project.url">
          <el-icon size="12"><Monitor /></el-icon>
          {{ displayUrl }}
        </span>
        <el-icon class="arrow-icon" size="16"><ArrowRightBold /></el-icon>
      </div>
    </div>

    <!-- 左侧色条 -->
    <div class="color-bar" :style="{ background: project.color || '#409eff' }"></div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  project: {
    type: Object,
    required: true
  }
})

const imgError = ref(false)

const coverStyle = computed(() => ({
  background: imgError.value || !props.project.image
    ? `linear-gradient(135deg, ${props.project.color || '#667eea'}cc, ${props.project.color || '#764ba2'}66)`
    : undefined
}))

const displayUrl = computed(() => {
  try {
    const url = new URL(props.project.url)
    return url.hostname + (url.port ? ':' + url.port : '')
  } catch {
    return props.project.url
  }
})

function openProject() {
  window.open(props.project.url, '_blank', 'noopener,noreferrer')
}

function onImgError() {
  imgError.value = true
}
</script>

<style scoped>
.project-card {
  position: relative;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
  display: flex;
  flex-direction: column;
}

.project-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
}

.project-card:hover .card-overlay {
  opacity: 1;
}

.project-card:hover .arrow-icon {
  transform: translateX(4px);
  color: #667eea;
}

/* 封面 */
.card-cover {
  position: relative;
  height: 180px;
  overflow: hidden;
  flex-shrink: 0;
}

.card-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.project-card:hover .card-cover img {
  transform: scale(1.05);
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-letter {
  font-size: 64px;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1;
  text-transform: uppercase;
}

.category-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(8px);
  color: white;
  font-size: 12px;
  padding: 3px 10px;
  border-radius: 10px;
  font-weight: 500;
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.25s ease;
}

.overlay-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-size: 15px;
  font-weight: 600;
  padding: 10px 24px;
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 30px;
  backdrop-filter: blur(4px);
}

/* 内容 */
.card-body {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
  padding-left: 24px;
}

.card-title {
  font-size: 17px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-desc {
  font-size: 13px;
  color: #888;
  line-height: 1.6;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 12px;
}

/* 标签 */
.card-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  background: #f0f2ff;
  color: #667eea;
  font-weight: 500;
}

/* 底部 */
.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 12px;
  border-top: 1px solid #f5f5f5;
}

.card-url {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #bbb;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.arrow-icon {
  color: #ddd;
  transition: transform 0.2s ease, color 0.2s ease;
  flex-shrink: 0;
}

/* 左侧色条 */
.color-bar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  border-radius: 0 0 0 0;
}
</style>
