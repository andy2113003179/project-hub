<template>
  <div class="poster-page">
    <!-- Header -->
    <header class="header">
      <div class="header-inner">
        <div class="logo" @click="$router.push('/')">
          <div class="logo-icon">📰</div>
          <div class="logo-text">
            <span class="logo-title">报纸海报</span>
            <span class="logo-sub">复古风格海报生成器</span>
          </div>
        </div>
        <el-button class="back-btn" @click="$router.push('/')">
          <el-icon><ArrowLeft /></el-icon>
          返回首页
        </el-button>
      </div>
    </header>

    <!-- Steps bar -->
    <div class="steps-bar">
      <div class="step-item" :class="{ active: step >= 1, done: step > 1 }" @click="step > 1 && goToStep(1)">
        <div class="step-dot">{{ step > 1 ? '✓' : '1' }}</div>
        <div class="step-label">选择模板</div>
      </div>
      <div class="step-line" :class="{ active: step > 1 }"></div>
      <div class="step-item" :class="{ active: step >= 2, done: step > 2 }">
        <div class="step-dot">{{ step > 2 ? '✓' : '2' }}</div>
        <div class="step-label">编辑内容</div>
      </div>
      <div class="step-line" :class="{ active: step > 2 }"></div>
      <div class="step-item" :class="{ active: step >= 3 }">
        <div class="step-dot">3</div>
        <div class="step-label">生成下载</div>
      </div>
    </div>

    <main class="main-wrap">

      <!-- ===== STEP 1 ===== -->
      <div v-if="step === 1" class="step-content">
        <h2 class="step-title">选择海报风格模板</h2>
        <p class="step-sub">共 {{ templates.length }} 套模板 · 不同排版风格 · 上传照片即可生成</p>
        <div class="template-grid">
          <div
            v-for="t in templates"
            :key="t.id"
            class="tpl-card"
            :class="['tpl-' + t.layout, { selected: selectedTemplate?.id === t.id }]"
            @click="selectTemplate(t)"
          >
            <!-- 真实迷你海报预览 -->
            <div class="tpl-poster" :style="{ background: t.colors.bg, fontFamily: t.fontFamily }">
              <!-- 纹理叠层 -->
              <div class="tpl-texture" :class="'tex-' + t.layout"></div>
              <!-- 装饰边框 -->
              <div class="tpl-frame" :style="{ borderColor: t.colors.line + '55' }"></div>

              <!-- bigTop: 上方大图 -->
              <template v-if="t.layout === 'bigTop'">
                <div class="tp-head" :style="{ color: t.colors.text }">{{ t.defaultForm.reportName }}</div>
                <div class="tp-accent" :style="{ background: t.colors.accent }"></div>
                <div class="tp-img tp-img-wide" :style="{ background: t.colors.text + '12', borderColor: t.colors.line + '44' }">
                  <span class="tp-img-icon">🏔️</span>
                </div>
                <div class="tp-headline" :style="{ color: t.colors.text }">{{ t.defaultForm.headline }}</div>
                <div class="tp-body-lines">
                  <div v-for="i in 3" :key="i" :style="{ background: t.colors.text + '18', width: [100,85,70][i-1]+'%' }"></div>
                </div>
              </template>

              <!-- centered: 上下对称 -->
              <template v-else-if="t.layout === 'centered'">
                <div class="tp-head" :style="{ color: t.colors.text }">{{ t.defaultForm.reportName }}</div>
                <div class="tp-accent" :style="{ background: t.colors.accent }"></div>
                <div class="tp-body-lines tp-lines-center">
                  <div v-for="i in 2" :key="i" :style="{ background: t.colors.text + '15', width: [100,80][i-1]+'%' }"></div>
                </div>
                <div class="tp-divider-ornament" :style="{ color: t.colors.accent }">❖</div>
                <div class="tp-headline" :style="{ color: t.colors.text }">{{ t.defaultForm.headline }}</div>
                <div class="tp-img tp-img-center" :style="{ background: t.colors.text + '10', borderColor: t.colors.accent + '55' }">
                  <span class="tp-img-icon">🌊</span>
                </div>
              </template>

              <!-- leftRight: 左图右文 -->
              <template v-else-if="t.layout === 'leftRight'">
                <div class="tp-head tp-head-bold" :style="{ color: t.colors.text }">{{ t.defaultForm.reportName }}</div>
                <div class="tp-accent" :style="{ background: t.colors.accent }"></div>
                <div class="tp-headline" :style="{ color: t.colors.text }">{{ t.defaultForm.headline }}</div>
                <div class="tp-split-row">
                  <div class="tp-img tp-img-tall" :style="{ background: t.colors.text + '10', borderColor: t.colors.line + '44' }">
                    <span class="tp-img-icon">🏙️</span>
                  </div>
                  <div class="tp-split-right">
                    <div v-for="i in 5" :key="i" class="tp-mini-line" :style="{ background: t.colors.text + '15', width: i%2===0?'75%':'100%' }"></div>
                  </div>
                </div>
              </template>

              <!-- fullBleed: 全铺 + 渐变遮罩 -->
              <template v-else-if="t.layout === 'fullBleed'">
                <div class="tp-full-bg" :style="{ background: `linear-gradient(135deg, ${t.colors.accent}33, #33333388)` }">
                  <span class="tp-full-icon">🌄</span>
                </div>
                <div class="tp-full-overlay"></div>
                <div class="tp-full-content">
                  <div class="tp-head" style="color:#fff">{{ t.defaultForm.reportName }}</div>
                  <div class="tp-full-spacer"></div>
                  <div class="tp-headline" style="color:#fff">{{ t.defaultForm.headline }}</div>
                  <div class="tp-accent" :style="{ background: t.colors.accent, width: '40px', margin: '0 auto' }"></div>
                  <div class="tp-body-lines">
                    <div v-for="i in 2" :key="i" style="background:rgba(255,255,255,0.2);width:90%"></div>
                  </div>
                </div>
              </template>

              <!-- darkOverlay: 霓虹 -->
              <template v-else-if="t.layout === 'darkOverlay'">
                <div class="tp-neon-glow" :style="{ background: `radial-gradient(ellipse at 50% 30%, ${t.colors.accent}18, transparent 70%)` }"></div>
                <div class="tp-head tp-neon-head" :style="{ color: t.colors.accent }">{{ t.defaultForm.reportName }}</div>
                <div class="tp-accent" :style="{ background: t.colors.accent, boxShadow: `0 0 8px ${t.colors.accent}88` }"></div>
                <div class="tp-headline" :style="{ color: t.colors.text }">{{ t.defaultForm.headline }}</div>
                <div class="tp-img tp-img-wide tp-neon-img" :style="{ borderColor: t.colors.accent + '55', boxShadow: `0 0 12px ${t.colors.accent}33` }">
                  <span class="tp-img-icon">🌃</span>
                </div>
                <div class="tp-body-lines">
                  <div v-for="i in 2" :key="i" :style="{ background: t.colors.text + '15', width: [100,80][i-1]+'%' }"></div>
                </div>
              </template>

              <!-- warmCard: 美食暖色 -->
              <template v-else-if="t.layout === 'warmCard'">
                <div class="tp-warm-dots">
                  <span v-for="i in 5" :key="i" :style="{ background: t.colors.accent + '30' }"></span>
                </div>
                <div class="tp-head" :style="{ color: t.colors.text }">{{ t.defaultForm.reportName }}</div>
                <div class="tp-accent tp-accent-short" :style="{ background: t.colors.accent }"></div>
                <div class="tp-headline" :style="{ color: t.colors.text }">{{ t.defaultForm.headline }}</div>
                <div class="tp-img tp-img-rounded" :style="{ background: t.colors.text + '08', borderColor: t.colors.accent + '44' }">
                  <span class="tp-img-icon">🍜</span>
                </div>
                <div class="tp-body-lines tp-lines-center">
                  <div v-for="i in 2" :key="i" :style="{ background: t.colors.text + '15', width: [90,70][i-1]+'%' }"></div>
                </div>
              </template>

              <!-- vintage: 竖排标题 -->
              <template v-else-if="t.layout === 'vintage'">
                <div class="tp-head" :style="{ color: t.colors.text }">{{ t.defaultForm.reportName }}</div>
                <div class="tp-accent" :style="{ background: t.colors.accent }"></div>
                <div class="tp-vintage-row">
                  <div class="tp-vintage-chars" :style="{ borderColor: t.colors.accent }">
                    <span v-for="(ch,i) in t.defaultForm.headline.slice(0,4)" :key="i" :style="{ color: t.colors.text }">{{ ch }}</span>
                  </div>
                  <div class="tp-img tp-img-vintage" :style="{ background: t.colors.text + '10', borderColor: t.colors.line + '44' }">
                    <span class="tp-img-icon">🏛️</span>
                  </div>
                </div>
                <div class="tp-body-lines">
                  <div v-for="i in 3" :key="i" :style="{ background: t.colors.text + '15', width: [100,85,65][i-1]+'%' }"></div>
                </div>
              </template>

              <!-- classicNews: 仿真报纸 -->
              <template v-else-if="t.layout === 'classicNews'">
                <div class="tp-cn-date" :style="{ color: t.colors.secondary }">2026年03月09日</div>
                <div class="tp-cn-masthead">
                  <div class="tp-cn-name" :style="{ color: t.colors.text }">{{ t.defaultForm.reportName }}</div>
                  <div class="tp-cn-side">
                    <div class="tp-cn-box" :style="{ borderColor: t.colors.text }">今日<br/>宜</div>
                    <div class="tp-cn-box" :style="{ borderColor: t.colors.text }">诸事<br/>皆宜</div>
                  </div>
                </div>
                <div class="tp-accent" :style="{ background: t.colors.text, height: '3px' }"></div>
                <div class="tp-cn-headline" :style="{ color: t.colors.text }">{{ t.defaultForm.headline.slice(0, 16) }}</div>
                <div class="tp-img tp-img-wide tp-cn-photo" :style="{ background: t.colors.text + '10', borderColor: t.colors.line + '44' }">
                  <span class="tp-img-icon">📰</span>
                </div>
                <div class="tp-cn-cols">
                  <div v-for="col in 3" :key="col" class="tp-cn-col">
                    <div v-for="i in 4" :key="i" class="tp-mini-line" :style="{ background: t.colors.text + '15', width: (60 + Math.random()*40) + '%' }"></div>
                  </div>
                </div>
              </template>

              <!-- 底部标语 -->
              <div class="tp-slogan" :style="{ color: t.colors.accent, borderColor: t.colors.accent + '55' }">{{ t.defaultForm.slogan }}</div>
            </div>

            <div class="tpl-info">
              <div class="tpl-name">{{ t.icon }} {{ t.label }}</div>
              <div class="tpl-desc">{{ t.description }}</div>
            </div>
            <div v-if="selectedTemplate?.id === t.id" class="tpl-check">✓</div>
          </div>
        </div>
        <div class="step-footer">
          <el-button type="primary" size="large" :disabled="!selectedTemplate" @click="goToStep(2)" class="next-btn">
            下一步：编辑内容 →
          </el-button>
        </div>
      </div>

      <!-- ===== STEP 2 ===== -->
      <div v-if="step === 2" class="step-content editor-step">
        <div class="editor-layout">
          <div class="ctrl-panel">
            <div class="panel-block">
              <div class="block-title">📷 上传照片</div>
              <div class="upload-zone" :class="{ 'has-image': photoUrl }" @click="$refs.fileInput.click()">
                <img v-if="photoUrl" :src="photoUrl" class="upload-thumb" />
                <div v-else class="upload-placeholder">
                  <div class="upload-icon">📷</div>
                  <div class="upload-tip">点击上传照片</div>
                  <div class="upload-sub">支持 JPG / PNG · 自动转灰度</div>
                </div>
                <div v-if="photoUrl" class="upload-overlay">更换照片</div>
              </div>
              <input ref="fileInput" type="file" accept="image/*" @change="onFileChange" style="display:none" />
              <div v-if="processing" class="processing-tip">正在处理图片...</div>
              <div v-if="photoUrl" class="photo-options">
                <div class="color-switch">
                  <span class="color-switch-label">图片色彩</span>
                  <div class="color-switch-btns">
                    <button class="cs-btn" :class="{ active: useGrayscale }" @click="toggleGrayscale(true)">
                      <span class="cs-icon">◐</span> 灰度
                    </button>
                    <button class="cs-btn" :class="{ active: !useGrayscale }" @click="toggleGrayscale(false)">
                      <span class="cs-icon">🎨</span> 彩色
                    </button>
                  </div>
                </div>
                <div class="color-switch">
                  <span class="color-switch-label">展示方式</span>
                  <div class="color-switch-btns">
                    <button class="cs-btn" :class="{ active: !useCover }" @click="useCover = false">
                      <span class="cs-icon">⊡</span> 完整
                    </button>
                    <button class="cs-btn" :class="{ active: useCover }" @click="useCover = true">
                      <span class="cs-icon">⊞</span> 填充
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="panel-block">
              <div class="block-title">✏️ 编辑文字</div>
              <div class="form-list">
                <div class="form-row"><label>报纸名称</label><el-input v-model="form.reportName" size="small" /></div>
                <div class="form-row"><label>发行日期</label><el-input v-model="form.date" size="small" /></div>
                <div class="form-row"><label>头版标题</label><el-input v-model="form.headline" size="small" /></div>
                <div class="form-row"><label>新闻正文</label><el-input v-model="form.content" type="textarea" :rows="3" size="small" /></div>
                <div class="form-row"><label>图片说明</label><el-input v-model="form.caption" size="small" /></div>
                <div class="form-row" v-if="selectedTemplate?.layout === 'classicNews'"><label>副标题</label><el-input v-model="form.subHeadline" size="small" /></div>
                <div class="form-row" v-if="selectedTemplate?.layout === 'classicNews'"><label>延伸报道</label><el-input v-model="form.subContent" type="textarea" :rows="3" size="small" /></div>
                <div class="form-row"><label>底部标语</label><el-input v-model="form.slogan" size="small" /></div>
              </div>
            </div>

            <div class="panel-actions">
              <el-button @click="goToStep(1)" size="small">← 重选模板</el-button>
              <el-button type="primary" @click="goToGenerate" :loading="generating" size="small">生成海报 →</el-button>
            </div>
          </div>

          <div class="preview-panel">
            <div class="preview-label">实时预览（{{ selectedTemplate?.label }}）</div>
            <div
              class="preview-scaler"
              :class="{ 'cover-draggable': photoUrl && useCover }"
              @mousedown="startCoverDrag($event, 'mouse')"
              @touchstart.prevent="startCoverDrag($event, 'touch')"
            >
              <div v-if="photoUrl && useCover" class="cover-drag-hint">拖动选择显示区域</div>

              <!-- ========== bigTop: 山岳 — 大幅照片置顶 ========== -->
              <div v-if="selectedTemplate.layout === 'bigTop'" class="newspaper np-bigtop" :style="npStyle">
                <div class="np-texture np-texture-paper"></div>
                <div class="np-border np-border-double" :style="{ borderColor: sc.line }"></div>
                <div class="np-corner np-corner-tl" :style="{ borderColor: sc.accent }"></div>
                <div class="np-corner np-corner-tr" :style="{ borderColor: sc.accent }"></div>
                <div class="np-corner np-corner-bl" :style="{ borderColor: sc.accent }"></div>
                <div class="np-corner np-corner-br" :style="{ borderColor: sc.accent }"></div>
                <div class="np-name" :style="{ color: sc.text, fontFamily: selectedTemplate.fontFamily }">{{ form.reportName }}</div>
                <div class="np-date-row" :style="{ color: sc.secondary }">
                  <span class="np-date-line" :style="{ background: sc.line }"></span>
                  <span>{{ form.date }} · 总第壹佰零贰期</span>
                  <span class="np-date-line" :style="{ background: sc.line }"></span>
                </div>
                <div class="np-bar np-bar-gradient" :style="{ background: `linear-gradient(90deg, ${sc.accent}, ${sc.accent}88, ${sc.accent})` }"></div>
                <div class="np-title" :style="{ color: sc.text }">{{ form.headline }}</div>
                <div class="np-ornament" :style="{ color: sc.accent }">◆ ◇ ◆</div>
                <div class="np-big-photo">
                  <img v-if="photoUrl" :src="photoUrl" :style="imgPreviewStyle" />
                  <div v-else class="np-ph" :style="{ borderColor: sc.line }">📸 点击左侧上传照片</div>
                </div>
                <div class="np-cap" :style="{ color: sc.secondary }">{{ form.caption }}</div>
                <div class="np-divider-fancy" :style="{ color: sc.line }">
                  <span class="np-divider-wing" :style="{ background: sc.line }"></span>
                  <span>✦</span>
                  <span class="np-divider-wing" :style="{ background: sc.line }"></span>
                </div>
                <p class="np-text np-text-cols" :style="{ color: sc.text }">{{ form.content }}</p>
                <div class="np-bot np-bot-fancy" :style="{ borderColor: sc.accent, color: sc.accent }">
                  <span class="np-bot-deco">〔</span>{{ form.slogan }}<span class="np-bot-deco">〕</span>
                </div>
              </div>

              <!-- ========== centered: 碧水 — 居中照片、上下对称 ========== -->
              <div v-else-if="selectedTemplate.layout === 'centered'" class="newspaper np-centered" :style="npStyle">
                <div class="np-texture np-texture-wave"></div>
                <div class="np-border" :style="{ borderColor: sc.line }"></div>
                <div class="np-watermark" :style="{ color: sc.accent + '08' }">水</div>
                <div class="np-name np-name-outlined" :style="{ color: sc.text, fontFamily: selectedTemplate.fontFamily, textShadow: `2px 2px 0 ${sc.accent}22` }">{{ form.reportName }}</div>
                <div class="np-date-row" :style="{ color: sc.secondary }">
                  <span class="np-date-line" :style="{ background: sc.accent }"></span>
                  <span>{{ form.date }} · 总第壹佰零贰期</span>
                  <span class="np-date-line" :style="{ background: sc.accent }"></span>
                </div>
                <div class="np-bar" :style="{ background: sc.accent }"></div>
                <p class="np-text np-text-center" :style="{ color: sc.text }">{{ form.content }}</p>
                <div class="np-ornament np-ornament-water" :style="{ color: sc.accent }">〜 ❖ 〜</div>
                <div class="np-title np-title-boxed" :style="{ color: sc.text, borderColor: sc.accent + '44' }">{{ form.headline }}</div>
                <div class="np-ornament" :style="{ color: sc.accent }">〜 ❖ 〜</div>
                <div class="np-center-photo">
                  <img v-if="photoUrl" :src="photoUrl" :style="imgPreviewStyle" />
                  <div v-else class="np-ph" :style="{ borderColor: sc.accent + '55' }">📸 点击左侧上传照片</div>
                </div>
                <div class="np-cap" :style="{ color: sc.secondary }">{{ form.caption }}</div>
                <div class="np-bot" :style="{ borderColor: sc.accent, color: sc.accent }">{{ form.slogan }}</div>
              </div>

              <!-- ========== leftRight: 都市 — 左图右文杂志风 ========== -->
              <div v-else-if="selectedTemplate.layout === 'leftRight'" class="newspaper np-lr" :style="npStyle">
                <div class="np-texture np-texture-grid"></div>
                <div class="np-stripe-top" :style="{ background: sc.accent }"></div>
                <div class="np-name np-name-modern" :style="{ color: sc.text, fontFamily: selectedTemplate.fontFamily }">
                  {{ form.reportName }}
                  <span class="np-name-badge" :style="{ background: sc.accent, color: '#fff' }">DAILY</span>
                </div>
                <div class="np-date" :style="{ color: sc.secondary }">{{ form.date }} / EST. 2026</div>
                <div class="np-bar" :style="{ background: sc.accent }"></div>
                <div class="np-title np-title-left" :style="{ color: sc.text }">{{ form.headline }}</div>
                <div class="np-line" :style="{ background: sc.line }"></div>
                <div class="np-split">
                  <div class="np-split-photo">
                    <img v-if="photoUrl" :src="photoUrl" :style="imgPreviewStyle" />
                    <div v-else class="np-ph tall" :style="{ borderColor: sc.line }">📸</div>
                    <div class="np-cap" :style="{ color: sc.secondary }">{{ form.caption }}</div>
                  </div>
                  <div class="np-split-divider" :style="{ background: sc.line + '33' }"></div>
                  <div class="np-split-text">
                    <div class="np-drop-cap" :style="{ color: sc.accent }">{{ form.content.charAt(0) }}</div>
                    <p class="np-text" :style="{ color: sc.text }">{{ form.content.slice(1) }}</p>
                  </div>
                </div>
                <div class="np-bot np-bot-lr" :style="{ borderColor: sc.accent, color: sc.accent }">{{ form.slogan }}</div>
              </div>

              <!-- ========== fullBleed: 风景 — 照片铺底 + 渐变遮罩 ========== -->
              <div v-else-if="selectedTemplate.layout === 'fullBleed'" class="newspaper np-full" :style="npStyle">
                <div class="np-full-img">
                  <img v-if="photoUrl" :src="photoUrl" :style="imgPreviewStyle" />
                  <div v-else class="np-ph-full">
                    <div class="np-ph-full-icon">🌄</div>
                    <div>上传照片后铺满全版</div>
                  </div>
                </div>
                <div class="np-full-overlay np-full-overlay-rich"></div>
                <div class="np-full-vignette"></div>
                <div class="np-full-top">
                  <div class="np-name np-name-shadow" style="color:#fff">{{ form.reportName }}</div>
                  <div class="np-date" style="color:#fff9">{{ form.date }} · 特别版</div>
                  <div class="np-bar" :style="{ background: sc.accent }"></div>
                </div>
                <div class="np-full-bottom">
                  <div class="np-full-title-deco" :style="{ borderColor: sc.accent }">
                    <div class="np-title" style="color:#fff; font-size: 22px;">{{ form.headline }}</div>
                  </div>
                  <div class="np-full-accent-row">
                    <span class="np-full-accent-wing" :style="{ background: sc.accent }"></span>
                    <span class="np-full-accent-diamond" :style="{ color: sc.accent }">◆</span>
                    <span class="np-full-accent-wing" :style="{ background: sc.accent }"></span>
                  </div>
                  <div class="np-cap" style="color:#fff8">{{ form.caption }}</div>
                  <p class="np-text" style="color:#fffc">{{ form.content }}</p>
                  <div class="np-bot np-bot-full" :style="{ borderColor: sc.accent, color: sc.accent }">{{ form.slogan }}</div>
                </div>
              </div>

              <!-- ========== darkOverlay: 夜景 — 暗底 + 霓虹 ========== -->
              <div v-else-if="selectedTemplate.layout === 'darkOverlay'" class="newspaper np-dark" :style="npStyle">
                <div class="np-dark-glow" :style="{ boxShadow: `inset 0 0 80px ${sc.accent}15` }"></div>
                <div class="np-dark-stars"></div>
                <div class="np-border np-neon-border" :style="{ borderColor: sc.accent + '55' }"></div>
                <div class="np-neon-corner np-neon-corner-tl" :style="{ background: sc.accent }"></div>
                <div class="np-neon-corner np-neon-corner-tr" :style="{ background: sc.accent }"></div>
                <div class="np-neon-corner np-neon-corner-bl" :style="{ background: sc.accent }"></div>
                <div class="np-neon-corner np-neon-corner-br" :style="{ background: sc.accent }"></div>
                <div class="np-name np-neon-text" :style="{ color: sc.accent, fontFamily: selectedTemplate.fontFamily, textShadow: `0 0 20px ${sc.accent}88, 0 0 40px ${sc.accent}44` }">{{ form.reportName }}</div>
                <div class="np-date" :style="{ color: sc.secondary }">{{ form.date }} · 总第壹佰零贰期</div>
                <div class="np-bar np-neon-bar" :style="{ background: sc.accent, boxShadow: `0 0 12px ${sc.accent}66` }"></div>
                <div class="np-title" :style="{ color: sc.text }">{{ form.headline }}</div>
                <div class="np-dark-photo" :style="{ boxShadow: `0 0 24px ${sc.accent}44, inset 0 0 30px rgba(0,0,0,0.3)` }">
                  <img v-if="photoUrl" :src="photoUrl" :style="imgPreviewStyle" />
                  <div v-else class="np-ph" :style="{ borderColor: sc.accent }">📸 照片</div>
                </div>
                <div class="np-cap" :style="{ color: sc.secondary }">{{ form.caption }}</div>
                <p class="np-text" :style="{ color: sc.text }">{{ form.content }}</p>
                <div class="np-bot np-bot-neon" :style="{ borderColor: sc.accent, color: sc.accent, textShadow: `0 0 8px ${sc.accent}88` }">
                  ✧ {{ form.slogan }} ✧
                </div>
              </div>

              <!-- ========== warmCard: 美食 — 暖色圆角大照片 ========== -->
              <div v-else-if="selectedTemplate.layout === 'warmCard'" class="newspaper np-warm" :style="npStyle">
                <div class="np-texture np-texture-warm"></div>
                <div class="np-border np-border-warm" :style="{ borderColor: sc.line + '44' }"></div>
                <div class="np-warm-ribbon" :style="{ background: sc.accent }">
                  <span>FOOD</span>
                </div>
                <div class="np-warm-dots">
                  <span v-for="i in 7" :key="i" :style="{ background: sc.accent + '22' }"></span>
                </div>
                <div class="np-name np-name-warm" :style="{ color: sc.text, fontFamily: selectedTemplate.fontFamily }">{{ form.reportName }}</div>
                <div class="np-warm-accent-line" :style="{ background: `linear-gradient(90deg, transparent, ${sc.accent}, transparent)` }"></div>
                <div class="np-date" :style="{ color: sc.secondary }">{{ form.date }} · 特别版</div>
                <div class="np-title np-title-warm" :style="{ color: sc.text }">{{ form.headline }}</div>
                <div class="np-warm-photo">
                  <img v-if="photoUrl" :src="photoUrl" :style="imgPreviewStyle" />
                  <div v-else class="np-ph rounded" :style="{ borderColor: sc.line }">📸 点击上传美食照片</div>
                </div>
                <div class="np-warm-photo-shadow"></div>
                <div class="np-cap" :style="{ color: sc.secondary }">{{ form.caption }}</div>
                <div class="np-warm-quote" :style="{ color: sc.accent, borderColor: sc.accent + '44' }">
                  <span class="np-warm-quote-mark">"</span>
                  {{ form.content.slice(0, 40) }}…
                  <span class="np-warm-quote-mark">"</span>
                </div>
                <p class="np-text np-text-center" :style="{ color: sc.text }">{{ form.content }}</p>
                <div class="np-warm-bot-line" :style="{ background: `linear-gradient(90deg, transparent, ${sc.accent}, transparent)` }"></div>
                <div class="np-bot np-bot-no-border np-bot-warm" :style="{ color: sc.accent }">
                  🍽️ {{ form.slogan }}
                </div>
              </div>

              <!-- ========== vintage: 历史 — 竖排标题 + 右图经典报版 ========== -->
              <div v-else-if="selectedTemplate.layout === 'vintage'" class="newspaper np-vintage" :style="npStyle">
                <div class="np-texture np-texture-aged"></div>
                <div class="np-border np-border-double" :style="{ borderColor: sc.line }"></div>
                <div class="np-vintage-header">
                  <div class="np-vintage-dragon" :style="{ color: sc.accent }">龍</div>
                  <div>
                    <div class="np-name" :style="{ color: sc.text, fontFamily: selectedTemplate.fontFamily }">{{ form.reportName }}</div>
                    <div class="np-date" :style="{ color: sc.secondary }">{{ form.date }} · 总第壹佰零贰期</div>
                  </div>
                  <div class="np-vintage-dragon" :style="{ color: sc.accent }">鳳</div>
                </div>
                <div class="np-bar np-bar-vintage" :style="{ background: sc.accent }"></div>
                <div class="np-vintage-rule" :style="{ borderColor: sc.line + '55' }"></div>
                <div class="np-vintage-body">
                  <div class="np-vintage-left" :style="{ borderColor: sc.accent }">
                    <span v-for="(ch, i) in form.headline.slice(0,8)" :key="i" class="np-vchar" :style="{ color: sc.text }">{{ ch }}</span>
                  </div>
                  <div class="np-vintage-right">
                    <div class="np-vintage-photo">
                      <img v-if="photoUrl" :src="photoUrl" :style="imgPreviewStyle" />
                      <div v-else class="np-ph tall" :style="{ borderColor: sc.line }">📸 古迹照片</div>
                    </div>
                    <div class="np-cap" :style="{ color: sc.secondary }">{{ form.caption }}</div>
                  </div>
                </div>
                <div class="np-divider-fancy" :style="{ color: sc.line }">
                  <span class="np-divider-wing" :style="{ background: sc.line }"></span>
                  <span>❋</span>
                  <span class="np-divider-wing" :style="{ background: sc.line }"></span>
                </div>
                <p class="np-text np-text-cols" :style="{ color: sc.text }">{{ form.content }}</p>
                <div class="np-bot np-bot-vintage" :style="{ borderColor: sc.accent, color: sc.accent }">
                  〖 {{ form.slogan }} 〗
                </div>
              </div>

              <!-- ========== classicNews: 经典头条 — 仿真报纸头版 ========== -->
              <div v-else-if="selectedTemplate.layout === 'classicNews'" class="newspaper np-classic" :style="npStyle">
                <div class="np-texture np-texture-paper"></div>

                <!-- 日期行 -->
                <div class="cn-dateline">{{ form.date }}</div>

                <!-- 报头区域 -->
                <div class="cn-masthead-area">
                  <div class="cn-masthead-left">
                    <div class="cn-masthead-name" :style="{ fontFamily: selectedTemplate.fontFamily }">{{ form.reportName }}</div>
                    <div class="cn-masthead-sub">
                      <span class="cn-pinyin">{{ form.reportName.split('').map(c => c).join(' ') }}</span>
                      <span class="cn-issue">{{ new Date().getFullYear() }} 创刊号</span>
                      <span class="cn-publisher">头条新闻社</span>
                    </div>
                  </div>
                  <div class="cn-masthead-right">
                    <div class="cn-infobox">
                      <div class="cn-infobox-label">今日宜</div>
                      <div class="cn-infobox-value">诸事皆宜<br/>百无禁忌</div>
                    </div>
                    <div class="cn-infobox">
                      <div class="cn-infobox-label">今日天气</div>
                      <div class="cn-infobox-value">晴空<br/>万里</div>
                    </div>
                  </div>
                </div>

                <!-- 粗黑分隔线 -->
                <div class="cn-thick-rule"></div>

                <!-- 头条标题区 -->
                <div class="cn-headline-area">
                  <div class="cn-headline-left">
                    <div class="cn-headline" :style="{ fontFamily: selectedTemplate.fontFamily }">{{ form.headline }}</div>
                  </div>
                  <div class="cn-headline-right">
                    <p class="cn-intro-text">{{ form.content }}</p>
                  </div>
                </div>

                <!-- 主照片 -->
                <div class="cn-main-photo">
                  <img v-if="photoUrl" :src="photoUrl" :style="imgPreviewStyle" />
                  <div v-else class="np-ph cn-ph">📸 上传你的照片（这里是可替换的区域）</div>
                </div>
                <div class="np-cap" :style="{ color: sc.secondary }">{{ form.caption }}</div>

                <!-- 分隔线 -->
                <div class="cn-thin-rule"></div>

                <!-- 多栏文章区 -->
                <div class="cn-articles">
                  <div class="cn-article-col cn-col-1">
                    <div class="cn-col-title" :style="{ fontFamily: selectedTemplate.fontFamily }">{{ form.subHeadline || '延伸阅读' }}</div>
                    <p class="cn-col-text">{{ form.subContent || form.content }}</p>
                  </div>
                  <div class="cn-col-divider"></div>
                  <div class="cn-article-col cn-col-2">
                    <div class="cn-col-title" :style="{ fontFamily: selectedTemplate.fontFamily }">本报特别报道</div>
                    <p class="cn-col-text">{{ form.content }}{{ form.subContent ? form.subContent.slice(0, 60) : '' }}</p>
                  </div>
                  <div class="cn-col-divider"></div>
                  <div class="cn-article-col cn-col-3">
                    <div class="cn-col-title" :style="{ fontFamily: selectedTemplate.fontFamily }">编者按</div>
                    <p class="cn-col-text">{{ form.subContent || form.content }}</p>
                  </div>
                </div>

                <!-- 底部 -->
                <div class="cn-footer-rule"></div>
                <div class="cn-footer">
                  <span class="cn-footer-text">{{ form.slogan }}</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <!-- ===== STEP 3 ===== -->
      <div v-show="step === 3" class="step-content result-step">
        <h2 class="step-title" v-if="!generating">您的海报已生成 🎉</h2>
        <h2 class="step-title" v-else>海报生成中...</h2>
        <div class="canvas-wrap">
          <canvas ref="posterCanvas" class="poster-canvas"></canvas>
        </div>
        <p class="save-tip" v-if="!generating">
          <span v-if="isMobile">📱 长按图片可保存到相册</span>
          <span v-else>🖥️ 点击下方按钮保存到本地</span>
        </p>
        <div class="result-actions" v-if="!generating">
          <el-button @click="goToStep(2)">← 返回编辑</el-button>
          <el-button type="primary" size="large" @click="downloadPoster">⬇ 保存海报</el-button>
          <el-button @click="regenerate" :loading="generating">🔄 重新生成</el-button>
        </div>
      </div>

    </main>
    <canvas ref="processCanvas" style="position:fixed;top:-9999px;left:-9999px;pointer-events:none;"></canvas>
  </div>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from 'vue'
