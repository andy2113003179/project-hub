<template>
  <div class="what-to-eat-page">
    <!-- 顶部导航 -->
    <header class="header">
      <div class="header-inner">
        <div class="logo" @click="$router.push('/')">
          <div class="logo-icon">🍜</div>
          <div class="logo-text">
            <span class="logo-title">晚上吃什么</span>
            <span class="logo-sub">让选择变得简单</span>
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
        <!-- 模式选择 -->
        <div class="mode-selector">
          <button
            class="mode-btn"
            :class="{ active: mode === 'wheel' }"
            @click="switchMode('wheel')"
          >
            <span class="mode-icon">🎡</span>
            <span class="mode-name">转盘抽取</span>
          </button>
          <button
            class="mode-btn"
            :class="{ active: mode === 'eliminate' }"
            @click="switchMode('eliminate')"
          >
            <span class="mode-icon">❌</span>
            <span class="mode-name">淘汰模式</span>
          </button>
        </div>

        <!-- 转盘模式 -->
        <div v-if="mode === 'wheel'" class="wheel-mode">
          <div class="mode-config">
            <span class="config-label">抽取数量：</span>
            <el-radio-group v-model="wheelFoodCount" @change="refreshWheelFoods" :disabled="isSpinning">
              <el-radio-button :label="10">10种</el-radio-button>
              <el-radio-button :label="20">20种</el-radio-button>
              <el-radio-button :label="30">30种</el-radio-button>
            </el-radio-group>
          </div>
          
          <div class="wheel-info">
            <span class="info-text">
              从 {{ foodList.length }} 种食物中随机抽取了 {{ wheelFoods.length }} 种
            </span>
          </div>
          
          <div class="wheel-container">
            <canvas ref="wheelCanvas" width="500" height="500"></canvas>
            <div class="wheel-pointer">▼</div>
          </div>
          
          <div class="result-display" v-if="wheelResult">
            <div class="result-icon">🎉</div>
            <div class="result-text">今晚吃</div>
            <div class="result-food">{{ wheelResult }}</div>
          </div>

          <div class="wheel-controls">
            <el-button
              type="primary"
              size="large"
              :disabled="isSpinning"
              @click="spinWheel"
              class="spin-btn"
            >
              {{ isSpinning ? '转动中...' : '开始转动' }}
            </el-button>
            <el-button 
              size="large" 
              :disabled="isSpinning"
              @click="refreshWheelFoods"
            >
              🔄 换一批
            </el-button>
            <el-button size="large" @click="showFoodManager = true">
              管理食物
            </el-button>
          </div>
        </div>

        <!-- 淘汰模式 -->
        <div v-if="mode === 'eliminate'" class="eliminate-mode">
          <div class="mode-config">
            <span class="config-label">抽取数量：</span>
            <el-radio-group v-model="eliminateFoodCount" @change="resetEliminate">
              <el-radio-button :label="10">10种</el-radio-button>
              <el-radio-button :label="20">20种</el-radio-button>
              <el-radio-button :label="30">30种</el-radio-button>
            </el-radio-group>
          </div>

          <div class="eliminate-header">
            <div class="progress-info">
              <span class="remaining-count">剩余 {{ eliminateFoods.length + 2 }} 个</span>
              <el-progress
                :percentage="((eliminateFoods.length + 2) / eliminateInitialCount) * 100"
                :show-text="false"
                :stroke-width="8"
              />
            </div>
            <el-button @click="resetEliminate">重新开始</el-button>
          </div>

          <!-- 二选一对决 - 擂台模式 -->
          <div v-if="currentChampion && currentChallenger" class="battle-container">
            <div class="battle-stats">
              <div class="stat-item">
                <span class="stat-label">已对决</span>
                <span class="stat-value">{{ battleCount }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">总共</span>
                <span class="stat-value">{{ eliminateInitialCount }}</span>
              </div>
              <div class="stat-item">
                <span class="stat-label">剩余</span>
                <span class="stat-value">{{ eliminateFoods.length + 2 }}</span>
              </div>
            </div>
            
            <div class="battle-title">选择你更想吃的</div>
            <div class="battle-cards">
              <div
                class="battle-card champion-card"
                @click="chooseFood(currentChampion)"
              >
                <div class="card-badge">🏆 擂主</div>
                <div class="card-content">
                  <div class="food-emoji-large">{{ currentChampion.emoji }}</div>
                  <div class="food-name-large">{{ currentChampion.name }}</div>
                </div>
                <div class="choose-hint">点击选择</div>
              </div>

              <div class="vs-divider">
                <span class="vs-text">VS</span>
              </div>

              <div
                class="battle-card challenger-card"
                @click="chooseFood(currentChallenger)"
              >
                <div class="card-badge">⚔️ 挑战者</div>
                <div class="card-content">
                  <div class="food-emoji-large">{{ currentChallenger.emoji }}</div>
                  <div class="food-name-large">{{ currentChallenger.name }}</div>
                </div>
                <div class="choose-hint">点击选择</div>
              </div>
            </div>
          </div>

          <!-- 最终结果 -->
          <div v-else-if="currentChampion && !currentChallenger" class="final-result">
            <div class="final-icon">🎊</div>
            <div class="final-text">经过 {{ battleCount }} 轮激烈对决</div>
            <div class="final-subtitle">最终胜出</div>
            <div class="final-food">
              <span class="final-emoji">{{ currentChampion.emoji }}</span>
              <span class="final-name">{{ currentChampion.name }}</span>
            </div>
            <el-button type="primary" size="large" @click="resetEliminate">
              再来一次
            </el-button>
          </div>

          <div v-else class="empty-state">
            <div class="empty-icon">😅</div>
            <div class="empty-text">所有食物都被淘汰了</div>
            <el-button type="primary" @click="resetEliminate">重新开始</el-button>
          </div>
        </div>
      </div>
    </main>

    <!-- 食物管理对话框 -->
    <el-dialog
      v-model="showFoodManager"
      title="管理食物列表"
      :width="dialogWidth"
      :close-on-click-modal="false"
    >
      <div class="food-manager">
        <div class="add-food-form">
          <el-popover placement="bottom-start" :width="280" trigger="click">
            <template #reference>
              <el-input
                v-model="newFood.emoji"
                placeholder="选表情"
                style="width: 90px"
                maxlength="2"
                readonly
                class="emoji-input"
              />
            </template>
            <div class="emoji-picker">
              <div class="emoji-picker-title">选择表情</div>
              <div class="emoji-picker-grid">
                <span
                  v-for="em in emojiOptions"
                  :key="em"
                  class="emoji-option"
                  :class="{ selected: newFood.emoji === em }"
                  @click="newFood.emoji = em"
                >{{ em }}</span>
              </div>
            </div>
          </el-popover>
          <el-input
            v-model="newFood.name"
            placeholder="食物名称"
            style="flex: 1"
            @keyup.enter="addFood"
          />
          <el-button type="primary" @click="addFood">添加</el-button>
        </div>

        <div class="food-list">
          <div
            v-for="food in foodList"
            :key="food.id"
            class="food-item"
          >
            <span class="food-emoji">{{ food.emoji }}</span>
            <span class="food-name">{{ food.name }}</span>
            <el-button
              type="danger"
              size="small"
              text
              @click="removeFood(food.id)"
            >
              删除
            </el-button>
          </div>
        </div>

        <div class="preset-foods">
          <el-button size="small" @click="loadPresetFoods">
            恢复默认食物
          </el-button>
          <el-button size="small" @click="clearAllFoods">
            清空所有食物
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { ArrowLeft } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const windowWidth = ref(window.innerWidth)
const onResize = () => { windowWidth.value = window.innerWidth }
const dialogWidth = computed(() => windowWidth.value < 500 ? '92%' : '600px')

// 模式选择
const mode = ref('wheel')

// 默认食物列表 - 扩充到200+种食物
const defaultFoods = [
  // 中餐主食类
  { id: 1, emoji: '🍜', name: '兰州拉面' },
  { id: 2, emoji: '🍜', name: '重庆小面' },
  { id: 3, emoji: '🍜', name: '刀削面' },
  { id: 4, emoji: '🍜', name: '热干面' },
  { id: 5, emoji: '🍜', name: '担担面' },
  { id: 6, emoji: '🍜', name: '炸酱面' },
  { id: 7, emoji: '🍜', name: '阳春面' },
  { id: 8, emoji: '🍜', name: '葱油拌面' },
  { id: 9, emoji: '🍚', name: '扬州炒饭' },
  { id: 10, emoji: '🍚', name: '蛋炒饭' },
  { id: 11, emoji: '🍚', name: '盖浇饭' },
  { id: 12, emoji: '🍚', name: '煲仔饭' },
  { id: 13, emoji: '🍚', name: '黄焖鸡米饭' },
  { id: 14, emoji: '🍚', name: '木桶饭' },
  { id: 15, emoji: '🍚', name: '石锅拌饭' },
  { id: 16, emoji: '🍲', name: '麻辣烫' },
  { id: 17, emoji: '🍲', name: '火锅' },
  { id: 18, emoji: '🍲', name: '冒菜' },
  { id: 19, emoji: '🍲', name: '串串香' },
  { id: 20, emoji: '🍲', name: '酸菜鱼' },
  { id: 21, emoji: '🥟', name: '水饺' },
  { id: 22, emoji: '🥟', name: '蒸饺' },
  { id: 23, emoji: '🥟', name: '煎饺' },
  { id: 24, emoji: '🥟', name: '馄饨' },
  { id: 25, emoji: '🥟', name: '抄手' },
  { id: 26, emoji: '🥢', name: '麻辣香锅' },
  { id: 27, emoji: '🥢', name: '干锅' },
  { id: 28, emoji: '🥢', name: '烤鱼' },
  { id: 29, emoji: '🥢', name: '水煮鱼' },
  { id: 30, emoji: '🥢', name: '剁椒鱼头' },
  
  // 中餐特色菜
  { id: 31, emoji: '🍗', name: '宫保鸡丁' },
  { id: 32, emoji: '🍗', name: '辣子鸡' },
  { id: 33, emoji: '🍗', name: '口水鸡' },
  { id: 34, emoji: '🍗', name: '炸鸡' },
  { id: 35, emoji: '🍗', name: '烤鸡' },
  { id: 36, emoji: '🥓', name: '红烧肉' },
  { id: 37, emoji: '🥓', name: '回锅肉' },
  { id: 38, emoji: '🥓', name: '京酱肉丝' },
  { id: 39, emoji: '🥓', name: '鱼香肉丝' },
  { id: 40, emoji: '🥓', name: '梅菜扣肉' },
  { id: 41, emoji: '🦐', name: '油焖大虾' },
  { id: 42, emoji: '🦐', name: '白灼虾' },
  { id: 43, emoji: '🦐', name: '龙虾' },
  { id: 44, emoji: '🦀', name: '螃蟹' },
  { id: 45, emoji: '🦀', name: '香辣蟹' },
  { id: 46, emoji: '🥘', name: '麻婆豆腐' },
  { id: 47, emoji: '🥘', name: '地三鲜' },
  { id: 48, emoji: '🥘', name: '鱼香茄子' },
  { id: 49, emoji: '🥘', name: '西红柿炒蛋' },
  { id: 50, emoji: '🥘', name: '青椒肉丝' },
  
  // 西餐快餐
  { id: 51, emoji: '🍕', name: '披萨' },
  { id: 52, emoji: '🍕', name: '意式披萨' },
  { id: 53, emoji: '🍕', name: '芝士披萨' },
  { id: 54, emoji: '🍔', name: '汉堡' },
  { id: 55, emoji: '🍔', name: '芝士汉堡' },
  { id: 56, emoji: '🍔', name: '鸡肉汉堡' },
  { id: 57, emoji: '🍟', name: '薯条' },
  { id: 58, emoji: '🌭', name: '热狗' },
  { id: 59, emoji: '🥙', name: '卷饼' },
  { id: 60, emoji: '🌮', name: '墨西哥卷' },
  { id: 61, emoji: '🌯', name: '墨西哥玉米饼' },
  { id: 62, emoji: '🥪', name: '三明治' },
  { id: 63, emoji: '🥪', name: '潜艇堡' },
  { id: 64, emoji: '🥪', name: '帕尼尼' },
  { id: 65, emoji: '🍝', name: '意大利面' },
  { id: 66, emoji: '🍝', name: '肉酱意面' },
  { id: 67, emoji: '🍝', name: '番茄意面' },
  { id: 68, emoji: '🍝', name: '奶油意面' },
  { id: 69, emoji: '🥩', name: '牛排' },
  { id: 70, emoji: '🥩', name: '菲力牛排' },
  { id: 71, emoji: '🥩', name: '西冷牛排' },
  { id: 72, emoji: '🥩', name: '肋眼牛排' },
  { id: 73, emoji: '🍖', name: '烤肉' },
  { id: 74, emoji: '🍖', name: '烤羊排' },
  { id: 75, emoji: '🍖', name: '烤猪排' },
  
  // 日韩料理
  { id: 76, emoji: '🍣', name: '寿司' },
  { id: 77, emoji: '🍣', name: '三文鱼寿司' },
  { id: 78, emoji: '🍣', name: '金枪鱼寿司' },
  { id: 79, emoji: '🍱', name: '便当' },
  { id: 80, emoji: '🍱', name: '日式便当' },
  { id: 81, emoji: '🍱', name: '鳗鱼饭' },
  { id: 82, emoji: '🍱', name: '亲子丼' },
  { id: 83, emoji: '🍱', name: '牛肉饭' },
  { id: 84, emoji: '🍱', name: '猪排饭' },
  { id: 85, emoji: '🍛', name: '咖喱饭' },
  { id: 86, emoji: '🍛', name: '日式咖喱' },
  { id: 87, emoji: '🍛', name: '印度咖喱' },
  { id: 88, emoji: '🍢', name: '关东煮' },
  { id: 89, emoji: '🍢', name: '章鱼小丸子' },
  { id: 90, emoji: '🍥', name: '拉面' },
  { id: 91, emoji: '🍥', name: '豚骨拉面' },
  { id: 92, emoji: '🍥', name: '味增拉面' },
  { id: 93, emoji: '🥘', name: '石锅拌饭' },
  { id: 94, emoji: '🥘', name: '部队锅' },
  { id: 95, emoji: '🥘', name: '韩式炸鸡' },
  { id: 96, emoji: '🥘', name: '韩式烤肉' },
  { id: 97, emoji: '🥘', name: '泡菜锅' },
  { id: 98, emoji: '🥘', name: '参鸡汤' },
  
  // 小吃类
  { id: 99, emoji: '🥐', name: '可颂' },
  { id: 100, emoji: '🥐', name: '羊角面包' },
  { id: 101, emoji: '🥖', name: '法棍' },
  { id: 102, emoji: '🥯', name: '贝果' },
  { id: 103, emoji: '🧇', name: '华夫饼' },
  { id: 104, emoji: '🥞', name: '煎饼' },
  { id: 105, emoji: '🥞', name: '班戟' },
  { id: 106, emoji: '🍳', name: '煎蛋' },
  { id: 107, emoji: '🍳', name: '炒蛋' },
  { id: 108, emoji: '🧆', name: '炸丸子' },
  { id: 109, emoji: '🌭', name: '烤肠' },
  { id: 110, emoji: '🍿', name: '爆米花' },
  
  // 中式小吃
  { id: 111, emoji: '🥟', name: '生煎包' },
  { id: 112, emoji: '🥟', name: '小笼包' },
  { id: 113, emoji: '🥟', name: '灌汤包' },
  { id: 114, emoji: '🥟', name: '包子' },
  { id: 115, emoji: '🥟', name: '肉包' },
  { id: 116, emoji: '🥟', name: '菜包' },
  { id: 117, emoji: '🥮', name: '月饼' },
  { id: 118, emoji: '🍡', name: '糖葫芦' },
  { id: 119, emoji: '🍡', name: '汤圆' },
  { id: 120, emoji: '🍡', name: '麻团' },
  { id: 121, emoji: '🥠', name: '春卷' },
  { id: 122, emoji: '🥠', name: '煎饼果子' },
  { id: 123, emoji: '🥠', name: '手抓饼' },
  { id: 124, emoji: '🥠', name: '鸡蛋灌饼' },
  { id: 125, emoji: '🍢', name: '烧烤' },
  { id: 126, emoji: '🍢', name: '羊肉串' },
  { id: 127, emoji: '🍢', name: '烤串' },
  { id: 128, emoji: '🍢', name: '铁板烧' },
  { id: 129, emoji: '🥘', name: '盖码饭' },
  { id: 130, emoji: '🥘', name: '卤肉饭' },
  
  // 粥粉面类
  { id: 131, emoji: '🍲', name: '皮蛋瘦肉粥' },
  { id: 132, emoji: '🍲', name: '海鲜粥' },
  { id: 133, emoji: '🍲', name: '八宝粥' },
  { id: 134, emoji: '🍲', name: '小米粥' },
  { id: 135, emoji: '🍜', name: '桂林米粉' },
  { id: 136, emoji: '🍜', name: '云南过桥米线' },
  { id: 137, emoji: '🍜', name: '螺蛳粉' },
  { id: 138, emoji: '🍜', name: '酸辣粉' },
  { id: 139, emoji: '🍜', name: '肠粉' },
  { id: 140, emoji: '🍜', name: '河粉' },
  { id: 141, emoji: '🍜', name: '炒河粉' },
  { id: 142, emoji: '🍜', name: '炒米粉' },
  { id: 143, emoji: '🍜', name: '沙县小吃' },
  { id: 144, emoji: '🍜', name: '兰州牛肉面' },
  { id: 145, emoji: '🍜', name: '油泼面' },
  
  // 素食健康类
  { id: 146, emoji: '🥗', name: '凯撒沙拉' },
  { id: 147, emoji: '🥗', name: '蔬菜沙拉' },
  { id: 148, emoji: '🥗', name: '水果沙拉' },
  { id: 149, emoji: '🥗', name: '鸡肉沙拉' },
  { id: 150, emoji: '🥗', name: '金枪鱼沙拉' },
  { id: 151, emoji: '🥙', name: '素食卷' },
  { id: 152, emoji: '🥙', name: '蔬菜卷' },
  { id: 153, emoji: '🫔', name: '玉米卷' },
  { id: 154, emoji: '🥘', name: '素炒时蔬' },
  { id: 155, emoji: '🥘', name: '清炒芦笋' },
  
  // 地方特色
  { id: 156, emoji: '🦆', name: '北京烤鸭' },
  { id: 157, emoji: '🦆', name: '盐水鸭' },
  { id: 158, emoji: '🦆', name: '烧鹅' },
  { id: 159, emoji: '🐷', name: '东坡肉' },
  { id: 160, emoji: '🐷', name: '烤乳猪' },
  { id: 161, emoji: '🐑', name: '羊蝎子' },
  { id: 162, emoji: '🐑', name: '羊肉泡馍' },
  { id: 163, emoji: '🐑', name: '手抓羊肉' },
  { id: 164, emoji: '🐑', name: '涮羊肉' },
  { id: 165, emoji: '🦞', name: '小龙虾' },
  { id: 166, emoji: '🦞', name: '麻辣小龙虾' },
  { id: 167, emoji: '🦞', name: '蒜蓉小龙虾' },
  { id: 168, emoji: '🐟', name: '清蒸鱼' },
  { id: 169, emoji: '🐟', name: '红烧鱼' },
  { id: 170, emoji: '🐟', name: '糖醋鱼' },
  
  // 汤类
  { id: 171, emoji: '🍲', name: '番茄蛋花汤' },
  { id: 172, emoji: '🍲', name: '紫菜蛋花汤' },
  { id: 173, emoji: '🍲', name: '酸辣汤' },
  { id: 174, emoji: '🍲', name: '玉米排骨汤' },
  { id: 175, emoji: '🍲', name: '冬瓜排骨汤' },
  { id: 176, emoji: '🍲', name: '鸡汤' },
  { id: 177, emoji: '🍲', name: '牛肉汤' },
  { id: 178, emoji: '🍲', name: '羊肉汤' },
  { id: 179, emoji: '🍲', name: '佛跳墙' },
  { id: 180, emoji: '🍲', name: '老鸭汤' },
  
  // 东南亚料理
  { id: 181, emoji: '🍛', name: '泰式咖喱' },
  { id: 182, emoji: '🍛', name: '冬阴功汤' },
  { id: 183, emoji: '🍛', name: '泰式炒河粉' },
  { id: 184, emoji: '🍛', name: '菠萝饭' },
  { id: 185, emoji: '🍛', name: '椰浆饭' },
  { id: 186, emoji: '🍛', name: '海南鸡饭' },
  { id: 187, emoji: '🍛', name: '越南河粉' },
  { id: 188, emoji: '🍛', name: '越南春卷' },
  { id: 189, emoji: '🍛', name: '新加坡炒面' },
  { id: 190, emoji: '🍛', name: '肉骨茶' },
  
  // 其他国际美食
  { id: 191, emoji: '🥘', name: '西班牙海鲜饭' },
  { id: 192, emoji: '🥘', name: '土耳其烤肉' },
  { id: 193, emoji: '🥘', name: '希腊烤肉' },
  { id: 194, emoji: '🥘', name: '法式焗蜗牛' },
  { id: 195, emoji: '🥘', name: '法式鹅肝' },
  { id: 196, emoji: '🥘', name: '德国香肠' },
  { id: 197, emoji: '🥘', name: '德国猪肘' },
  { id: 198, emoji: '🥘', name: '俄罗斯红菜汤' },
  { id: 199, emoji: '🥘', name: '巴西烤肉' },
  { id: 200, emoji: '🥘', name: '意式烩饭' },
  
  // 补充更多中餐
  { id: 201, emoji: '🥢', name: '宫保虾球' },
  { id: 202, emoji: '🥢', name: '糖醋里脊' },
  { id: 203, emoji: '🥢', name: '锅包肉' },
  { id: 204, emoji: '🥢', name: '酱爆鸡丁' },
  { id: 205, emoji: '🥢', name: '木须肉' },
  { id: 206, emoji: '🥢', name: '蚂蚁上树' },
  { id: 207, emoji: '🥢', name: '夫妻肺片' },
  { id: 208, emoji: '🥢', name: '毛血旺' },
  { id: 209, emoji: '🥢', name: '水煮肉片' },
  { id: 210, emoji: '🥢', name: '粉蒸肉' },
  { id: 211, emoji: '🥢', name: '狮子头' },
  { id: 212, emoji: '🥢', name: '珍珠丸子' },
  { id: 213, emoji: '🥢', name: '糯米排骨' },
  { id: 214, emoji: '🥢', name: '盐焗鸡' },
  { id: 215, emoji: '🥢', name: '白切鸡' },
  { id: 216, emoji: '🥢', name: '叫花鸡' },
  { id: 217, emoji: '🥢', name: '左宗棠鸡' },
  { id: 218, emoji: '🥢', name: '三杯鸡' },
  { id: 219, emoji: '🥢', name: '啤酒鸭' },
  { id: 220, emoji: '🥢', name: '香酥鸭' }
]

// 食物列表
const foodList = ref([...defaultFoods])

// 转盘相关
const wheelCanvas = ref(null)
const isSpinning = ref(false)
const wheelResult = ref('')
const wheelFoods = ref([]) // 当前转盘显示的食物（从池子中随机抽取）
const wheelFoodCount = ref(10) // 转盘显示的食物数量（可配置）
let currentRotation = 0

// 淘汰模式相关 - 擂台模式
const eliminateFoods = ref([...foodList.value]) // 剩余待挑战的食物池
const eliminateFoodCount = ref(10) // 淘汰模式的食物数量（可配置）
const eliminateInitialCount = ref(0) // 淘汰模式初始食物数量（用于进度条计算）
const currentChampion = ref(null) // 当前擂主
const currentChallenger = ref(null) // 当前挑战者
const battleCount = ref(0) // 已经进行的对决次数

// 表情选择列表
const emojiOptions = [
  '🍜', '🍚', '🍲', '🥟', '🥢', '🍗', '🥓', '🦐', '🦀', '🥘',
  '🍕', '🍔', '🍟', '🌭', '🥙', '🌮', '🌯', '🥪', '🍝', '🥩',
  '🍖', '🍣', '🍱', '🍛', '🍢', '🍥', '🥗', '🥐', '🥖', '🧇',
  '🥞', '🍳', '🧆', '🍿', '🥮', '🍡', '🥠', '🐟', '🦞', '🦆',
  '🐷', '🐑', '🫔', '🥯', '🍤', '🥚', '🧀', '🥝', '🍰', '🍩',
]

// 食物管理
const showFoodManager = ref(false)
const newFood = ref({ emoji: '', name: '' })

// 切换模式
const switchMode = (newMode) => {
  mode.value = newMode
  if (newMode === 'eliminate') {
    resetEliminate()
  } else {
    wheelResult.value = ''
    refreshWheelFoods()
  }
}

// 从食物池中随机抽取指定数量的食物用于转盘
const refreshWheelFoods = () => {
  if (foodList.value.length <= wheelFoodCount.value) {
    wheelFoods.value = [...foodList.value]
  } else {
    // 随机打乱并取前N个
    const shuffled = [...foodList.value].sort(() => Math.random() - 0.5)
    wheelFoods.value = shuffled.slice(0, wheelFoodCount.value)
  }
  
  // 重新绘制转盘
  nextTick(() => {
    currentRotation = 0
    drawWheel(0)
  })
}

// 获取下一个挑战者
const getNextChallenger = () => {
  if (eliminateFoods.value.length === 0) {
    return null
  }
  
  // 从剩余食物中随机选一个
  const randomIndex = Math.floor(Math.random() * eliminateFoods.value.length)
  const challenger = eliminateFoods.value[randomIndex]
  
  // 从池子中移除这个挑战者
  eliminateFoods.value = eliminateFoods.value.filter(f => f.id !== challenger.id)
  
  return challenger
}

// 绘制转盘
const drawWheel = (rotation = 0) => {
  const canvas = wheelCanvas.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  const centerX = canvas.width / 2
  const centerY = canvas.height / 2
  const radius = 200

  ctx.clearRect(0, 0, canvas.width, canvas.height)
  ctx.save()
  ctx.translate(centerX, centerY)
  ctx.rotate(rotation)

  const foods = wheelFoods.value
  if (foods.length === 0) {
    ctx.restore()
    return
  }
  
  const anglePerSlice = (Math.PI * 2) / foods.length

  // 绘制扇形
  foods.forEach((food, index) => {
    const startAngle = anglePerSlice * index
    const endAngle = startAngle + anglePerSlice

    // 交替颜色
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F']
    ctx.fillStyle = colors[index % colors.length]

    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.arc(0, 0, radius, startAngle, endAngle)
    ctx.closePath()
    ctx.fill()

    // 绘制边框
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 3
    ctx.stroke()

    // 绘制文字
    ctx.save()
    ctx.rotate(startAngle + anglePerSlice / 2)
    ctx.textAlign = 'center'
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 24px Arial'
    ctx.fillText(food.emoji, radius * 0.7, 0)
    ctx.font = 'bold 16px Arial'
    ctx.fillText(food.name, radius * 0.7, 25)
    ctx.restore()
  })

  // 绘制中心圆
  ctx.beginPath()
  ctx.arc(0, 0, 30, 0, Math.PI * 2)
  ctx.fillStyle = '#fff'
  ctx.fill()
  ctx.strokeStyle = '#333'
  ctx.lineWidth = 3
  ctx.stroke()

  ctx.restore()
}

// 转动转盘
const spinWheel = () => {
  if (wheelFoods.value.length === 0) {
    ElMessage.warning('请先添加食物')
    return
  }

  isSpinning.value = true
  wheelResult.value = ''

  // 随机旋转角度 (5-8圈)
  const spins = 5 + Math.random() * 3
  const randomAngle = Math.random() * Math.PI * 2
  const totalRotation = spins * Math.PI * 2 + randomAngle

  const duration = 3000
  const startTime = Date.now()
  const startRotation = currentRotation

  const animate = () => {
    const now = Date.now()
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)

    // 缓动函数
    const easeOut = 1 - Math.pow(1 - progress, 3)
    currentRotation = startRotation + totalRotation * easeOut

    drawWheel(currentRotation)

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      // 计算结果
      // 指针在正上方(12点钟方向,即-90度或-π/2位置)
      // 需要计算哪个扇形在指针位置
      const normalizedRotation = ((currentRotation % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2)
      const anglePerSlice = (Math.PI * 2) / wheelFoods.value.length
      
      // 指针位置是-π/2(正上方),转盘顺时针旋转
      // 需要找到哪个扇形的中心线对准指针
      const pointerAngle = Math.PI * 1.5 // 270度,即正上方
      const adjustedAngle = (pointerAngle - normalizedRotation + Math.PI * 2) % (Math.PI * 2)
      const selectedIndex = Math.floor(adjustedAngle / anglePerSlice) % wheelFoods.value.length
      
      wheelResult.value = wheelFoods.value[selectedIndex].name
      isSpinning.value = false
      ElMessage.success(`今晚吃 ${wheelResult.value}！`)
    }
  }

  animate()
}

