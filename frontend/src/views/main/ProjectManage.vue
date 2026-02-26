<template>
  <div class="project-manage">
    <!-- 页面标题 -->
    <div class="page-header">
      <div>
        <h2 class="page-title">项目管理</h2>
        <p class="page-desc">管理所有部署项目的信息和展示状态</p>
      </div>
      <el-button type="primary" @click="openDialog()">
        <el-icon><Plus /></el-icon>
        添加项目
      </el-button>
    </div>

    <!-- 搜索和过滤 -->
    <el-card class="filter-card" shadow="never">
      <div class="filter-row">
        <el-input
          v-model="searchForm.keyword"
          placeholder="搜索项目名称或描述..."
          clearable
          style="width: 300px"
          @keyup.enter="fetchList"
        >
          <template #prefix><el-icon><Search /></el-icon></template>
        </el-input>
        <el-select v-model="searchForm.category" placeholder="按分类筛选" clearable style="width: 160px">
          <el-option v-for="cat in categories" :key="cat" :label="cat" :value="cat" />
        </el-select>
        <el-button @click="fetchList">
          <el-icon><Search /></el-icon>
          搜索
        </el-button>
        <el-button @click="resetSearch">重置</el-button>
      </div>
    </el-card>

    <!-- 项目表格 -->
    <el-card class="table-card" shadow="never">
      <el-table
        v-loading="loading"
        :data="tableData"
        row-key="id"
        stripe
        style="width: 100%"
      >
        <el-table-column type="index" width="55" label="#" />

        <el-table-column label="封面" width="80">
          <template #default="{ row }">
            <div class="table-cover" :style="{ background: row.color }">
              <img v-if="row.image" :src="row.image" :alt="row.name" @error="e => e.target.style.display='none'" />
              <span v-else class="cover-text">{{ row.name?.[0] }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="项目名称" min-width="140">
          <template #default="{ row }">
            <div class="project-name-cell">
              <span class="name-text">{{ row.name }}</span>
              <el-tag v-if="row.category" size="small" round style="margin-left: 6px">{{ row.category }}</el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="描述" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            <span class="desc-text">{{ row.description || '—' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="访问地址" min-width="200">
          <template #default="{ row }">
            <a :href="row.url" target="_blank" class="url-link" @click.stop>
              <el-icon size="12"><Link /></el-icon>
              {{ row.url }}
            </a>
          </template>
        </el-table-column>

        <el-table-column label="排序" width="80" align="center">
          <template #default="{ row }">
            <span class="sort-num">{{ row.sort }}</span>
          </template>
        </el-table-column>

        <el-table-column label="首页展示" width="100" align="center">
          <template #default="{ row }">
            <el-switch
              v-model="row.visible"
              @change="toggleVisible(row)"
            />
          </template>
        </el-table-column>

        <el-table-column label="创建时间" width="120" align="center">
          <template #default="{ row }">
            <span class="time-text">{{ formatDate(row.createdAt) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="140" align="center" fixed="right">
          <template #default="{ row }">
            <el-button text type="primary" size="small" @click="openDialog(row)">
              <el-icon><Edit /></el-icon>
              编辑
            </el-button>
            <el-popconfirm
              title="确认删除此项目吗？"
              confirm-button-type="danger"
              @confirm="deleteProject(row.id)"
            >
              <template #reference>
                <el-button text type="danger" size="small">
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          :page-sizes="[10, 20, 50]"
          layout="total, sizes, prev, pager, next"
          @change="fetchList"
        />
      </div>
    </el-card>

    <!-- 新增/编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEdit ? '编辑项目' : '添加项目'"
      width="680px"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="90px"
        class="project-form"
      >
        <el-row :gutter="16">
          <el-col :span="14">
            <el-form-item label="项目名称" prop="name">
              <el-input v-model="form.name" placeholder="如：档案管理系统" />
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="分类" prop="category">
              <el-autocomplete
                v-model="form.category"
                :fetch-suggestions="suggestCategories"
                placeholder="如：管理系统"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="访问地址" prop="url">
          <el-input v-model="form.url" placeholder="https://example.com 或 http://ip:port" />
        </el-form-item>

        <el-form-item label="项目描述">
          <el-input
            v-model="form.description"
            type="textarea"
            :rows="3"
            placeholder="简短描述项目的功能和用途..."
          />
        </el-form-item>

        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="封面图片">
              <div class="upload-area">
                <div v-if="form.image" class="image-preview">
                  <img :src="form.image" alt="封面" />
                  <div class="image-actions">
                    <el-icon class="preview-icon" @click="previewImage"><ZoomIn /></el-icon>
                    <el-icon class="remove-icon" @click="form.image = ''"><Close /></el-icon>
                  </div>
                </div>
                <el-upload
                  v-else
                  class="uploader"
                  action="/api/upload"
                  :show-file-list="false"
                  accept="image/*"
                  :on-success="onUploadSuccess"
                  :on-error="onUploadError"
                  :before-upload="beforeUpload"
                >
                  <div class="upload-placeholder">
                    <el-icon size="32" color="#ddd"><Plus /></el-icon>
                    <span>点击上传封面</span>
                    <span class="upload-hint">支持 jpg/png/gif，≤5MB</span>
                  </div>
                </el-upload>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="主题色">
              <div class="color-picker-row">
                <el-color-picker v-model="form.color" show-alpha />
                <div class="color-presets">
                  <div
                    v-for="c in colorPresets"
                    :key="c"
                    class="color-dot"
                    :style="{ background: c }"
                    :class="{ active: form.color === c }"
                    @click="form.color = c"
                  ></div>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="排序">
              <el-input-number v-model="form.sort" :min="0" :max="9999" style="width: 100%" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item label="标签">
          <el-tag
            v-for="tag in form.tags"
            :key="tag"
            closable
            @close="removeTag(tag)"
            style="margin: 2px"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="tagInputVisible"
            ref="tagInputRef"
            v-model="tagInputValue"
            size="small"
            style="width: 100px; margin: 2px"
            @keyup.enter="addTag"
            @blur="addTag"
          />
          <el-button v-else size="small" @click="showTagInput">
            <el-icon><Plus /></el-icon> 添加标签
          </el-button>
        </el-form-item>

        <el-form-item label="首页展示">
          <el-switch v-model="form.visible" active-text="展示" inactive-text="隐藏" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="submitting" @click="submitForm">
          {{ isEdit ? '保存修改' : '确认添加' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 图片预览 -->
    <el-image-viewer
      v-if="imageViewerVisible"
      :url-list="[form.image]"
      @close="imageViewerVisible = false"
    />
  </div>
</template>

<script setup>
import { ref, reactive, nextTick, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { projectApi } from '@/apis'

const loading = ref(false)
const submitting = ref(false)
const tableData = ref([])
const categories = ref([])
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref()
const imageViewerVisible = ref(false)
const tagInputVisible = ref(false)
const tagInputValue = ref('')
const tagInputRef = ref()

const searchForm = reactive({ keyword: '', category: '' })
const pagination = reactive({ page: 1, pageSize: 10, total: 0 })

const defaultForm = () => ({
  name: '',
  description: '',
  url: '',
  image: '',
  category: '默认',
  tags: [],
  sort: 0,
  visible: true,
  color: '#409eff'
})

const form = reactive(defaultForm())

const rules = {
  name: [{ required: true, message: '请输入项目名称', trigger: 'blur' }],
  url: [
    { required: true, message: '请输入访问地址', trigger: 'blur' },
    { pattern: /^https?:\/\//, message: '地址需以 http:// 或 https:// 开头', trigger: 'blur' }
  ]
}

const colorPresets = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c', '#909399', '#9b59b6', '#e74c3c', '#1abc9c']

async function fetchList() {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      keyword: searchForm.keyword,
      category: searchForm.category
    }
    const res = await projectApi.list(params)
    tableData.value = res.data.list
    pagination.total = res.data.total
  } finally {
    loading.value = false
  }
}

async function fetchCategories() {
  const res = await projectApi.getCategories()
  categories.value = res.data.filter(c => c !== '全部')
}

function suggestCategories(query, cb) {
  const results = categories.value
    .filter(c => c.toLowerCase().includes(query.toLowerCase()))
    .map(c => ({ value: c }))
  cb(results)
}

function resetSearch() {
  searchForm.keyword = ''
  searchForm.category = ''
  pagination.page = 1
  fetchList()
}

function openDialog(row) {
  isEdit.value = !!row
  Object.assign(form, defaultForm())
  if (row) {
    Object.assign(form, {
      ...row,
      tags: Array.isArray(row.tags) ? [...row.tags] : []
    })
  }
  dialogVisible.value = true
}

async function submitForm() {
  await formRef.value.validate()
  submitting.value = true
  try {
    const data = { ...form }
    if (isEdit.value) {
      await projectApi.update(form.id, data)
      ElMessage.success('更新成功')
    } else {
      await projectApi.create(data)
      ElMessage.success('添加成功')
    }
    dialogVisible.value = false
    fetchList()
    fetchCategories()
  } finally {
    submitting.value = false
  }
}

async function deleteProject(id) {
  await projectApi.remove(id)
  ElMessage.success('删除成功')
  fetchList()
  fetchCategories()
}

async function toggleVisible(row) {
  try {
    await projectApi.update(row.id, { visible: row.visible })
    ElMessage.success(row.visible ? '已设为展示' : '已设为隐藏')
  } catch {
    row.visible = !row.visible
  }
}

function onUploadSuccess(res) {
  if (res.code === 200) {
    form.image = res.data.url
    ElMessage.success('上传成功')
  } else {
    ElMessage.error(res.message || '上传失败')
  }
}

function onUploadError() {
  ElMessage.error('上传失败，请重试')
}

function beforeUpload(file) {
  const isImage = file.type.startsWith('image/')
  const isLt5M = file.size / 1024 / 1024 < 5
  if (!isImage) { ElMessage.error('只能上传图片文件'); return false }
  if (!isLt5M) { ElMessage.error('图片大小不能超过 5MB'); return false }
  return true
}

function previewImage() {
  imageViewerVisible.value = true
}

function showTagInput() {
  tagInputVisible.value = true
  nextTick(() => tagInputRef.value?.focus())
}

function addTag() {
  const val = tagInputValue.value.trim()
  if (val && !form.tags.includes(val)) {
    form.tags.push(val)
  }
  tagInputVisible.value = false
  tagInputValue.value = ''
}

function removeTag(tag) {
  form.tags = form.tags.filter(t => t !== tag)
}

function formatDate(str) {
  if (!str) return '—'
  return new Date(str).toLocaleDateString('zh-CN')
}

onMounted(() => {
  fetchList()
  fetchCategories()
})
</script>

<style scoped>
.project-manage {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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

:deep(.el-card) {
  border-radius: 16px;
  border: 1px solid #f0f0f0;
}

.filter-card :deep(.el-card__body) {
  padding: 16px 20px;
}

.filter-row {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.table-card :deep(.el-card__body) {
  padding: 0;
}

:deep(.el-table) {
  border-radius: 0 0 16px 16px;
}

.table-cover {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.table-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-text {
  color: white;
  font-weight: 700;
  font-size: 18px;
}

.project-name-cell {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px;
}

.name-text {
  font-weight: 500;
  color: #333;
}

.desc-text {
  color: #888;
  font-size: 13px;
}

.url-link {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #667eea;
  font-size: 13px;
  text-decoration: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.url-link:hover {
  text-decoration: underline;
}

.sort-num {
  font-weight: 600;
  color: #666;
}

.time-text {
  font-size: 12px;
  color: #bbb;
}

.pagination {
  padding: 16px 20px;
  display: flex;
  justify-content: flex-end;
}

/* 表单 */
.project-form {
  padding: 0 8px;
}

.upload-area {
  width: 100%;
}

.image-preview {
  position: relative;
  width: 160px;
  height: 120px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #eee;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-actions {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  opacity: 0;
  transition: opacity 0.2s;
}

.image-preview:hover .image-actions {
  opacity: 1;
}

.preview-icon,
.remove-icon {
  color: white;
  cursor: pointer;
  font-size: 20px;
}

:deep(.el-upload) {
  width: 160px;
  height: 120px;
}

.uploader {
  display: block;
}

.upload-placeholder {
  width: 160px;
  height: 120px;
  border: 2px dashed #ddd;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  cursor: pointer;
  transition: border-color 0.2s;
  color: #999;
  font-size: 13px;
}

.upload-placeholder:hover {
  border-color: #667eea;
  color: #667eea;
}

.upload-hint {
  font-size: 11px;
  color: #ccc;
}

.color-picker-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.color-presets {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.color-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid transparent;
  transition: transform 0.15s, border-color 0.15s;
}

.color-dot:hover,
.color-dot.active {
  transform: scale(1.2);
  border-color: white;
  box-shadow: 0 0 0 2px #667eea;
}
</style>