import { ArrowLeft } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const templates = [
  {
    id: 1, label: '山岳雄风', icon: '🏔️', layout: 'bigTop',
    description: '大幅照片置顶，气势磅礴',
    fontFamily: "'Georgia', 'SimSun', serif",
    colors: { bg: '#f4f1e8', text: '#2c1810', accent: '#4a7c59', line: '#2c1810', secondary: '#6b6150' },
    defaultForm: { reportName: '山岳晨报', headline: '千山万壑入画来', slogan: '巍峨群山 · 壮志凌云', content: '山不在高，有仙则名。群峰叠翠之间，雾霭流岚缓缓升起，如一幅天然的水墨画卷在眼前徐徐展开。登高远眺，万里河山尽收眼底。' },
  },
  {
    id: 2, label: '碧水长流', icon: '🌊', layout: 'centered',
    description: '照片居中，上下对称留白',
    fontFamily: "'Georgia', 'KaiTi', serif",
    colors: { bg: '#eef5f0', text: '#1a3040', accent: '#2980b9', line: '#1a3040', secondary: '#5a7a8a' },
    defaultForm: { reportName: '碧水周刊', headline: '一湖春水映长天', slogan: '上善若水 · 润物无声', content: '水光潋滟晴方好，山色空蒙雨亦奇。清澈的湖面如一面巨大的明镜，映照着蓝天白云与远山的倒影，微风拂过泛起层层涟漪。' },
  },
  {
    id: 3, label: '都市脉搏', icon: '🏙️', layout: 'leftRight',
    description: '左图右文，现代杂志风',
    fontFamily: "'Arial', 'SimHei', sans-serif",
    colors: { bg: '#ffffff', text: '#1a1a1a', accent: '#e63312', line: '#1a1a1a', secondary: '#666666' },
    defaultForm: { reportName: '都市快讯', headline: '城市天际线刷新高度', slogan: 'URBAN PULSE · 都市脉搏', content: '钢铁丛林中，霓虹闪烁，车水马龙川流不息。每一座摩天大楼都在诉说着一个关于速度与梦想的故事，都市的脉搏从未停歇。' },
  },
  {
    id: 4, label: '田园风光', icon: '🌄', layout: 'fullBleed',
    description: '全幅照片铺底，毛玻璃文字',
    fontFamily: "'Georgia', 'SimSun', serif",
    colors: { bg: '#f5f0e0', text: '#ffffff', accent: '#e8c97c', line: '#ffffff', secondary: '#dddddd' },
    defaultForm: { reportName: '风光画报', headline: '诗与远方不过一步之遥', slogan: '此心安处是吾乡', content: '广袤的田野上，金色的麦浪在微风中翻涌。远处青山如黛，近处溪水潺潺，白鹭翩跹起舞，一切都是自然最本真的模样。' },
  },
  {
    id: 5, label: '霓虹夜色', icon: '🌃', layout: 'darkOverlay',
    description: '暗黑风，霓虹强调色',
    fontFamily: "'Georgia', 'SimHei', serif",
    colors: { bg: '#0d0d1a', text: '#e8e8e8', accent: '#ff6ec7', line: '#ff6ec7', secondary: '#8888aa' },
    defaultForm: { reportName: '夜色晚报', headline: '当城市沉入夜幕之后', slogan: '夜色阑珊 · 万家灯火', content: '暮色四合，华灯初上。城市在夜幕下展现出截然不同的另一面——霓虹闪烁间，每一扇亮着灯的窗户背后都是一个温暖的故事。' },
  },
  {
    id: 6, label: '美食探店', icon: '🍜', layout: 'warmCard',
    description: '暖色调，圆角大照片',
    fontFamily: "'Georgia', 'KaiTi', serif",
    colors: { bg: '#fdf5e6', text: '#3d2b1f', accent: '#d2691e', line: '#8b4513', secondary: '#8b7355' },
    defaultForm: { reportName: '味觉日报', headline: '巷子深处的百年老味道', slogan: '人间烟火气 · 最抚凡人心', content: '推开那扇斑驳的木门，浓郁的香气扑面而来。老灶台上的铁锅咕嘟作响，传承三代的秘制配方让每一口都是时光的味道。' },
  },
  {
    id: 7, label: '历史古迹', icon: '🏛️', layout: 'vintage',
    description: '竖排标题，经典复古报版',
    fontFamily: "'Georgia', 'SimSun', serif",
    colors: { bg: '#f0e8d0', text: '#1a1209', accent: '#8b0000', line: '#1a1209', secondary: '#5a4a32' },
    defaultForm: { reportName: '古迹览胜', headline: '千年石刻见证沧桑岁月', slogan: '鉴古知今 · 以史为镜', content: '斑驳的城墙上，每一块砖石都沉淀着千年的风霜。残碑断壁间依稀可见当年的繁华，那些被时光打磨过的遗迹仿佛在无声地诉说着历史的兴衰。' },
  },
  {
    id: 8, label: '经典头条', icon: '📰', layout: 'classicNews',
    description: '仿真报纸头版，多栏排版',
    fontFamily: "'SimSun', 'Georgia', serif",
    colors: { bg: '#f5f2ea', text: '#1a1a1a', accent: '#000000', line: '#1a1a1a', secondary: '#444444' },
    defaultForm: {
      reportName: '好人有好报',
      headline: '你可能不认识我，但你一定看过我上过的报纸！',
      slogan: 'THE MOST BEAUTIFUL NEWSPAPER IN THE WORLD',
      content: '近期该游客在北京首钢园花小钱装了个大杯上了首钢园最知名的报纸，成了全村人的骄傲。据悉这位游客已经连续三年荣登本报头版，每次出现都会引起广泛关注与热议。',
      subHeadline: '从平凡生活到报纸头条的传奇之路',
      subContent: '从最初的默默无闻到如今的家喻户晓，这段传奇经历让人不禁感叹：人生处处有精彩，平凡之中见伟大。本报记者深入一线，走访了这位传奇人物的家乡、工作地和生活圈，力图还原一个真实而立体的人物形象。在为期三个月的采访中，我们发现了许多鲜为人知的故事——那些关于坚持、关于梦想、关于不放弃的动人篇章。正如受访者所言："每个人都有可能成为头条，关键在于你是否有勇气迈出第一步。"这番话语朴实无华，却蕴含着深刻的人生哲理。',
    },
  },
]