// 选择食物（擂台模式）
const chooseFood = (chosen) => {
  battleCount.value++
  
  // 选中的成为新擂主
  currentChampion.value = chosen
  
  // 如果还有剩余食物，继续挑战
  if (eliminateFoods.value.length > 0) {
    currentChallenger.value = getNextChallenger()
  } else {
    // 没有挑战者了，当前擂主获胜
    currentChallenger.value = null
    setTimeout(() => {
      ElMessage.success(`经过 ${battleCount.value} 轮对决，最终选择是 ${currentChampion.value.name}！`)
    }, 300)
  }
}

// 重置淘汰模式
const resetEliminate = () => {
  // 从食物池中随机抽取指定数量
  if (foodList.value.length <= eliminateFoodCount.value) {
    eliminateFoods.value = [...foodList.value]
  } else {
    const shuffled = [...foodList.value].sort(() => Math.random() - 0.5)
    eliminateFoods.value = shuffled.slice(0, eliminateFoodCount.value)
  }
  
  // 记录初始数量（包括擂主和挑战者）
  eliminateInitialCount.value = eliminateFoods.value.length
  battleCount.value = 0
  
  if (eliminateFoods.value.length >= 2) {
    // 第一个擂主
    currentChampion.value = getNextChallenger()
    // 第一个挑战者
    currentChallenger.value = getNextChallenger()
  } else {
    currentChampion.value = null
    currentChallenger.value = null
  }
}

