import { defineStore } from 'pinia'
import { ref } from 'vue'
import { projectApi } from '@/apis'

export const useProjectStore = defineStore('project', () => {
  const projects = ref([])
  const categories = ref(['全部'])
  const activeCategory = ref('全部')
  const loading = ref(false)

  async function fetchPublicProjects(category) {
    loading.value = true
    try {
      const params = {}
      if (category && category !== '全部') params.category = category
      const res = await projectApi.getPublic(params)
      projects.value = res.data
    } finally {
      loading.value = false
    }
  }

  async function fetchCategories() {
    const res = await projectApi.getCategories()
    categories.value = res.data
  }

  function setCategory(cat) {
    activeCategory.value = cat
    fetchPublicProjects(cat)
  }

  return {
    projects,
    categories,
    activeCategory,
    loading,
    fetchPublicProjects,
    fetchCategories,
    setCategory
  }
})