const step = ref(1)
const selectedTemplate = ref(null)
const photoUrl = ref('')
const photoColorUrl = ref('')
const photoGrayUrl = ref('')
const useGrayscale = ref(true)
const useCover = ref(false)
const coverPositionX = ref(50)
const coverPositionY = ref(50)
const processing = ref(false)
const generating = ref(false)
const isMobile = computed(() => window.innerWidth < 768)

const fileInput = ref(null)
const processCanvas = ref(null)
const posterCanvas = ref(null)

const todayStr = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })

const sc = computed(() => selectedTemplate.value?.colors || {})
const npStyle = computed(() => ({ background: sc.value.bg || '#f4f1e8' }))
const imgFilterStyle = computed(() => useGrayscale.value ? 'grayscale(100%) contrast(1.1)' : 'none')
const imgFitStyle = computed(() => useCover.value ? 'cover' : 'contain')
const imgObjectPosition = computed(() => `${coverPositionX.value}% ${coverPositionY.value}%`)
const imgPreviewStyle = computed(() => ({ objectFit: imgFitStyle.value, objectPosition: imgObjectPosition.value }))

const form = reactive({
  reportName: '', date: todayStr, headline: '', content: '', caption: '▲ 图片说明文字', slogan: '',
  subHeadline: '', subContent: ''
})

