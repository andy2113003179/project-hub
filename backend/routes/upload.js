const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const uploadDir = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`
    cb(null, name)
  }
})

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp|svg/
  if (allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('只支持图片文件 (jpg/png/gif/webp/svg)'))
  }
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
})

router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ code: 400, message: '未收到文件' })
  }
  const url = `/uploads/${req.file.filename}`
  res.json({ code: 200, data: { url }, message: '上传成功' })
})

// 删除图片
router.delete('/', (req, res) => {
  const { filename } = req.body
  if (!filename) return res.status(400).json({ code: 400, message: '文件名不能为空' })
  const filePath = path.join(uploadDir, filename)
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath)
    res.json({ code: 200, message: '删除成功' })
  } else {
    res.status(404).json({ code: 404, message: '文件不存在' })
  }
})

module.exports = router
