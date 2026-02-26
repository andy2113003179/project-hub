const express = require('express')
const router = express.Router()
const Project = require('../models/Project')
const { Op } = require('sequelize')

// 获取所有项目（首页用，只返回可见的）
router.get('/public', async (req, res) => {
  try {
    const { category } = req.query
    const where = { visible: true }
    if (category && category !== '全部') {
      where.category = category
    }
    const projects = await Project.findAll({
      where,
      order: [['sort', 'ASC'], ['createdAt', 'DESC']]
    })
    res.json({ code: 200, data: projects })
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message })
  }
})

// 获取所有分类
router.get('/categories', async (req, res) => {
  try {
    const projects = await Project.findAll({
      attributes: ['category'],
      group: ['category']
    })
    const categories = ['全部', ...projects.map(p => p.category).filter(Boolean)]
    res.json({ code: 200, data: [...new Set(categories)] })
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message })
  }
})

// 管理后台 - 获取所有项目（带分页和搜索）
router.get('/', async (req, res) => {
  try {
    const { page = 1, pageSize = 10, keyword, category } = req.query
    const where = {}
    if (keyword) {
      where[Op.or] = [
        { name: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } }
      ]
    }
    if (category && category !== '全部') {
      where.category = category
    }
    const { count, rows } = await Project.findAndCountAll({
      where,
      order: [['sort', 'ASC'], ['createdAt', 'DESC']],
      limit: Number(pageSize),
      offset: (Number(page) - 1) * Number(pageSize)
    })
    res.json({
      code: 200,
      data: { list: rows, total: count, page: Number(page), pageSize: Number(pageSize) }
    })
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message })
  }
})

// 获取单个项目
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id)
    if (!project) return res.status(404).json({ code: 404, message: '项目不存在' })
    res.json({ code: 200, data: project })
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message })
  }
})

// 创建项目
router.post('/', async (req, res) => {
  try {
    const project = await Project.create(req.body)
    res.json({ code: 200, data: project, message: '创建成功' })
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message })
  }
})

// 更新项目
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id)
    if (!project) return res.status(404).json({ code: 404, message: '项目不存在' })
    await project.update(req.body)
    res.json({ code: 200, data: project, message: '更新成功' })
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message })
  }
})

// 删除项目
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findByPk(req.params.id)
    if (!project) return res.status(404).json({ code: 404, message: '项目不存在' })
    await project.destroy()
    res.json({ code: 200, message: '删除成功' })
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message })
  }
})

// 批量更新排序
router.post('/sort/batch', async (req, res) => {
  try {
    const { items } = req.body
    await Promise.all(items.map(item => Project.update({ sort: item.sort }, { where: { id: item.id } })))
    res.json({ code: 200, message: '排序更新成功' })
  } catch (err) {
    res.status(500).json({ code: 500, message: err.message })
  }
})

module.exports = router