const selectTemplate = (t) => {
  selectedTemplate.value = t
  Object.assign(form, { subHeadline: '', subContent: '', ...t.defaultForm, date: todayStr, caption: '▲ 图片说明文字' })
}

const goToStep = (n) => {
  if (n === 2 && !selectedTemplate.value) { ElMessage.warning('请先选择一个模板'); return }
  step.value = n
}

const goToGenerate = async () => {
  generating.value = true
  step.value = 3
  await nextTick()
  await nextTick()
  await drawPosterCanvas()
  generating.value = false
}

const regenerate = async () => {
  generating.value = true
  await nextTick()
  await drawPosterCanvas()
  generating.value = false
}

const onFileChange = async (e) => {
  const file = e.target.files?.[0]
  if (!file) return
  processing.value = true
  try {
    const { color, gray } = await processImage(file)
    photoColorUrl.value = color
    photoGrayUrl.value = gray
    photoUrl.value = useGrayscale.value ? gray : color
    coverPositionX.value = 50
    coverPositionY.value = 50
  } catch { ElMessage.error('图片处理失败') }
  finally { processing.value = false; if (fileInput.value) fileInput.value.value = '' }
}

const toggleGrayscale = (val) => {
  useGrayscale.value = val
  if (photoColorUrl.value) {
    photoUrl.value = val ? photoGrayUrl.value : photoColorUrl.value
  }
}

const SENSITIVITY = 0.35
let coverDragStart = null
const onCoverMove = (e) => {
  if (!coverDragStart) return
  if (e.cancelable && e.touches) e.preventDefault()
  const clientX = e.clientX ?? (e.touches && e.touches[0]?.clientX)
  const clientY = e.clientY ?? (e.touches && e.touches[0]?.clientY)
  if (clientX == null || clientY == null) return
  const dx = (clientX - coverDragStart.x) * SENSITIVITY
  const dy = (clientY - coverDragStart.y) * SENSITIVITY
  coverDragStart.x = clientX
  coverDragStart.y = clientY
  coverPositionX.value = Math.max(0, Math.min(100, coverDragStart.posX - dx))
  coverPositionY.value = Math.max(0, Math.min(100, coverDragStart.posY - dy))
  coverDragStart.posX = coverPositionX.value
  coverDragStart.posY = coverPositionY.value
}
const onCoverEnd = () => {
  coverDragStart = null
  document.removeEventListener('mousemove', onCoverMove)
  document.removeEventListener('mouseup', onCoverEnd)
  document.removeEventListener('touchmove', onCoverMove, { passive: false })
  document.removeEventListener('touchend', onCoverEnd)
}
const startCoverDrag = (e, type) => {
  if (!photoUrl.value || !useCover.value) return
  const clientX = type === 'touch' ? e.touches[0].clientX : e.clientX
  const clientY = type === 'touch' ? e.touches[0].clientY : e.clientY
  coverDragStart = { x: clientX, y: clientY, posX: coverPositionX.value, posY: coverPositionY.value }
  document.addEventListener('mousemove', onCoverMove)
  document.addEventListener('mouseup', onCoverEnd)
  document.addEventListener('touchmove', onCoverMove, { passive: false })
  document.addEventListener('touchend', onCoverEnd)
}

const processImage = (file) => new Promise((resolve, reject) => {
  const img = new Image()
  const url = URL.createObjectURL(file)
  img.onload = () => {
    const canvas = processCanvas.value
    const MAX = 1200
    let w = img.width, h = img.height
    if (w > MAX || h > MAX) { if (w > h) { h = Math.round(h * MAX / w); w = MAX } else { w = Math.round(w * MAX / h); h = MAX } }
    canvas.width = w; canvas.height = h
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, w, h)
    const color = canvas.toDataURL('image/jpeg', 0.9)
    const imageData = ctx.getImageData(0, 0, w, h)
    const d = imageData.data
    for (let i = 0; i < d.length; i += 4) { const g = Math.round(d[i] * 0.299 + d[i+1] * 0.587 + d[i+2] * 0.114); d[i] = d[i+1] = d[i+2] = g }
    ctx.putImageData(imageData, 0, 0)
    const gray = canvas.toDataURL('image/jpeg', 0.9)
    URL.revokeObjectURL(url)
    resolve({ color, gray })
  }
  img.onerror = reject; img.src = url
})

const loadImg = (src) => new Promise((res) => { const img = new Image(); img.onload = () => res(img); img.onerror = () => res(null); img.src = src })

const drawContainImage = (ctx, img, x, y, w, h, bgColor) => {
  if (!img) return
  if (bgColor) { ctx.fillStyle = bgColor; ctx.fillRect(x, y, w, h) }
  const ar = img.width / img.height, tar = w / h
  let dw, dh, dx, dy
  if (ar > tar) { dw = w; dh = w / ar; dx = x; dy = y + (h - dh) / 2 }
  else { dh = h; dw = h * ar; dx = x + (w - dw) / 2; dy = y }
  ctx.drawImage(img, 0, 0, img.width, img.height, dx, dy, dw, dh)
}

const drawCoverImage = (ctx, img, x, y, w, h, posX = 50, posY = 50) => {
  if (!img) return
  const ar = img.width / img.height, tar = w / h
  const s = Math.max(w / img.width, h / img.height)
  const sw = w / s, sh = h / s
  let sx = (img.width * posX / 100) - sw / 2
  let sy = (img.height * posY / 100) - sh / 2
  sx = Math.max(0, Math.min(img.width - sw, sx))
  sy = Math.max(0, Math.min(img.height - sh, sy))
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h)
}

const drawImage = (ctx, img, x, y, w, h, bgColor) => {
  if (useCover.value) drawCoverImage(ctx, img, x, y, w, h, coverPositionX.value, coverPositionY.value)
  else drawContainImage(ctx, img, x, y, w, h, bgColor)
}

const wrapText = (ctx, text, x, y, maxW, lh) => {
  let line = '', cy = y
  for (const ch of text) { const tl = line + ch; if (ctx.measureText(tl).width > maxW && line) { ctx.fillText(line, x, cy); line = ch; cy += lh } else { line = tl } }
  if (line) ctx.fillText(line, x, cy)
  return cy
}

const wrapTextCenter = (ctx, text, cx, y, maxW, lh) => {
  let line = '', lines = []
  for (const ch of text) { const tl = line + ch; if (ctx.measureText(tl).width > maxW && line) { lines.push(line); line = ch } else { line = tl } }
  if (line) lines.push(line)
  lines.forEach((l, i) => ctx.fillText(l, cx, y + i * lh))
  return y + (lines.length - 1) * lh
}

const drawTexture = (ctx, W, H, P, color) => {
  ctx.strokeStyle = color + '08'; ctx.lineWidth = 0.5
  for (let x = P; x < W - P; x += 18) { ctx.beginPath(); ctx.moveTo(x, P); ctx.lineTo(x, H - P); ctx.stroke() }
  for (let y = P; y < H - P; y += 18) { ctx.beginPath(); ctx.moveTo(P, y); ctx.lineTo(W - P, y); ctx.stroke() }
}

const drawDoubleBorder = (ctx, W, H, P, color) => {
  ctx.strokeStyle = color; ctx.lineWidth = 3; ctx.strokeRect(P - 12, P - 12, W - 2 * (P - 12), H - 2 * (P - 12))
  ctx.lineWidth = 1; ctx.strokeRect(P - 5, P - 5, W - 2 * (P - 5), H - 2 * (P - 5))
}

const drawHeader = (ctx, W, P, c, t, form) => {
  ctx.fillStyle = c.text; ctx.textAlign = 'center'; ctx.font = `bold 48px ${t.fontFamily}`
  ctx.fillText(form.reportName, W / 2, P + 58)
  ctx.fillStyle = c.line + 'aa'; ctx.fillRect(P, P + 68, W - 2 * P, 1)
  ctx.font = '13px Georgia, serif'; ctx.fillStyle = c.secondary
  ctx.textAlign = 'left'; ctx.fillText(form.date, P, P + 88)
  ctx.textAlign = 'center'; ctx.fillText('总第壹佰零贰期 · 特别版', W / 2, P + 88)
  ctx.textAlign = 'right'; ctx.fillText('定价：壹圆整', W - P, P + 88)
  ctx.fillStyle = c.accent; ctx.fillRect(P, P + 98, W - 2 * P, 4)
  return P + 112
}