// 添加食物
const addFood = () => {
  if (!newFood.value.emoji || !newFood.value.name) {
    ElMessage.warning('请填写完整信息')
    return
  }

  const maxId = foodList.value.reduce((max, food) => Math.max(max, food.id), 0)
  foodList.value.push({
    id: maxId + 1,
    emoji: newFood.value.emoji,
    name: newFood.value.name
  })

  newFood.value = { emoji: '', name: '' }
  ElMessage.success('添加成功')
  
  // 更新转盘和淘汰列表
  nextTick(() => {
    refreshWheelFoods()
    resetEliminate()
  })
}

// 删除食物
const removeFood = (id) => {
  if (foodList.value.length <= 2) {
    ElMessage.warning('至少保留2个食物')
    return
  }

  foodList.value = foodList.value.filter(f => f.id !== id)
  ElMessage.success('删除成功')
  
  nextTick(() => {
    refreshWheelFoods()
    resetEliminate()
  })
}

// 恢复默认食物
const loadPresetFoods = () => {
  foodList.value = [...defaultFoods]
  ElMessage.success('已恢复默认食物')
  
  nextTick(() => {
    refreshWheelFoods()
    resetEliminate()
  })
}
// 清空所有食物
const clearAllFoods = () => {
  foodList.value = []
  ElMessage.success('已清空所有食物')
  
  nextTick(() => {
    refreshWheelFoods()
    resetEliminate()
  })
}

