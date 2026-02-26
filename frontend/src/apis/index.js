import axios from 'axios'
import { ElMessage } from 'element-plus'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})

request.interceptors.response.use(
  res => {
    if (res.data.code === 200) return res.data
    ElMessage.error(res.data.message || '请求失败')
    return Promise.reject(res.data)
  },
  err => {
    ElMessage.error(err.message || '网络错误')
    return Promise.reject(err)
  }
)

// 项目 API
export const projectApi = {
  // 首页公开接口
  getPublic: (params) => request.get('/projects/public', { params }),
  getCategories: () => request.get('/projects/categories'),

  // 管理后台接口
  list: (params) => request.get('/projects', { params }),
  get: (id) => request.get(`/projects/${id}`),
  create: (data) => request.post('/projects', data),
  update: (id, data) => request.put(`/projects/${id}`, data),
  remove: (id) => request.delete(`/projects/${id}`),
  batchSort: (items) => request.post('/projects/sort/batch', { items })
}

// 上传 API
export const uploadApi = {
  upload: (file) => {
    const form = new FormData()
    form.append('file', file)
    return request.post('/upload', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  }
}

export default request