const drawPosterCanvas = async () => {
  const canvas = posterCanvas.value
  if (!canvas) return
  const W = 800, H = 1120, P = 45
  canvas.width = W; canvas.height = H
  const ctx = canvas.getContext('2d')
  const t = selectedTemplate.value
  const c = t.colors
  const img = photoUrl.value ? await loadImg(photoUrl.value) : null

  ctx.fillStyle = c.bg; ctx.fillRect(0, 0, W, H)

  if (t.layout === 'bigTop') {
    drawTexture(ctx, W, H, P, c.text)
    drawDoubleBorder(ctx, W, H, P, c.line)
    const afterH = drawHeader(ctx, W, P, c, t, form)
    // 大标题
    ctx.fillStyle = c.text; ctx.textAlign = 'center'; ctx.font = `bold 32px ${t.fontFamily}`
    const headEnd = wrapTextCenter(ctx, form.headline, W / 2, afterH + 28, W - 2 * P - 20, 40)
    ctx.fillStyle = c.line + '55'; ctx.fillRect(P, headEnd + 14, W - 2 * P, 1)
    // 大幅照片
    const pY = headEnd + 26, pH = 420
    if (img) { drawImage(ctx, img, P, pY, W - 2 * P, pH, c.bg) }
    else { ctx.fillStyle = c.text + '12'; ctx.fillRect(P, pY, W - 2 * P, pH) }
    ctx.strokeStyle = c.line; ctx.lineWidth = 2; ctx.strokeRect(P, pY, W - 2 * P, pH)
    ctx.fillStyle = c.secondary; ctx.font = 'italic 13px Georgia, serif'; ctx.textAlign = 'center'
    ctx.fillText(form.caption, W / 2, pY + pH + 20)
    ctx.fillStyle = c.text; ctx.font = `15px ${t.fontFamily}`; ctx.textAlign = 'left'
    wrapText(ctx, form.content, P, pY + pH + 44, W - 2 * P, 24)
    const fY = H - P - 32
    ctx.fillStyle = c.accent; ctx.fillRect(P, fY - 14, W - 2 * P, 3)
    ctx.fillStyle = c.accent; ctx.font = `bold 16px ${t.fontFamily}`; ctx.textAlign = 'center'
    ctx.fillText(form.slogan, W / 2, fY + 8)
  }

  else if (t.layout === 'centered') {
    drawTexture(ctx, W, H, P, c.text)
    drawDoubleBorder(ctx, W, H, P, c.line)
    const afterH = drawHeader(ctx, W, P, c, t, form)
    // 正文在上
    ctx.fillStyle = c.text; ctx.font = `15px ${t.fontFamily}`; ctx.textAlign = 'left'
    const textEnd = wrapText(ctx, form.content, P, afterH + 24, W - 2 * P, 24)
    ctx.fillStyle = c.line + '44'; ctx.fillRect(P, textEnd + 16, W - 2 * P, 1)
    // 标题
    ctx.fillStyle = c.text; ctx.textAlign = 'center'; ctx.font = `bold 30px ${t.fontFamily}`
    const hEnd = wrapTextCenter(ctx, form.headline, W / 2, textEnd + 50, W - 2 * P - 20, 38)
    ctx.fillStyle = c.line + '44'; ctx.fillRect(P, hEnd + 14, W - 2 * P, 1)
    // 居中照片
    const pW = 520, pH = 360, pX = (W - pW) / 2, pY = hEnd + 28
    if (img) { drawImage(ctx, img, pX, pY, pW, pH, c.bg) }
    else { ctx.fillStyle = c.text + '12'; ctx.fillRect(pX, pY, pW, pH) }
    ctx.strokeStyle = c.line; ctx.lineWidth = 2; ctx.strokeRect(pX, pY, pW, pH)
    ctx.fillStyle = c.secondary; ctx.font = 'italic 13px Georgia, serif'; ctx.textAlign = 'center'
    ctx.fillText(form.caption, W / 2, pY + pH + 22)
    // 底栏
    const fY = H - P - 32
    ctx.fillStyle = c.accent; ctx.fillRect(P, fY - 14, W - 2 * P, 3)
    ctx.fillStyle = c.accent; ctx.font = `bold 16px ${t.fontFamily}`; ctx.textAlign = 'center'
    ctx.fillText(form.slogan, W / 2, fY + 8)
  }

  else if (t.layout === 'leftRight') {
    drawDoubleBorder(ctx, W, H, P, c.line)
    const afterH = drawHeader(ctx, W, P, c, t, form)
    // 标题横跨
    ctx.fillStyle = c.text; ctx.textAlign = 'center'; ctx.font = `bold 30px ${t.fontFamily}`
    const hEnd = wrapTextCenter(ctx, form.headline, W / 2, afterH + 28, W - 2 * P - 20, 38)
    ctx.fillStyle = c.line + '55'; ctx.fillRect(P, hEnd + 14, W - 2 * P, 1)
    // 左图
    const pY = hEnd + 28, photoW = 340, photoH = 480
    if (img) { drawImage(ctx, img, P, pY, photoW, photoH, c.bg) }
    else { ctx.fillStyle = c.text + '12'; ctx.fillRect(P, pY, photoW, photoH) }
    ctx.strokeStyle = c.line; ctx.lineWidth = 2; ctx.strokeRect(P, pY, photoW, photoH)
    ctx.fillStyle = c.secondary; ctx.font = 'italic 12px Georgia, serif'; ctx.textAlign = 'center'
    ctx.fillText(form.caption, P + photoW / 2, pY + photoH + 18)
    // 竖分割线
    const divX = P + photoW + 20
    ctx.strokeStyle = c.line + '44'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(divX, pY); ctx.lineTo(divX, pY + photoH); ctx.stroke()
    // 右文
    const txX = divX + 16, txW = W - P - txX
    ctx.fillStyle = c.text; ctx.font = `15px ${t.fontFamily}`; ctx.textAlign = 'left'
    wrapText(ctx, form.content, txX, pY + 20, txW, 24)
    // 底栏
    const fY = H - P - 32
    ctx.fillStyle = c.accent; ctx.fillRect(P, fY - 14, W - 2 * P, 3)
    ctx.fillStyle = c.accent; ctx.font = `bold 16px ${t.fontFamily}`; ctx.textAlign = 'center'
    ctx.fillText(form.slogan, W / 2, fY + 8)
  }

  else if (t.layout === 'fullBleed') {
    // 全幅照片铺底
    if (img) { drawImage(ctx, img, 0, 0, W, H, '#222') }
    else { ctx.fillStyle = '#555'; ctx.fillRect(0, 0, W, H) }
    // 底部遮罩
    const grad = ctx.createLinearGradient(0, H * 0.35, 0, H)
    grad.addColorStop(0, 'rgba(0,0,0,0)'); grad.addColorStop(0.5, 'rgba(0,0,0,0.55)'); grad.addColorStop(1, 'rgba(0,0,0,0.88)')
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H)
    // 顶部报头
    ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.9; ctx.textAlign = 'center'; ctx.font = `bold 38px ${t.fontFamily}`
    ctx.fillText(form.reportName, W / 2, 58); ctx.globalAlpha = 1
    ctx.fillStyle = '#ffffff88'; ctx.font = '13px Georgia, serif'
    ctx.fillText(form.date + '  ·  总第壹佰零贰期  ·  特别版', W / 2, 84)
    ctx.fillStyle = c.accent; ctx.fillRect(P, 96, W - 2 * P, 3)
    // 底部文字区
    const bY = H - 330
    ctx.fillStyle = '#ffffff'; ctx.textAlign = 'center'; ctx.font = `bold 34px ${t.fontFamily}`
    const hEnd = wrapTextCenter(ctx, form.headline, W / 2, bY, W - 80, 44)
    ctx.fillStyle = c.accent; ctx.fillRect(W / 2 - 30, hEnd + 16, 60, 3)
    ctx.fillStyle = '#ffffffcc'; ctx.font = `15px ${t.fontFamily}`; ctx.textAlign = 'left'
    wrapText(ctx, form.content, 60, hEnd + 40, W - 120, 24)
    ctx.fillStyle = 'italic 12px Georgia, serif'; ctx.fillStyle = '#ffffff88'; ctx.font = 'italic 12px Georgia, serif'; ctx.textAlign = 'center'
    ctx.fillText(form.caption, W / 2, hEnd + 30)
    // 底栏
    ctx.fillStyle = c.accent; ctx.font = `bold 15px ${t.fontFamily}`; ctx.textAlign = 'center'
    ctx.fillText(form.slogan, W / 2, H - 30)
  }

  else if (t.layout === 'darkOverlay') {
    // 暗底 + 霓虹
    ctx.fillStyle = c.bg; ctx.fillRect(0, 0, W, H)
    // 微光纹理
    for (let i = 0; i < 200; i++) { ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.02})`; ctx.fillRect(Math.random() * W, Math.random() * H, 1, 1) }
    // 双线框（霓虹色）
    ctx.strokeStyle = c.accent + '66'; ctx.lineWidth = 2; ctx.strokeRect(P - 8, P - 8, W - 2 * (P - 8), H - 2 * (P - 8))
    ctx.strokeStyle = c.accent + '33'; ctx.lineWidth = 1; ctx.strokeRect(P - 2, P - 2, W - 2 * (P - 2), H - 2 * (P - 2))
    // 报头
    ctx.fillStyle = c.accent; ctx.textAlign = 'center'; ctx.font = `bold 42px ${t.fontFamily}`
    ctx.shadowColor = c.accent; ctx.shadowBlur = 20; ctx.fillText(form.reportName, W / 2, P + 55); ctx.shadowBlur = 0
    ctx.fillStyle = c.secondary; ctx.font = '13px Georgia, serif'
    ctx.fillText(form.date + '  ·  总第壹佰零贰期', W / 2, P + 82)
    ctx.fillStyle = c.accent; ctx.fillRect(P, P + 94, W - 2 * P, 2)
    // 标题
    ctx.fillStyle = c.text; ctx.font = `bold 28px ${t.fontFamily}`; ctx.textAlign = 'center'
    const hEnd = wrapTextCenter(ctx, form.headline, W / 2, P + 132, W - 2 * P - 20, 36)
    ctx.fillStyle = c.accent + '44'; ctx.fillRect(P, hEnd + 14, W - 2 * P, 1)
    // 大幅照片
    const pY = hEnd + 28, pH = 400
    if (img) { drawImage(ctx, img, P, pY, W - 2 * P, pH, c.bg) }
    else { ctx.fillStyle = '#ffffff08'; ctx.fillRect(P, pY, W - 2 * P, pH) }
    // 霓虹边框
    ctx.strokeStyle = c.accent; ctx.lineWidth = 2; ctx.shadowColor = c.accent; ctx.shadowBlur = 15
    ctx.strokeRect(P, pY, W - 2 * P, pH); ctx.shadowBlur = 0
    ctx.fillStyle = c.secondary; ctx.font = 'italic 12px Georgia, serif'; ctx.textAlign = 'center'
    ctx.fillText(form.caption, W / 2, pY + pH + 20)
    // 正文
    ctx.fillStyle = c.text; ctx.font = `14px ${t.fontFamily}`; ctx.textAlign = 'left'
    wrapText(ctx, form.content, P, pY + pH + 42, W - 2 * P, 22)
    // 底栏
    const fY = H - P - 28
    ctx.fillStyle = c.accent; ctx.shadowColor = c.accent; ctx.shadowBlur = 10
    ctx.fillRect(P, fY - 12, W - 2 * P, 2); ctx.shadowBlur = 0
    ctx.fillStyle = c.accent; ctx.font = `bold 15px ${t.fontFamily}`; ctx.textAlign = 'center'
    ctx.fillText(form.slogan, W / 2, fY + 6)
  }

  else if (t.layout === 'warmCard') {
    // 暖色美食风
    ctx.fillStyle = c.bg; ctx.fillRect(0, 0, W, H)
    // 装饰圆点
    ctx.fillStyle = c.accent + '15'
    for (let i = 0; i < 8; i++) { const cx = 80 + i * 95, cy = 30; ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2); ctx.fill() }
    drawDoubleBorder(ctx, W, H, P, c.line)
    // 报头
    ctx.fillStyle = c.text; ctx.textAlign = 'center'; ctx.font = `bold 46px ${t.fontFamily}`
    ctx.fillText(form.reportName, W / 2, P + 60)
    ctx.fillStyle = c.accent; ctx.fillRect(W / 2 - 40, P + 70, 80, 4)
    ctx.fillStyle = c.secondary; ctx.font = '13px Georgia, serif'
    ctx.fillText(form.date + '  ·  特别版', W / 2, P + 92)
    // 大标题
    ctx.fillStyle = c.text; ctx.font = `bold 28px ${t.fontFamily}`
    const hEnd = wrapTextCenter(ctx, form.headline, W / 2, P + 132, W - 2 * P - 20, 36)
    // 圆角大照片
    const pW = 520, pH = 380, pX = (W - pW) / 2, pY = hEnd + 24
    ctx.save()
    const r = 16
    ctx.beginPath()
    ctx.moveTo(pX + r, pY); ctx.lineTo(pX + pW - r, pY); ctx.arcTo(pX + pW, pY, pX + pW, pY + r, r)
    ctx.lineTo(pX + pW, pY + pH - r); ctx.arcTo(pX + pW, pY + pH, pX + pW - r, pY + pH, r)
    ctx.lineTo(pX + r, pY + pH); ctx.arcTo(pX, pY + pH, pX, pY + pH - r, r)
    ctx.lineTo(pX, pY + r); ctx.arcTo(pX, pY, pX + r, pY, r)
    ctx.closePath(); ctx.clip()
    if (img) { drawImage(ctx, img, pX, pY, pW, pH, c.bg) }
    else { ctx.fillStyle = c.text + '12'; ctx.fillRect(pX, pY, pW, pH) }
    ctx.restore()
    ctx.strokeStyle = c.line; ctx.lineWidth = 2
    ctx.beginPath()
    ctx.moveTo(pX + r, pY); ctx.lineTo(pX + pW - r, pY); ctx.arcTo(pX + pW, pY, pX + pW, pY + r, r)
    ctx.lineTo(pX + pW, pY + pH - r); ctx.arcTo(pX + pW, pY + pH, pX + pW - r, pY + pH, r)
    ctx.lineTo(pX + r, pY + pH); ctx.arcTo(pX, pY + pH, pX, pY + pH - r, r)
    ctx.lineTo(pX, pY + r); ctx.arcTo(pX, pY, pX + r, pY, r)
    ctx.closePath(); ctx.stroke()
    ctx.fillStyle = c.secondary; ctx.font = 'italic 12px Georgia, serif'; ctx.textAlign = 'center'
    ctx.fillText(form.caption, W / 2, pY + pH + 22)
    // 正文
    ctx.fillStyle = c.text; ctx.font = `15px ${t.fontFamily}`; ctx.textAlign = 'left'
    wrapText(ctx, form.content, P + 20, pY + pH + 48, W - 2 * P - 40, 24)
    // 底栏
    const fY = H - P - 32
    ctx.fillStyle = c.accent; ctx.fillRect(W / 2 - 40, fY - 14, 80, 3)
    ctx.fillStyle = c.accent; ctx.font = `bold 15px ${t.fontFamily}`; ctx.textAlign = 'center'
    ctx.fillText(form.slogan, W / 2, fY + 8)
  }

  else if (t.layout === 'vintage') {
    // 经典复古报版
    drawTexture(ctx, W, H, P, c.text)
    drawDoubleBorder(ctx, W, H, P, c.line)
    const afterH = drawHeader(ctx, W, P, c, t, form)
    // 竖排大标题区
    ctx.fillStyle = c.accent; ctx.fillRect(P, afterH + 4, 4, 180)
    ctx.fillStyle = c.text; ctx.textAlign = 'left'
    ctx.font = `bold 42px ${t.fontFamily}`
    const chars = form.headline.split('')
    chars.slice(0, 6).forEach((ch, i) => {
      ctx.fillText(ch, P + 16, afterH + 50 + i * 50)
    })
    // 右侧照片 + 正文
    const rightX = P + 90, rightW = W - P - rightX
    const pY = afterH + 10, pW = rightW, pH = 320
    if (img) { drawImage(ctx, img, rightX, pY, pW, pH, c.bg) }
    else { ctx.fillStyle = c.text + '12'; ctx.fillRect(rightX, pY, pW, pH) }
    ctx.strokeStyle = c.line; ctx.lineWidth = 2; ctx.strokeRect(rightX, pY, pW, pH)
    ctx.fillStyle = c.secondary; ctx.font = 'italic 12px Georgia, serif'; ctx.textAlign = 'center'
    ctx.fillText(form.caption, rightX + pW / 2, pY + pH + 18)
    // 全宽正文
    ctx.fillStyle = c.line + '55'; ctx.fillRect(P, pY + pH + 30, W - 2 * P, 1)
    ctx.fillStyle = c.text; ctx.font = `15px ${t.fontFamily}`; ctx.textAlign = 'left'
    wrapText(ctx, form.content, P, pY + pH + 52, W - 2 * P, 24)
    // 底栏
    const fY = H - P - 32
    ctx.fillStyle = c.accent; ctx.fillRect(P, fY - 14, W - 2 * P, 3)
    ctx.fillStyle = c.accent; ctx.font = `bold 15px ${t.fontFamily}`; ctx.textAlign = 'center'
    ctx.fillText(form.slogan, W / 2, fY + 8)
  }

  else if (t.layout === 'classicNews') {
    const M = 35
    ctx.fillStyle = c.bg; ctx.fillRect(0, 0, W, H)
    drawTexture(ctx, W, H, M, c.text)

    let curY = M

    // 日期行
    ctx.fillStyle = c.secondary; ctx.font = `13px ${t.fontFamily}`; ctx.textAlign = 'left'
    ctx.fillText(form.date, M, curY + 14)
    curY += 26

    // 报头区
    ctx.fillStyle = c.text; ctx.textAlign = 'left'; ctx.font = `bold 62px ${t.fontFamily}`
    ctx.fillText(form.reportName, M, curY + 58)
    const nameW = ctx.measureText(form.reportName).width

    // 报头右侧信息
    const rX = M + nameW + 24
    ctx.font = `bold 11px Arial, sans-serif`; ctx.fillStyle = c.secondary
    ctx.fillText(`${new Date().getFullYear()} 创刊号`, rX, curY + 28)
    ctx.fillText('头条新闻社', rX, curY + 44)

    // 右侧信息框
    const boxW = 62, boxH = 52, boxGap = 6
    const bx1 = W - M - boxW * 2 - boxGap, by = curY + 4
    ctx.strokeStyle = c.text; ctx.lineWidth = 1.5
    ctx.strokeRect(bx1, by, boxW, boxH)
    ctx.strokeRect(bx1 + boxW + boxGap, by, boxW, boxH)
    ctx.fillStyle = c.text; ctx.font = `bold 10px ${t.fontFamily}`; ctx.textAlign = 'center'
    ctx.fillText('今日宜', bx1 + boxW / 2, by + 14)
    ctx.font = `bold 14px ${t.fontFamily}`
    ctx.fillText('诸事', bx1 + boxW / 2, by + 32)
    ctx.fillText('皆宜', bx1 + boxW / 2, by + 48)
    ctx.font = `bold 10px ${t.fontFamily}`
    ctx.fillText('今日', bx1 + boxW + boxGap + boxW / 2, by + 14)
    ctx.fillText('天气', bx1 + boxW + boxGap + boxW / 2, by + 28)
    ctx.font = `bold 14px ${t.fontFamily}`
    ctx.fillText('晴空', bx1 + boxW + boxGap + boxW / 2, by + 42)

    curY += 68

    // 粗黑分隔线
    ctx.fillStyle = c.text; ctx.fillRect(M, curY, W - 2 * M, 4)
    curY += 12

    // 头条标题
    ctx.fillStyle = c.text; ctx.textAlign = 'left'; ctx.font = `bold 34px ${t.fontFamily}`
    const headlineEnd = wrapText(ctx, form.headline, M, curY + 34, W * 0.55, 44)
    // 右侧简介文字
    const introX = W * 0.6, introW = W - M - introX
    ctx.font = `13px ${t.fontFamily}`; ctx.fillStyle = c.secondary
    wrapText(ctx, form.content, introX, curY + 16, introW, 20)
    curY = headlineEnd + 20

    // 主照片
    const photoH = 360
    if (img) { drawImage(ctx, img, M, curY, W - 2 * M, photoH, '#e8e4dc') }
    else { ctx.fillStyle = c.text + '08'; ctx.fillRect(M, curY, W - 2 * M, photoH) }
    ctx.strokeStyle = c.text + '33'; ctx.lineWidth = 1; ctx.strokeRect(M, curY, W - 2 * M, photoH)
    curY += photoH + 4
    ctx.fillStyle = c.secondary; ctx.font = `italic 11px ${t.fontFamily}`; ctx.textAlign = 'center'
    ctx.fillText(form.caption, W / 2, curY + 12)
    curY += 22

    // 细分隔线
    ctx.fillStyle = c.text; ctx.fillRect(M, curY, W - 2 * M, 1.5)
    curY += 12

    // 三栏文章
    const colCount = 3, colGap = 16, totalGap = (colCount - 1) * colGap
    const colW = (W - 2 * M - totalGap) / colCount
    const colTexts = [
      { title: form.subHeadline || '延伸阅读', text: form.subContent || form.content },
      { title: '本报特别报道', text: form.content + (form.subContent ? form.subContent.slice(0, 50) : form.content.slice(0, 50)) },
      { title: '编者按', text: (form.subContent || form.content) + form.content.slice(0, 40) }
    ]

    for (let i = 0; i < colCount; i++) {
      const cx = M + i * (colW + colGap)
      if (i > 0) {
        ctx.fillStyle = c.text + '22'; ctx.fillRect(cx - colGap / 2, curY, 1, 200)
      }
      ctx.fillStyle = c.text; ctx.font = `bold 14px ${t.fontFamily}`; ctx.textAlign = 'left'
      ctx.fillText(colTexts[i].title, cx, curY + 16)
      ctx.fillStyle = c.text + 'dd'; ctx.fillRect(cx, curY + 22, colW, 1)
      ctx.fillStyle = c.text; ctx.font = `12px ${t.fontFamily}`
      wrapText(ctx, colTexts[i].text, cx, curY + 40, colW, 18)
    }

    // 底栏
    const fY = H - M - 30
    ctx.fillStyle = c.text; ctx.fillRect(M, fY - 8, W - 2 * M, 2)
    ctx.fillStyle = c.secondary; ctx.font = `bold 11px Arial, sans-serif`; ctx.textAlign = 'center'; ctx.letterSpacing = '3px'
    ctx.fillText(form.slogan, W / 2, fY + 10)
    // 底部方块装饰
    const dotSize = 6, dotGap = 8, dotCount = 3, dotTotal = dotCount * dotSize + (dotCount - 1) * dotGap
    const dotStartX = W / 2 - dotTotal / 2
    ctx.fillStyle = c.text
    for (let i = 0; i < dotCount; i++) { ctx.fillRect(dotStartX + i * (dotSize + dotGap), fY + 20, dotSize, dotSize) }
  }
}

const downloadPoster = () => {
  const canvas = posterCanvas.value
  if (!canvas) return
  const link = document.createElement('a')
  link.download = `${form.reportName}-海报-${Date.now()}.png`
  link.href = canvas.toDataURL('image/png')
  link.click()
  ElMessage.success('海报已保存！')
}

selectTemplate(templates[0])
</script>

<style scoped>
.poster-page { min-height: 100vh; background: #f0f2f5; }

.header { background: rgba(255,255,255,0.95); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(0,0,0,0.07); position: sticky; top: 0; z-index: 100; }
.header-inner { max-width: 1300px; margin: 0 auto; padding: 0 24px; height: 64px; display: flex; align-items: center; justify-content: space-between; }
.logo { display: flex; align-items: center; gap: 12px; cursor: pointer; }
.logo-icon { width: 44px; height: 44px; background: linear-gradient(135deg, #8b4513, #c8a96e); border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 24px; }
.logo-text { display: flex; flex-direction: column; }
.logo-title { font-size: 18px; font-weight: 700; background: linear-gradient(135deg, #8b4513, #c8a96e); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
.logo-sub { font-size: 12px; color: #999; }
.back-btn { border-color: rgba(139,69,19,0.3); color: #8b4513; }

.steps-bar { background: white; border-bottom: 1px solid #f0f0f0; display: flex; align-items: center; justify-content: center; padding: 14px 24px; }
.step-item { display: flex; align-items: center; gap: 8px; cursor: default; }
.step-item.done { cursor: pointer; }
.step-dot { width: 28px; height: 28px; border-radius: 50%; background: #e0e0e0; color: #999; font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center; transition: all 0.3s; }
.step-item.active .step-dot { background: linear-gradient(135deg, #8b4513, #c8a96e); color: white; }
.step-item.done .step-dot { background: #52c41a; color: white; }
.step-label { font-size: 13px; color: #999; font-weight: 500; }
.step-item.active .step-label { color: #8b4513; font-weight: 600; }
.step-item.done .step-label { color: #52c41a; }
.step-line { width: 60px; height: 2px; background: #e0e0e0; margin: 0 8px; transition: background 0.3s; }
.step-line.active { background: linear-gradient(to right, #8b4513, #c8a96e); }

.main-wrap { max-width: 1300px; margin: 0 auto; padding: 32px 24px 60px; }
.step-content { width: 100%; }
.step-title { font-size: 22px; font-weight: 700; color: #1a1a1a; margin-bottom: 8px; text-align: center; }
.step-sub { font-size: 14px; color: #999; text-align: center; margin-bottom: 28px; }

/* ===== Template Grid ===== */
.template-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 20px; margin-bottom: 32px; }

.tpl-card { background: white; border-radius: 16px; overflow: hidden; cursor: pointer; border: 3px solid transparent; transition: all 0.3s cubic-bezier(.34,1.56,.64,1); box-shadow: 0 4px 16px rgba(0,0,0,0.08); position: relative; }
.tpl-card:hover { transform: translateY(-6px) scale(1.02); box-shadow: 0 12px 32px rgba(0,0,0,0.15); }
.tpl-card.selected { border-color: #c8a96e; box-shadow: 0 12px 36px rgba(200,169,110,0.35); }
.tpl-card.selected::after { content: ''; position: absolute; inset: -3px; border-radius: 18px; border: 3px solid #c8a96e; animation: select-pulse 1.5s ease-in-out infinite alternate; pointer-events: none; }
@keyframes select-pulse { from { box-shadow: 0 0 0 0 rgba(200,169,110,0.3); } to { box-shadow: 0 0 0 6px rgba(200,169,110,0); } }

/* Mini poster inside card */
.tpl-poster { position: relative; padding: 14px 12px 8px; margin: 6px; border-radius: 8px; min-height: 200px; display: flex; flex-direction: column; gap: 5px; overflow: hidden; }

.tpl-texture { position: absolute; inset: 0; pointer-events: none; opacity: 0.5; }
.tex-bigTop, .tex-centered, .tex-vintage { background: repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(0,0,0,0.015) 8px, rgba(0,0,0,0.015) 9px), repeating-linear-gradient(90deg, transparent, transparent 8px, rgba(0,0,0,0.015) 8px, rgba(0,0,0,0.015) 9px); }
.tex-fullBleed { background: none; }
.tex-darkOverlay { background: radial-gradient(circle at 20% 80%, rgba(255,255,255,0.02), transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.02), transparent 50%); }
.tex-warmCard { background: radial-gradient(circle at 50% 0%, rgba(255,200,100,0.08), transparent 60%); }
.tex-leftRight { background: none; }

.tpl-frame { position: absolute; inset: 10px; border: 1px solid; pointer-events: none; border-radius: 2px; }

/* Poster elements */
.tp-head { font-size: 14px; font-weight: 900; text-align: center; letter-spacing: 2px; line-height: 1.2; position: relative; z-index: 1; }
.tp-head-bold { font-size: 13px; letter-spacing: 1px; }
.tp-neon-head { text-shadow: 0 0 12px currentColor; }
.tp-accent { height: 3px; border-radius: 2px; position: relative; z-index: 1; }
.tp-accent-short { width: 40px; margin: 0 auto; }
.tp-headline { font-size: 11px; font-weight: 700; text-align: center; line-height: 1.3; letter-spacing: 0.5px; position: relative; z-index: 1; }
.tp-body-lines { display: flex; flex-direction: column; gap: 3px; position: relative; z-index: 1; }
.tp-body-lines div { height: 3px; border-radius: 2px; }
.tp-lines-center { align-items: center; }
.tp-mini-line { height: 2px; border-radius: 1px; margin-bottom: 2px; }
.tp-slogan { font-size: 8px; font-weight: 600; text-align: center; letter-spacing: 1px; border-top: 1px solid; padding-top: 4px; margin-top: auto; position: relative; z-index: 1; }

/* Image areas */
.tp-img { border: 1px solid; display: flex; align-items: center; justify-content: center; position: relative; z-index: 1; overflow: hidden; }
.tp-img-icon { font-size: 22px; opacity: 0.4; }
.tp-img-wide { width: 100%; height: 60px; border-radius: 2px; }
.tp-img-center { width: 80%; height: 54px; margin: 0 auto; border-radius: 2px; }
.tp-img-tall { width: 46%; height: 80px; flex-shrink: 0; border-radius: 2px; }
.tp-img-rounded { width: 78%; height: 64px; margin: 0 auto; border-radius: 10px; }
.tp-img-vintage { flex: 1; height: 72px; border-radius: 2px; }
.tp-neon-img { border-width: 1px; }

/* Layout-specific */
.tp-split-row { display: flex; gap: 8px; position: relative; z-index: 1; }
.tp-split-right { flex: 1; display: flex; flex-direction: column; gap: 3px; justify-content: center; }

.tp-full-bg { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; }
.tp-full-icon { font-size: 48px; opacity: 0.25; }
.tp-full-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 20%, rgba(0,0,0,0.7) 100%); }
.tp-full-content { position: relative; z-index: 2; display: flex; flex-direction: column; gap: 5px; height: 100%; padding: 12px; }
.tp-full-spacer { flex: 1; }

.tp-neon-glow { position: absolute; inset: 0; pointer-events: none; }

.tp-warm-dots { display: flex; justify-content: center; gap: 6px; position: relative; z-index: 1; }
.tp-warm-dots span { width: 6px; height: 6px; border-radius: 50%; }

.tp-vintage-row { display: flex; gap: 6px; flex: 1; position: relative; z-index: 1; }
.tp-vintage-chars { display: flex; flex-direction: column; align-items: center; gap: 0; border-left: 2px solid; padding-left: 4px; flex-shrink: 0; }
.tp-vintage-chars span { font-size: 14px; font-weight: 900; line-height: 1.4; }

.tp-divider-ornament { text-align: center; font-size: 10px; line-height: 1; letter-spacing: 4px; position: relative; z-index: 1; }

.tpl-info { padding: 10px 12px 14px; }
.tpl-name { font-size: 14px; font-weight: 700; color: #1a1a1a; margin-bottom: 3px; }
.tpl-desc { font-size: 12px; color: #999; }
.tpl-check { position: absolute; top: 10px; left: 10px; width: 24px; height: 24px; border-radius: 50%; background: linear-gradient(135deg, #c8a96e, #8b4513); color: white; font-size: 13px; font-weight: 700; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(139,69,19,0.4); z-index: 5; }

.step-footer { text-align: center; }
.next-btn { padding: 12px 40px; font-size: 16px; font-weight: 600; border-radius: 10px; height: auto; }

/* Editor */
.editor-step { display: flex; }
.editor-layout { display: grid; grid-template-columns: 340px 1fr; gap: 28px; width: 100%; }
.ctrl-panel { background: white; border-radius: 16px; padding: 20px; box-shadow: 0 2px 12px rgba(0,0,0,0.07); display: flex; flex-direction: column; gap: 20px; height: fit-content; position: sticky; top: 80px; }
.panel-block { display: flex; flex-direction: column; gap: 10px; }
.block-title { font-size: 14px; font-weight: 700; color: #333; }

.upload-zone { height: 140px; border: 2px dashed #d0c0a0; border-radius: 12px; cursor: pointer; overflow: hidden; position: relative; transition: all 0.2s; display: flex; align-items: center; justify-content: center; background: #fdfaf5; }
.upload-zone:hover { border-color: #c8a96e; background: #faf5ea; }
.upload-zone.has-image { border-style: solid; }
.upload-thumb { width: 100%; height: 100%; object-fit: cover; }
.upload-placeholder { text-align: center; pointer-events: none; }
.upload-icon { font-size: 32px; margin-bottom: 6px; }
.upload-tip { font-size: 14px; color: #8b4513; font-weight: 600; }
.upload-sub { font-size: 12px; color: #bbb; margin-top: 2px; }
.upload-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.4); color: white; font-size: 14px; font-weight: 600; display: flex; align-items: center; justify-content: center; opacity: 0; transition: opacity 0.2s; }
.upload-zone:hover .upload-overlay { opacity: 1; }
.processing-tip { font-size: 12px; color: #999; text-align: center; }

.photo-options { display: flex; flex-direction: column; gap: 6px; margin-top: 6px; }
.color-switch { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.color-switch-label { font-size: 12px; color: #888; font-weight: 500; flex-shrink: 0; }
.color-switch-btns { display: flex; gap: 6px; }
.cs-btn { display: flex; align-items: center; gap: 4px; padding: 5px 12px; border-radius: 8px; border: 1.5px solid #e0d5c5; background: #fff; font-size: 12px; font-weight: 600; color: #888; cursor: pointer; transition: all 0.2s; }
.cs-btn:hover { border-color: #c8a96e; color: #8b4513; }
.cs-btn.active { background: linear-gradient(135deg, #8b4513, #c8a96e); border-color: transparent; color: #fff; }
.cs-icon { font-size: 14px; line-height: 1; }

.form-list { display: flex; flex-direction: column; gap: 8px; }
.form-row { display: flex; flex-direction: column; gap: 3px; }
.form-row label { font-size: 12px; color: #888; font-weight: 500; }
.panel-actions { display: flex; gap: 10px; padding-top: 4px; }
.panel-actions .el-button { flex: 1; }

/* Preview */
.preview-panel { display: flex; flex-direction: column; gap: 12px; }
.preview-scaler.cover-draggable { cursor: grab; user-select: none; }
.preview-scaler.cover-draggable:active { cursor: grabbing; }
.cover-drag-hint { position: absolute; bottom: 8px; left: 50%; transform: translateX(-50%); z-index: 10; font-size: 12px; color: rgba(255,255,255,0.9); text-shadow: 0 1px 2px rgba(0,0,0,0.5); background: rgba(0,0,0,0.35); padding: 4px 12px; border-radius: 20px; pointer-events: none; }
.preview-label { font-size: 13px; color: #999; font-weight: 600; text-align: center; }
.preview-scaler { position: relative; width: 100%; display: flex; justify-content: center; overflow: hidden; }

/* ===== Newspaper common ===== */
.newspaper { width: 480px; min-height: 680px; padding: 28px 26px; border-radius: 4px; position: relative; box-shadow: 0 12px 48px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.08); flex-shrink: 0; font-family: Georgia, 'SimSun', serif; display: flex; flex-direction: column; gap: 8px; }
.np-texture { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
.np-texture-paper { background: repeating-linear-gradient(0deg, transparent, transparent 12px, rgba(0,0,0,0.012) 12px, rgba(0,0,0,0.012) 13px), repeating-linear-gradient(90deg, transparent, transparent 12px, rgba(0,0,0,0.008) 12px, rgba(0,0,0,0.008) 13px); }
.np-texture-wave { background: url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z' fill='rgba(0%2C0%2C0%2C0.015)' fill-rule='evenodd'/%3E%3C/svg%3E"); }
.np-texture-grid { background: repeating-linear-gradient(90deg, transparent, transparent 24px, rgba(0,0,0,0.02) 24px, rgba(0,0,0,0.02) 25px); }
.np-texture-warm { background: radial-gradient(ellipse at 50% 0%, rgba(255,200,100,0.06), transparent 60%), radial-gradient(ellipse at 50% 100%, rgba(200,150,80,0.04), transparent 50%); }
.np-texture-aged { background: repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(0,0,0,0.008) 3px, rgba(0,0,0,0.008) 4px), radial-gradient(ellipse at 30% 70%, rgba(139,69,19,0.03), transparent 50%); }

.np-border { position: absolute; inset: 8px; border: 2px solid; pointer-events: none; z-index: 1; }
.np-border-double { border-width: 2px; box-shadow: inset 0 0 0 4px rgba(0,0,0,0.02); }
.np-border-warm { border-radius: 4px; }

/* Corner ornaments */
.np-corner { position: absolute; width: 16px; height: 16px; border-width: 2px; border-style: solid; z-index: 2; pointer-events: none; }
.np-corner-tl { top: 6px; left: 6px; border-right: none; border-bottom: none; }
.np-corner-tr { top: 6px; right: 6px; border-left: none; border-bottom: none; }
.np-corner-bl { bottom: 6px; left: 6px; border-right: none; border-top: none; }
.np-corner-br { bottom: 6px; right: 6px; border-left: none; border-top: none; }

.np-name { font-size: 34px; font-weight: 900; text-align: center; letter-spacing: 6px; line-height: 1.1; position: relative; z-index: 2; }
.np-name-outlined { letter-spacing: 8px; }
.np-name-modern { display: flex; align-items: center; justify-content: center; gap: 10px; letter-spacing: 3px; }
.np-name-badge { font-size: 9px; padding: 2px 6px; border-radius: 3px; letter-spacing: 1px; font-weight: 700; }
.np-name-warm { letter-spacing: 8px; }
.np-name-shadow { text-shadow: 0 2px 20px rgba(0,0,0,0.5); }

.np-date { font-size: 11px; text-align: center; opacity: 0.7; position: relative; z-index: 2; }
.np-date-row { display: flex; align-items: center; justify-content: center; gap: 12px; font-size: 11px; position: relative; z-index: 2; }
.np-date-line { flex: 1; max-width: 60px; height: 1px; opacity: 0.3; }
.np-bar { height: 4px; border-radius: 2px; position: relative; z-index: 2; }
.np-bar-gradient { height: 3px; }
.np-bar-vintage { height: 3px; }
.np-title { font-size: 20px; font-weight: 800; line-height: 1.4; letter-spacing: 1px; text-align: center; position: relative; z-index: 2; }
.np-title-boxed { padding: 8px 16px; border: 1px dashed; border-radius: 2px; }
.np-title-left { text-align: left; font-size: 22px; }
.np-title-warm { font-size: 19px; }
.np-line { height: 1px; opacity: 0.35; position: relative; z-index: 2; }
.np-text { font-size: 12px; line-height: 1.85; margin: 0; text-align: justify; word-break: break-all; position: relative; z-index: 2; }
.np-text-center { text-align: center; }
.np-text-cols { column-count: 2; column-gap: 16px; }
.np-cap { font-size: 10px; font-style: italic; text-align: center; opacity: 0.7; position: relative; z-index: 2; }
.np-bot { text-align: center; font-size: 12px; font-weight: 700; padding-top: 8px; border-top: 2px solid; letter-spacing: 2px; margin-top: auto; position: relative; z-index: 2; }
.np-bot-no-border { border-top: none; }
.np-bot-fancy .np-bot-deco { opacity: 0.5; margin: 0 4px; }
.np-bot-lr { text-align: left; letter-spacing: 3px; font-size: 11px; }
.np-bot-warm { font-size: 13px; letter-spacing: 3px; }
.np-bot-vintage { letter-spacing: 4px; }
.np-bot-neon { border-top-style: dashed; }
.np-bot-full { border-top-style: dashed; }
.np-ph { border: 1px dashed; display: flex; align-items: center; justify-content: center; font-size: 12px; color: #999; background: rgba(0,0,0,0.03); gap: 4px; }

/* Ornaments & dividers */
.np-ornament { text-align: center; font-size: 11px; letter-spacing: 6px; opacity: 0.6; position: relative; z-index: 2; }
.np-ornament-water { letter-spacing: 3px; }
.np-divider-fancy { display: flex; align-items: center; gap: 8px; justify-content: center; font-size: 10px; position: relative; z-index: 2; }
.np-divider-wing { flex: 1; max-width: 80px; height: 1px; opacity: 0.25; }

.np-watermark { position: absolute; font-size: 200px; font-weight: 900; top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none; z-index: 0; line-height: 1; }
.np-drop-cap { float: left; font-size: 38px; font-weight: 900; line-height: 0.9; margin-right: 4px; margin-top: 2px; position: relative; z-index: 2; }

/* bigTop: 大幅照片置顶 */
.np-bigtop .np-big-photo { width: 100%; aspect-ratio: 16/9; overflow: hidden; border-radius: 2px; position: relative; z-index: 2; background: rgba(0,0,0,0.04); }
.np-bigtop .np-big-photo img { width: 100%; height: 100%; }
.np-bigtop .np-big-photo .np-ph { width: 100%; height: 100%; aspect-ratio: 16/9; }

/* centered: 居中照片 */
.np-centered .np-center-photo { width: 78%; aspect-ratio: 4/3; margin: 0 auto; overflow: hidden; border-radius: 3px; position: relative; z-index: 2; box-shadow: 0 4px 20px rgba(0,0,0,0.1); background: rgba(0,0,0,0.04); }
.np-centered .np-center-photo img { width: 100%; height: 100%; }
.np-centered .np-center-photo .np-ph { width: 100%; height: 100%; }

/* leftRight: 左图右文 */
.np-lr { gap: 10px; }
.np-stripe-top { height: 6px; margin: -28px -26px 0; position: relative; z-index: 2; }
.np-lr .np-split { display: flex; gap: 12px; flex: 1; position: relative; z-index: 2; }
.np-lr .np-split-photo { width: 48%; flex-shrink: 0; display: flex; flex-direction: column; gap: 4px; }
.np-lr .np-split-photo img { width: 100%; aspect-ratio: 3/4; border-radius: 2px; }
.np-lr .np-split-photo .np-ph.tall { width: 100%; aspect-ratio: 3/4; }
.np-lr .np-split-divider { width: 1px; flex-shrink: 0; }
.np-lr .np-split-text { flex: 1; }

/* fullBleed: 照片铺底 + 渐变遮罩 */
.np-full { padding: 0 !important; overflow: hidden; }
.np-full .np-full-img { position: absolute; inset: 0; }
.np-full .np-full-img img { width: 100%; height: 100%; background: #333; }
.np-full .np-ph-full { width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #444; color: #999; font-size: 14px; gap: 8px; }
.np-full .np-ph-full-icon { font-size: 48px; opacity: 0.4; }
.np-full .np-full-overlay-rich { position: absolute; inset: 0; background: linear-gradient(to bottom, rgba(0,0,0,0) 15%, rgba(0,0,0,0.4) 45%, rgba(0,0,0,0.85) 100%); }
.np-full .np-full-vignette { position: absolute; inset: 0; box-shadow: inset 0 0 100px rgba(0,0,0,0.3); pointer-events: none; }
.np-full .np-full-top { position: relative; z-index: 2; padding: 24px 24px 0; display: flex; flex-direction: column; gap: 4px; }
.np-full .np-full-bottom { position: relative; z-index: 2; margin-top: auto; padding: 24px 28px 26px; display: flex; flex-direction: column; gap: 10px; }
.np-full .np-full-title-deco { border-left: 3px solid; padding-left: 14px; }
.np-full .np-full-accent-row { display: flex; align-items: center; justify-content: center; gap: 8px; }
.np-full .np-full-accent-wing { width: 40px; height: 1px; }
.np-full .np-full-accent-diamond { font-size: 10px; }

/* darkOverlay: 霓虹夜色 */
.np-dark { overflow: hidden; }
.np-dark .np-dark-glow { position: absolute; inset: 0; pointer-events: none; }
.np-dark .np-dark-stars { position: absolute; inset: 0; pointer-events: none; background: radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.15), transparent), radial-gradient(1px 1px at 40% 70%, rgba(255,255,255,0.1), transparent), radial-gradient(1px 1px at 60% 20%, rgba(255,255,255,0.12), transparent), radial-gradient(1px 1px at 80% 50%, rgba(255,255,255,0.1), transparent), radial-gradient(1px 1px at 10% 80%, rgba(255,255,255,0.08), transparent), radial-gradient(1px 1px at 70% 85%, rgba(255,255,255,0.1), transparent), radial-gradient(1px 1px at 50% 10%, rgba(255,255,255,0.12), transparent), radial-gradient(1px 1px at 90% 60%, rgba(255,255,255,0.08), transparent); }
.np-neon-corner { position: absolute; width: 20px; height: 2px; z-index: 2; }
.np-neon-corner-tl { top: 12px; left: 12px; box-shadow: 0 0 8px currentColor; }
.np-neon-corner-tl::after { content: ''; position: absolute; width: 2px; height: 20px; background: inherit; top: 0; left: 0; box-shadow: 0 0 8px currentColor; }
.np-neon-corner-tr { top: 12px; right: 12px; box-shadow: 0 0 8px currentColor; }
.np-neon-corner-tr::after { content: ''; position: absolute; width: 2px; height: 20px; background: inherit; top: 0; right: 0; box-shadow: 0 0 8px currentColor; }
.np-neon-corner-bl { bottom: 12px; left: 12px; box-shadow: 0 0 8px currentColor; }
.np-neon-corner-bl::after { content: ''; position: absolute; width: 2px; height: 20px; background: inherit; bottom: 0; left: 0; box-shadow: 0 0 8px currentColor; }
.np-neon-corner-br { bottom: 12px; right: 12px; box-shadow: 0 0 8px currentColor; }
.np-neon-corner-br::after { content: ''; position: absolute; width: 2px; height: 20px; background: inherit; bottom: 0; right: 0; box-shadow: 0 0 8px currentColor; }
.np-dark .np-neon-border { border-width: 1px; }
.np-dark .np-neon-text { letter-spacing: 8px; }
.np-dark .np-neon-bar { height: 2px; }
.np-dark .np-dark-photo { width: 100%; aspect-ratio: 16/10; overflow: hidden; border-radius: 3px; position: relative; z-index: 2; background: rgba(255,255,255,0.03); }
.np-dark .np-dark-photo img { width: 100%; height: 100%; }
.np-dark .np-dark-photo .np-ph { width: 100%; height: 100%; aspect-ratio: 16/10; border: 1px solid; }

/* warmCard: 暖色美食 */
.np-warm .np-warm-ribbon { position: absolute; top: 14px; right: -30px; transform: rotate(45deg); width: 100px; text-align: center; font-size: 9px; font-weight: 800; color: #fff; letter-spacing: 2px; padding: 2px 0; z-index: 3; }
.np-warm .np-warm-dots { display: flex; justify-content: center; gap: 10px; position: relative; z-index: 2; }
.np-warm .np-warm-dots span { width: 8px; height: 8px; border-radius: 50%; }
.np-warm .np-warm-accent-line { width: 80px; height: 2px; margin: 0 auto; border-radius: 2px; position: relative; z-index: 2; }
.np-warm .np-warm-photo { width: 82%; aspect-ratio: 4/3; margin: 0 auto; overflow: hidden; border-radius: 16px; position: relative; z-index: 2; box-shadow: 0 6px 24px rgba(0,0,0,0.12); background: rgba(0,0,0,0.03); }
.np-warm .np-warm-photo img { width: 100%; height: 100%; }
.np-warm .np-warm-photo .np-ph.rounded { width: 100%; height: 100%; border-radius: 16px; }
.np-warm .np-warm-photo-shadow { height: 8px; width: 70%; margin: 0 auto; border-radius: 0 0 50% 50%; background: rgba(0,0,0,0.06); position: relative; z-index: 2; }
.np-warm .np-warm-quote { text-align: center; font-size: 13px; font-style: italic; line-height: 1.6; padding: 8px 16px; border-left: 3px solid; margin: 4px 20px; position: relative; z-index: 2; }
.np-warm .np-warm-quote-mark { font-size: 28px; line-height: 0; vertical-align: -6px; opacity: 0.3; }
.np-warm .np-warm-bot-line { width: 80px; height: 2px; margin: 0 auto; border-radius: 2px; position: relative; z-index: 2; }

/* vintage: 竖排标题 + 右图 */
.np-vintage .np-vintage-header { display: flex; align-items: center; justify-content: center; gap: 16px; position: relative; z-index: 2; }
.np-vintage .np-vintage-dragon { font-size: 28px; font-weight: 900; opacity: 0.2; font-family: 'SimSun', serif; }
.np-vintage .np-vintage-rule { border-bottom: 1px dashed; margin: 0 -6px; position: relative; z-index: 2; }
.np-vintage .np-vintage-body { display: flex; gap: 10px; flex: 1; position: relative; z-index: 2; }
.np-vintage .np-vintage-left { width: 44px; flex-shrink: 0; border-left: 3px solid; padding-left: 8px; display: flex; flex-direction: column; gap: 2px; }
.np-vintage .np-vchar { font-size: 30px; font-weight: 900; line-height: 1.35; }
.np-vintage .np-vintage-right { flex: 1; display: flex; flex-direction: column; gap: 4px; }
.np-vintage .np-vintage-photo { width: 100%; aspect-ratio: 16/10; overflow: hidden; border-radius: 2px; box-shadow: 0 4px 16px rgba(0,0,0,0.1); background: rgba(0,0,0,0.04); }
.np-vintage .np-vintage-photo img { width: 100%; height: 100%; }
.np-vintage .np-vintage-photo .np-ph.tall { width: 100%; aspect-ratio: 16/10; }

/* classicNews: 仿真报纸 */
.np-classic { padding: 16px 20px; gap: 0; font-family: 'SimSun', 'Georgia', serif; }

.cn-dateline { font-size: 11px; color: #444; margin-bottom: 4px; position: relative; z-index: 2; }

.cn-masthead-area { display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; position: relative; z-index: 2; margin-bottom: 6px; }
.cn-masthead-left { flex: 1; }
.cn-masthead-name { font-size: 48px; font-weight: 900; line-height: 1; letter-spacing: 6px; color: #1a1a1a; }
.cn-masthead-sub { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; margin-top: 2px; }
.cn-pinyin { font-size: 10px; font-family: Arial, sans-serif; letter-spacing: 1px; color: #666; text-transform: uppercase; }
.cn-issue { font-size: 10px; color: #444; font-weight: 700; }
.cn-publisher { font-size: 10px; color: #444; }
.cn-masthead-right { display: flex; gap: 4px; flex-shrink: 0; }
.cn-infobox { border: 1.5px solid #1a1a1a; padding: 4px 6px; text-align: center; width: 56px; }
.cn-infobox-label { font-size: 9px; color: #666; margin-bottom: 2px; letter-spacing: 1px; }
.cn-infobox-value { font-size: 11px; font-weight: 900; color: #1a1a1a; line-height: 1.3; }

.cn-thick-rule { height: 4px; background: #1a1a1a; position: relative; z-index: 2; margin-bottom: 8px; }

.cn-headline-area { display: flex; gap: 14px; margin-bottom: 8px; position: relative; z-index: 2; }
.cn-headline-left { flex: 0 0 55%; }
.cn-headline { font-size: 22px; font-weight: 900; line-height: 1.45; color: #1a1a1a; }
.cn-headline-right { flex: 1; padding-top: 2px; }
.cn-intro-text { font-size: 11px; line-height: 1.65; color: #333; margin: 0; text-align: justify; }

.cn-main-photo { width: 100%; aspect-ratio: 16/9; overflow: hidden; position: relative; z-index: 2; background: #e8e4dc; }
.cn-main-photo img { width: 100%; height: 100%; }
.cn-ph { width: 100%; height: 100%; aspect-ratio: 16/9; font-size: 13px; }

.cn-thin-rule { height: 1.5px; background: #1a1a1a; margin: 6px 0; position: relative; z-index: 2; }

.cn-articles { display: flex; gap: 0; position: relative; z-index: 2; flex: 1; min-height: 120px; }
.cn-article-col { flex: 1; padding: 0 8px; }
.cn-article-col:first-child { padding-left: 0; }
.cn-article-col:last-child { padding-right: 0; }
.cn-col-divider { width: 1px; background: #1a1a1a22; flex-shrink: 0; }
.cn-col-title { font-size: 12px; font-weight: 900; color: #1a1a1a; margin-bottom: 4px; line-height: 1.3; border-bottom: 1px solid #1a1a1a33; padding-bottom: 3px; }
.cn-col-text { font-size: 10px; line-height: 1.7; color: #333; margin: 0; text-align: justify; display: -webkit-box; -webkit-line-clamp: 8; -webkit-box-orient: vertical; overflow: hidden; }

.cn-footer-rule { height: 2px; background: #1a1a1a; margin-top: auto; position: relative; z-index: 2; }
.cn-footer { text-align: center; padding-top: 6px; position: relative; z-index: 2; }
.cn-footer-text { font-size: 10px; font-weight: 700; font-family: Arial, sans-serif; letter-spacing: 3px; color: #1a1a1a; text-transform: uppercase; }

/* Template card preview for classicNews */
.tp-cn-date { font-size: 7px; color: #888; position: relative; z-index: 1; }
.tp-cn-masthead { display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 1; margin-bottom: 2px; }
.tp-cn-name { font-size: 18px; font-weight: 900; letter-spacing: 2px; line-height: 1; }
.tp-cn-side { display: flex; gap: 2px; }
.tp-cn-box { border: 1px solid; font-size: 6px; font-weight: 700; padding: 1px 3px; text-align: center; line-height: 1.2; }
.tp-cn-headline { font-size: 9px; font-weight: 900; line-height: 1.3; position: relative; z-index: 1; margin-bottom: 3px; }
.tp-cn-photo { height: 48px !important; }
.tp-cn-cols { display: flex; gap: 3px; position: relative; z-index: 1; margin-top: 3px; }
.tp-cn-col { flex: 1; display: flex; flex-direction: column; gap: 2px; border-left: 1px solid rgba(0,0,0,0.08); padding-left: 3px; }
.tp-cn-col:first-child { border-left: none; padding-left: 0; }

/* Result */
.result-step { display: flex; flex-direction: column; align-items: center; gap: 20px; }
.canvas-wrap { width: 100%; max-width: 700px; border-radius: 8px; overflow: hidden; box-shadow: 0 12px 48px rgba(0,0,0,0.25); }
.poster-canvas { display: block; max-width: 100%; height: auto; }
.save-tip { font-size: 14px; color: #888; margin: 0; }
.result-actions { display: flex; gap: 12px; flex-wrap: wrap; justify-content: center; }

/* Responsive */
@media (max-width: 900px) {
  .editor-layout { grid-template-columns: 1fr; }
  .ctrl-panel { position: static; }
  .newspaper { width: 100%; min-width: 0; min-height: 520px; padding: 20px 18px; }
  .np-text-cols { column-count: 1; }
  .cn-masthead-name { font-size: 36px; letter-spacing: 3px; }
  .cn-headline { font-size: 18px; }
  .cn-headline-area { flex-direction: column; gap: 6px; }
  .cn-headline-left { flex: auto; }
  .cn-articles { flex-direction: column; gap: 8px; }
  .cn-col-divider { width: 100%; height: 1px; }
  .cn-article-col { padding: 0; }
}

@media (max-width: 640px) {
  .main-wrap { padding: 20px 16px 48px; }
  .header-inner { padding: 0 16px; height: 58px; }
  .logo-icon { width: 38px; height: 38px; font-size: 20px; }
  .logo-title { font-size: 16px; }
  .logo-sub { display: none; }
  .steps-bar { padding: 12px 16px; }
  .step-label { display: none; }
  .step-line { width: 32px; }
  .template-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .tpl-poster { padding: 10px 8px 6px; margin: 4px; min-height: 170px; }
  .tp-head { font-size: 12px; letter-spacing: 1px; }
  .tp-headline { font-size: 9px; }
  .tp-slogan { font-size: 7px; }
  .np-text-cols { column-count: 1; }
  .np-name { font-size: 26px; letter-spacing: 3px; }
  .np-title { font-size: 16px; }
  .np-warm .np-warm-ribbon { display: none; }
  .cn-masthead-name { font-size: 28px; }
  .cn-masthead-right { display: none; }
  .cn-headline { font-size: 16px; }
  .cn-articles { flex-direction: column; }
  .cn-col-divider { width: 100%; height: 1px; }
  .result-actions .el-button { padding: 10px 16px; font-size: 14px; }
}
</style>