onMounted(() => {
  window.addEventListener('resize', onResize)
  nextTick(() => {
    refreshWheelFoods()
    resetEliminate()
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', onResize)
})
</script>

<style scoped>
.what-to-eat-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Header */
.header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 70px;
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
  font-size: 36px;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
}

.logo-text {
  display: flex;
  flex-direction: column;
}

.logo-title {
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.logo-sub {
  font-size: 12px;
  color: #999;
}

.back-btn {
  border-radius: 8px;
}

/* Main Content */
.main-content {
  padding: 40px 24px;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
}

/* 模式选择 */
.mode-selector {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 40px;
}

.mode-btn {
  padding: 16px 32px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.mode-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.mode-btn.active {
  background: white;
  color: #667eea;
  border-color: white;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.mode-icon {
  font-size: 24px;
}

/* 模式配置 */
.mode-config {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.config-label {
  font-size: 15px;
  font-weight: 600;
  color: #667eea;
}

/* 转盘模式 */
.wheel-mode {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}

.wheel-info {
  text-align: center;
}

.info-text {
  display: inline-block;
  padding: 8px 20px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  font-size: 14px;
  color: #667eea;
  font-weight: 600;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.wheel-container {
  position: relative;
  width: min(500px, calc(100vw - 48px));
  aspect-ratio: 1;
  background: white;
  border-radius: 50%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.wheel-container canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.wheel-pointer {
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 40px;
  color: #FF6B6B;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  z-index: 10;
}

.result-display {
  text-align: center;
  background: white;
  padding: 24px 48px;
  border-radius: 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.result-icon {
  font-size: 48px;
  margin-bottom: 8px;
}

.result-text {
  font-size: 18px;
  color: #666;
  margin-bottom: 8px;
}

.result-food {
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.wheel-controls {
  display: flex;
  gap: 16px;
}

.spin-btn {
  padding: 16px 48px;
  font-size: 18px;
  font-weight: 600;
  border-radius: 12px;
}

/* 淘汰模式 */
.eliminate-mode {
  background: white;
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.eliminate-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  gap: 24px;
}

.progress-info {
  flex: 1;
}

.remaining-count {
  display: block;
  font-size: 18px;
  font-weight: 600;
  color: #667eea;
  margin-bottom: 8px;
}

/* 二选一对决 */
.battle-container {
  padding: 20px 0;
}

.battle-stats {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-bottom: 24px;
}

.battle-stats .stat-item {
  text-align: center;
}

.battle-stats .stat-label {
  display: block;
  font-size: 14px;
  color: #999;
  margin-bottom: 4px;
}

.battle-stats .stat-value {
  display: block;
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.battle-title {
  text-align: center;
  font-size: 24px;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 32px;
}

.battle-cards {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
}

.battle-card {
  flex: 1;
  max-width: 300px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 24px;
  padding: 48px 32px;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.champion-card {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border: 3px solid #FFD700;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
}

.challenger-card {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.card-badge {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(255, 255, 255, 0.95);
  color: #333;
  padding: 4px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 700;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.battle-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0));
  opacity: 0;
  transition: opacity 0.3s;
}

.battle-card:hover {
  transform: translateY(-8px) scale(1.05);
  box-shadow: 0 12px 40px rgba(102, 126, 234, 0.5);
}

.battle-card:hover::before {
  opacity: 1;
}

.battle-card:hover .choose-hint {
  opacity: 1;
  transform: translateY(0);
}

.card-content {
  text-align: center;
  position: relative;
  z-index: 1;
}

.food-emoji-large {
  font-size: 80px;
  margin-bottom: 16px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.food-name-large {
  font-size: 28px;
  font-weight: 700;
  color: white;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.choose-hint {
  position: absolute;
  bottom: 16px;
  left: 0;
  right: 0;
  text-align: center;
  color: white;
  font-size: 14px;
  font-weight: 600;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s;
  z-index: 1;
}

.vs-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.vs-text {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: white;
  color: #667eea;
  font-size: 24px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

/* 最终结果 */
.final-result {
  text-align: center;
  padding: 60px 20px;
}

.final-icon {
  font-size: 80px;
  margin-bottom: 16px;
}

.final-text {
  font-size: 20px;
  color: #999;
  margin-bottom: 8px;
}

.final-subtitle {
  font-size: 28px;
  font-weight: 700;
  color: #667eea;
  margin-bottom: 24px;
}

.final-food {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 32px;
}

.final-emoji {
  font-size: 64px;
}

.final-name {
  font-size: 48px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 18px;
  color: #999;
  margin-bottom: 24px;
}

/* 食物管理 */
.food-manager {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.add-food-form {
  display: flex;
  gap: 12px;
}

.food-list {
  max-height: 400px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.food-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f5f5f5;
  border-radius: 8px;
}

.food-item .food-emoji {
  font-size: 24px;
}

.food-item .food-name {
  flex: 1;
  font-size: 16px;
}

.preset-foods {
  text-align: center;
  padding-top: 12px;
  border-top: 1px solid #eee;
}

.emoji-input :deep(.el-input__inner) {
  cursor: pointer;
  text-align: center;
  font-size: 20px;
}

.emoji-picker-title {
  font-size: 13px;
  color: #999;
  margin-bottom: 8px;
  font-weight: 600;
}

.emoji-picker-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 4px;
}

.emoji-option {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.emoji-option:hover {
  background: #f0f0ff;
  transform: scale(1.2);
}

.emoji-option.selected {
  background: #667eea;
  box-shadow: 0 0 0 2px #667eea33;
}

/* ========== 平板 ========== */
@media (max-width: 768px) {
  .main-content {
    padding: 24px 16px;
  }

  .header-inner {
    padding: 0 16px;
    height: 60px;
  }

  .logo-icon {
    font-size: 28px;
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }

  .logo-title {
    font-size: 17px;
  }

  .mode-selector {
    gap: 10px;
    margin-bottom: 28px;
  }

  .mode-btn {
    padding: 12px 20px;
    font-size: 15px;
    border-radius: 12px;
  }

  .mode-config {
    flex-wrap: wrap;
    gap: 8px;
    padding: 12px;
  }

  .wheel-mode {
    gap: 20px;
  }

  .wheel-pointer {
    font-size: 32px;
    top: -24px;
  }

  .wheel-controls {
    flex-wrap: wrap;
    justify-content: center;
  }

  .spin-btn {
    padding: 12px 32px;
    font-size: 16px;
  }

  .result-display {
    padding: 20px 24px;
  }

  .result-food {
    font-size: 26px;
  }

  .eliminate-mode {
    padding: 20px;
    border-radius: 18px;
  }

  .battle-cards {
    flex-direction: column;
    gap: 16px;
  }

  .battle-card {
    max-width: 100%;
    width: 100%;
    padding: 36px 24px;
  }

  .vs-divider {
    transform: rotate(90deg);
  }

  .vs-text {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }

  .battle-title {
    font-size: 20px;
    margin-bottom: 20px;
  }

  .battle-stats {
    gap: 20px;
    margin-bottom: 16px;
  }

  .battle-stats .stat-value {
    font-size: 26px;
  }

  .food-emoji-large {
    font-size: 64px;
  }

  .food-name-large {
    font-size: 24px;
  }

  .final-icon {
    font-size: 60px;
  }

  .final-subtitle {
    font-size: 22px;
  }

  .final-emoji {
    font-size: 48px;
  }

  .final-name {
    font-size: 36px;
  }

  .final-result {
    padding: 40px 16px;
  }

  .empty-state {
    padding: 40px 16px;
  }

  .empty-icon {
    font-size: 60px;
  }

  .add-food-form {
    flex-wrap: wrap;
  }

  .food-list {
    max-height: 300px;
  }
}

/* ========== 手机 ========== */
@media (max-width: 480px) {
  .header-inner {
    padding: 0 12px;
    height: 54px;
  }

  .logo-icon {
    font-size: 24px;
    width: 36px;
    height: 36px;
  }

  .logo-title {
    font-size: 15px;
  }

  .logo-sub {
    display: none;
  }

  .back-btn {
    font-size: 13px;
    padding: 6px 12px;
  }

  .back-btn .el-icon {
    margin-right: 2px;
  }

  .main-content {
    padding: 16px 10px;
  }

  .mode-selector {
    gap: 8px;
    margin-bottom: 20px;
  }

  .mode-btn {
    padding: 10px 16px;
    font-size: 14px;
    border-width: 2px;
    border-radius: 10px;
    gap: 6px;
  }

  .mode-icon {
    font-size: 20px;
  }

  .mode-config {
    flex-direction: column;
    padding: 10px;
    border-radius: 12px;
    margin-bottom: 14px;
  }

  .config-label {
    font-size: 13px;
  }

  .wheel-mode {
    gap: 16px;
  }

  .info-text {
    font-size: 12px;
    padding: 6px 14px;
  }

  .wheel-pointer {
    font-size: 28px;
    top: -20px;
  }

  .wheel-controls {
    gap: 8px;
    width: 100%;
  }

  .wheel-controls .el-button {
    flex: 1;
    min-width: 0;
    padding: 10px 8px;
    font-size: 13px;
  }

  .spin-btn {
    padding: 10px 8px !important;
    font-size: 14px !important;
  }

  .result-display {
    padding: 16px 20px;
    border-radius: 16px;
    width: 100%;
    box-sizing: border-box;
  }

  .result-icon {
    font-size: 36px;
  }

  .result-text {
    font-size: 15px;
  }

  .result-food {
    font-size: 22px;
  }

  .eliminate-mode {
    padding: 16px 12px;
    border-radius: 16px;
  }

  .eliminate-header {
    margin-bottom: 20px;
    gap: 12px;
  }

  .remaining-count {
    font-size: 15px;
  }

  .battle-stats {
    gap: 16px;
    margin-bottom: 12px;
  }

  .battle-stats .stat-label {
    font-size: 12px;
  }

  .battle-stats .stat-value {
    font-size: 22px;
  }

  .battle-title {
    font-size: 18px;
    margin-bottom: 16px;
  }

  .battle-cards {
    gap: 12px;
  }

  .battle-card {
    padding: 32px 16px;
    border-radius: 18px;
  }

  .card-badge {
    font-size: 12px;
    padding: 3px 12px;
    top: 10px;
  }

  .food-emoji-large {
    font-size: 52px;
    margin-bottom: 10px;
  }

  .food-name-large {
    font-size: 20px;
  }

  .choose-hint {
    font-size: 12px;
    bottom: 10px;
  }

  .vs-text {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }

  .final-result {
    padding: 32px 12px;
  }

  .final-icon {
    font-size: 48px;
  }

  .final-text {
    font-size: 16px;
  }

  .final-subtitle {
    font-size: 20px;
    margin-bottom: 16px;
  }

  .final-food {
    gap: 10px;
    margin-bottom: 24px;
    flex-wrap: wrap;
    justify-content: center;
  }

  .final-emoji {
    font-size: 40px;
  }

  .final-name {
    font-size: 28px;
  }

  .empty-state {
    padding: 32px 12px;
  }

  .empty-icon {
    font-size: 48px;
  }

  .empty-text {
    font-size: 15px;
  }

  .add-food-form {
    gap: 8px;
  }

  .food-item {
    padding: 10px;
    gap: 8px;
  }

  .food-item .food-emoji {
    font-size: 20px;
  }

  .food-item .food-name {
    font-size: 14px;
  }

  .food-list {
    max-height: 240px;
  }

  .emoji-picker-grid {
    grid-template-columns: repeat(7, 1fr);
  }
}
</style>
