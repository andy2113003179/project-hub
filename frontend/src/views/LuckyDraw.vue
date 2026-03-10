<template>
  <div class="lucky-draw-page">
    <!-- 顶部导航 -->
    <header class="header">
      <div class="header-inner">
        <div class="logo" @click="$router.push('/')">
          <div class="logo-icon">🏮</div>
          <div class="logo-text">
            <span class="logo-title">今日运势签</span>
            <span class="logo-sub">摇签问天意，解签知吉凶</span>
          </div>
        </div>
        <el-button class="back-btn" @click="$router.push('/')">
          <el-icon><ArrowLeft /></el-icon>
          返回首页
        </el-button>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="main-content">
      <div class="container">

        <!-- 签筒区域 -->
        <div class="stage-wrap">
          <!-- 装饰烛台 -->
          <div class="candle left-candle">
            <div class="candle-flame"></div>
            <div class="candle-body"></div>
          </div>
          <div class="candle right-candle">
            <div class="candle-flame"></div>
            <div class="candle-body"></div>
          </div>

          <!-- 签筒 -->
          <div class="qiantong-wrap" :class="{ shaking: isShaking }">
            <!-- 签条：先渲染 = 层级在筒身后面，顶部自然露出筒口 -->
            <div class="sticks-layer">
              <div
                v-for="i in stickCount"
                :key="i"
                class="stick"
                :style="getStickStyle(i)"
              ></div>
            </div>
            <!-- 签筒筒身：后渲染 = 层级在签条前面，遮住签条下半段 -->
            <div class="qiantong">
              <div class="qiantong-rim"></div>
            </div>
            <div class="qiantong-base"></div>
          </div>
        </div>

        <!-- 操作区 -->
        <div class="action-area">
          <p class="action-hint" v-if="!drawnQian && !isShaking">
            心诚则灵，诚心摇签，问今日运势
          </p>
          <p class="action-hint shaking-hint" v-if="isShaking">
            诚心礼拜，摇签中...
          </p>

          <el-button
            v-if="!drawnQian"
            class="shake-btn"
            :loading="isShaking"
            :disabled="isShaking"
            @click="startShake"
          >
            <span v-if="!isShaking">🙏 摇签求运势</span>
            <span v-else>摇签中...</span>
          </el-button>

          <el-button
            v-else
            class="shake-btn secondary-btn"
            @click="resetDraw"
          >
            🔄 重新摇签
          </el-button>
        </div>

        <!-- 签文结果 -->
        <transition name="result-reveal">
          <div v-if="drawnQian" class="result-card">
            <!-- 签号 & 等级 -->
            <div class="result-header">
              <div class="stick-number">第 {{ drawnQian.id }} 签</div>
              <div class="level-badge" :class="getLevelClass(drawnQian.level)">
                {{ drawnQian.level }}
              </div>
            </div>

            <!-- 签诗 -->
            <div class="verse-section">
              <div class="verse-label">
                <span class="verse-icon">📜</span> 签诗
              </div>
              <div class="verse-text">{{ drawnQian.verse }}</div>
            </div>

            <!-- 解签按钮 & 解签内容 -->
            <div class="jieqian-area">
              <el-button
                v-if="!showInterpretation"
                class="jieqian-btn"
                @click="interpretQian"
              >
                ✨ 点击解签
              </el-button>

              <transition name="interp-reveal">
                <div v-if="showInterpretation" class="interpretation-section">
                  <div class="interp-label">
                    <span class="interp-icon">💡</span> 解签
                  </div>
                  <div class="interp-text">{{ drawnQian.interpretation }}</div>
                  <div class="interp-footer">
                    <span class="date-tag">{{ todayStr }}</span>
                    <span class="blessing-tag">愿君平安顺遂</span>
                  </div>
                </div>
              </transition>
            </div>
          </div>
        </transition>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ArrowLeft } from '@element-plus/icons-vue'
import qianData from '@/assets/json/qian.json'

const isShaking = ref(false)
const drawnQian = ref(null)
const showInterpretation = ref(false)
const stickCount = 12

const todayStr = computed(() => {
  const d = new Date()
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
})

const getStickStyle = (i) => {
  // 用确定性伪随机让签条自然散布，不每次变化
  const seed = i * 7.3 + 1.5
  const x = (Math.sin(seed) * 0.5 + 0.5) * 52   // 0~52px 水平分布
  const rot = Math.sin(seed * 2.1) * 10           // -16°~+16° 轻微倾斜
  const colors = ['#c8a96e', '#d4b87a', '#b89558', '#e0c87c', '#c4a060', '#dab870']
  return {
    left: `${x.toFixed(1)}px`,
    transform: `rotate(${rot.toFixed(1)}deg)`,
    background: colors[i % colors.length],
  }
}

const getLevelClass = (level) => {
  const map = {
    '上上签': 'level-supreme',
    '上签': 'level-good',
    '中签': 'level-mid',
    '下签': 'level-bad'
  }
  return map[level] || 'level-mid'
}

const startShake = () => {
  isShaking.value = true
  drawnQian.value = null
  showInterpretation.value = false

  setTimeout(() => {
    const idx = Math.floor(Math.random() * qianData.length)
    drawnQian.value = qianData[idx]
    isShaking.value = false
  }, 1800)
}

const interpretQian = () => {
  showInterpretation.value = true
}

const resetDraw = () => {
  drawnQian.value = null
  showInterpretation.value = false
}
</script>

<style scoped>
.lucky-draw-page {
  min-height: 100vh;
  background: linear-gradient(160deg, #1a0a00 0%, #3d1a00 35%, #6b2d00 65%, #8b1a1a 100%);
  position: relative;
  overflow-x: hidden;
}

.lucky-draw-page::before {
  content: '';
  position: fixed;
  inset: 0;
  background:
    radial-gradient(ellipse at 20% 20%, rgba(200, 100, 0, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 80%, rgba(139, 26, 26, 0.2) 0%, transparent 50%);
  pointer-events: none;
}

/* ===== Header ===== */
.header {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(200, 169, 110, 0.25);
}

.header-inner {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 24px;
  height: 68px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.logo-icon {
  font-size: 32px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #c8a96e, #8b4513);
  border-radius: 12px;
  box-shadow: 0 0 12px rgba(200, 169, 110, 0.4);
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-title {
  font-size: 18px;
  font-weight: 700;
  color: #e8c97c;
  letter-spacing: 2px;
}

.logo-sub {
  font-size: 11px;
  color: rgba(200, 169, 110, 0.6);
}

.back-btn {
  border-radius: 8px;
  background: rgba(200, 169, 110, 0.15);
  border-color: rgba(200, 169, 110, 0.35);
  color: #c8a96e;
}

.back-btn:hover {
  background: rgba(200, 169, 110, 0.25);
  border-color: #c8a96e;
  color: #e8c97c;
}

/* ===== Main ===== */
.main-content {
  padding: 40px 24px 60px;
}

.container {
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 36px;
}

/* ===== 签筒舞台 ===== */
.stage-wrap {
  position: relative;
  width: 280px;
  height: 280px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

/* 烛台 */
.candle {
  position: absolute;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.left-candle { left: 0; }
.right-candle { right: 0; }

.candle-flame {
  width: 10px;
  height: 18px;
  background: radial-gradient(ellipse at 50% 80%, #fff8e1, #ffd54f 40%, #ff8f00 75%, transparent);
  border-radius: 50% 50% 40% 40%;
  animation: flicker 1.2s ease-in-out infinite alternate;
  filter: drop-shadow(0 0 6px #ffa000);
}

@keyframes flicker {
  0%   { transform: scaleX(1) scaleY(1) rotate(-2deg); opacity: 0.9; }
  50%  { transform: scaleX(0.85) scaleY(1.1) rotate(2deg); opacity: 1; }
  100% { transform: scaleX(1.05) scaleY(0.95) rotate(-1deg); opacity: 0.85; }
}

.candle-body {
  width: 14px;
  height: 60px;
  background: linear-gradient(to right, #f9f3e3, #fff8e8, #f5ece0);
  border-radius: 2px;
  box-shadow: 0 0 8px rgba(255, 200, 50, 0.3);
}

/* 签筒整体容器：绝对定位上下子元素 */
.qiantong-wrap {
  position: relative;
  width: 130px;
  height: 230px;
}

.qiantong-wrap.shaking {
  animation: shake 1.8s ease-in-out;
}

/* 签条层：先渲染(层级低)，被筒身遮住下半段 */
.sticks-layer {
  position: absolute;
  bottom: 18px; /* 与筒底齐平，坐在 base 上 */
  left: 50%;
  transform: translateX(-50%);
  width: 68px;
  height: 0;
  z-index: 1;
}

/* 签条：从底部向上伸，明显高于签筒 */
.stick {
  position: absolute;
  bottom: 0;
  width: 5px;
  height: 185px; /* 签条高 185px，筒身 140px，伸出约 45px */
  border-radius: 3px 3px 1px 1px;
  transform-origin: bottom center;
  box-shadow: 1px 0 2px rgba(0,0,0,0.6);
}

/* 签筒筒身：后渲染(层级高)，自然覆盖签条下段 */
.qiantong {
  position: absolute;
  bottom: 18px; /* 坐在 base 上 */
  left: 50%;
  transform: translateX(-50%);
  width: 110px;
  height: 140px;
  background: linear-gradient(160deg, #8b1a1a 0%, #6b1010 40%, #5a0d0d 100%);
  border-radius: 8px 8px 12px 12px;
  z-index: 2;
  box-shadow:
    inset -4px 0 8px rgba(0,0,0,0.4),
    inset 4px 0 8px rgba(200,100,0,0.15),
    0 8px 32px rgba(0,0,0,0.6),
    0 0 0 2px rgba(200,169,110,0.3);
}

/* 签筒花纹 */
.qiantong::before {
  content: '福';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 48px;
  font-weight: 900;
  color: rgba(200, 169, 110, 0.12);
  pointer-events: none;
}

.qiantong::after {
  content: '';
  position: absolute;
  top: 8px;
  left: 8px;
  right: 8px;
  height: 3px;
  background: linear-gradient(to right, transparent, rgba(200,169,110,0.5), transparent);
  border-radius: 2px;
}

@keyframes shake {
  0%   { transform: rotate(0deg); }
  5%   { transform: rotate(-8deg); }
  10%  { transform: rotate(8deg); }
  15%  { transform: rotate(-10deg); }
  20%  { transform: rotate(10deg); }
  25%  { transform: rotate(-8deg); }
  30%  { transform: rotate(8deg); }
  35%  { transform: rotate(-12deg); }
  40%  { transform: rotate(12deg); }
  50%  { transform: rotate(-8deg); }
  60%  { transform: rotate(6deg); }
  70%  { transform: rotate(-4deg); }
  80%  { transform: rotate(3deg); }
  90%  { transform: rotate(-1deg); }
  100% { transform: rotate(0deg); }
}

.qiantong-rim {
  position: absolute;
  top: -7px;
  left: -4px;
  right: -4px;
  height: 14px;
  background: linear-gradient(to bottom, #c8a96e, #9a7a42, #c8a96e);
  border-radius: 4px 4px 0 0;
  box-shadow: 0 2px 6px rgba(0,0,0,0.4);
  z-index: 3; /* 金色边框最高层，压住签条 */
}

.qiantong-base {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 130px;
  height: 18px;
  background: linear-gradient(to bottom, #9a7a42, #c8a96e, #9a7a42);
  border-radius: 0 0 8px 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.5);
  z-index: 2;
}

/* ===== 操作区 ===== */
.action-area {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.action-hint {
  font-size: 14px;
  color: rgba(200, 169, 110, 0.7);
  letter-spacing: 1px;
  margin: 0;
}

.shaking-hint {
  color: #e8c97c;
  animation: pulse 0.8s ease-in-out infinite alternate;
}

@keyframes pulse {
  from { opacity: 0.6; }
  to   { opacity: 1; }
}

.shake-btn {
  padding: 14px 48px;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 2px;
  border-radius: 40px;
  background: linear-gradient(135deg, #c8a96e, #8b4513);
  border: none;
  color: #fff8e8;
  box-shadow: 0 6px 20px rgba(200, 100, 0, 0.45), inset 0 1px 0 rgba(255,255,255,0.15);
  transition: all 0.3s;
  cursor: pointer;
  height: auto;
  line-height: 1.4;
}

.shake-btn:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 10px 28px rgba(200, 100, 0, 0.55), inset 0 1px 0 rgba(255,255,255,0.15);
  background: linear-gradient(135deg, #dbb97e, #9a5423);
}

.shake-btn:active:not(:disabled) {
  transform: translateY(0);
}

.shake-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.secondary-btn {
  background: rgba(200, 169, 110, 0.15) !important;
  border: 2px solid rgba(200, 169, 110, 0.5) !important;
  color: #c8a96e !important;
  box-shadow: none !important;
  font-size: 15px !important;
  padding: 10px 36px !important;
}

.secondary-btn:hover {
  background: rgba(200, 169, 110, 0.25) !important;
  border-color: #c8a96e !important;
  color: #e8c97c !important;
  transform: translateY(-2px) !important;
}

/* ===== 结果卡片 ===== */
.result-card {
  width: 100%;
  background: linear-gradient(160deg, rgba(60, 20, 0, 0.9), rgba(40, 10, 0, 0.95));
  border: 1px solid rgba(200, 169, 110, 0.35);
  border-radius: 20px;
  padding: 28px;
  box-shadow:
    0 20px 60px rgba(0,0,0,0.5),
    inset 0 1px 0 rgba(200,169,110,0.2);
  backdrop-filter: blur(8px);
}

.result-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(200, 169, 110, 0.2);
}

.stick-number {
  font-size: 20px;
  font-weight: 700;
  color: rgba(200, 169, 110, 0.8);
  letter-spacing: 1px;
}

/* 等级徽章 */
.level-badge {
  padding: 6px 20px;
  border-radius: 20px;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: 3px;
}

.level-supreme {
  background: linear-gradient(135deg, #ff9900, #ffcc00);
  color: #5a3000;
  box-shadow: 0 0 16px rgba(255, 180, 0, 0.6);
  animation: glow-gold 2s ease-in-out infinite alternate;
}

@keyframes glow-gold {
  from { box-shadow: 0 0 10px rgba(255, 180, 0, 0.4); }
  to   { box-shadow: 0 0 22px rgba(255, 180, 0, 0.8); }
}

.level-good {
  background: linear-gradient(135deg, #52c41a, #95de64);
  color: #135200;
  box-shadow: 0 0 12px rgba(82, 196, 26, 0.4);
}

.level-mid {
  background: linear-gradient(135deg, #1890ff, #69c0ff);
  color: #003a8c;
  box-shadow: 0 0 12px rgba(24, 144, 255, 0.4);
}

.level-bad {
  background: linear-gradient(135deg, #8c8c8c, #bfbfbf);
  color: #1f1f1f;
}

/* 签诗区域 */
.verse-section {
  margin-bottom: 24px;
}

.verse-label {
  font-size: 13px;
  color: rgba(200, 169, 110, 0.6);
  letter-spacing: 2px;
  margin-bottom: 12px;
  text-transform: uppercase;
}

.verse-text {
  font-size: 17px;
  color: #f0dca0;
  line-height: 2;
  letter-spacing: 2px;
  font-weight: 500;
  background: rgba(200, 169, 110, 0.06);
  border-left: 3px solid rgba(200, 169, 110, 0.5);
  padding: 12px 16px;
  border-radius: 0 8px 8px 0;
}

/* 解签区域 */
.jieqian-area {
  text-align: center;
}

.jieqian-btn {
  padding: 12px 40px;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 2px;
  border-radius: 30px;
  background: transparent;
  border: 2px solid rgba(200, 169, 110, 0.6);
  color: #c8a96e;
  cursor: pointer;
  transition: all 0.3s;
  height: auto;
}

.jieqian-btn:hover {
  background: rgba(200, 169, 110, 0.15);
  border-color: #c8a96e;
  color: #e8c97c;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(200, 169, 110, 0.2);
}

/* 解签内容 */
.interpretation-section {
  text-align: left;
  padding-top: 20px;
  border-top: 1px solid rgba(200, 169, 110, 0.15);
}

.interp-label {
  font-size: 13px;
  color: rgba(200, 169, 110, 0.6);
  letter-spacing: 2px;
  margin-bottom: 12px;
}

.interp-text {
  font-size: 16px;
  color: #e0c88a;
  line-height: 1.9;
  letter-spacing: 0.5px;
}

.interp-footer {
  margin-top: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
}

.date-tag {
  font-size: 12px;
  color: rgba(200, 169, 110, 0.5);
  letter-spacing: 1px;
}

.blessing-tag {
  font-size: 13px;
  color: rgba(200, 169, 110, 0.7);
  padding: 4px 14px;
  border: 1px solid rgba(200, 169, 110, 0.3);
  border-radius: 20px;
  letter-spacing: 2px;
}

/* ===== 动画 ===== */
.result-reveal-enter-active {
  transition: all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.result-reveal-leave-active {
  transition: all 0.3s ease;
}

.result-reveal-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.95);
}

.result-reveal-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}

.interp-reveal-enter-active {
  transition: all 0.5s ease;
}

.interp-reveal-enter-from {
  opacity: 0;
  transform: translateY(16px);
}

/* ===== 响应式 ===== */
@media (max-width: 600px) {
  .header-inner {
    padding: 0 16px;
    height: 58px;
  }

  .logo-icon {
    font-size: 26px;
    width: 40px;
    height: 40px;
  }

  .logo-title {
    font-size: 16px;
  }

  .logo-sub {
    display: none;
  }

  .main-content {
    padding: 28px 16px 48px;
  }

  .stage-wrap {
    width: 240px;
    height: 230px;
  }

  .result-card {
    padding: 20px 18px;
  }

  .verse-text {
    font-size: 15px;
    letter-spacing: 1px;
  }

  .interp-text {
    font-size: 15px;
  }

  .shake-btn {
    padding: 12px 36px;
    font-size: 16px;
  }
}
</style>
