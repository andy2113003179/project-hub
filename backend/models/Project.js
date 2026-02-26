const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const Project = sequelize.define('Project', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '项目名称'
  },
  description: {
    type: DataTypes.TEXT,
    comment: '项目描述'
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: '项目访问地址'
  },
  image: {
    type: DataTypes.STRING,
    comment: '封面图片路径'
  },
  category: {
    type: DataTypes.STRING,
    defaultValue: '默认',
    comment: '分类'
  },
  tags: {
    type: DataTypes.STRING,
    comment: '标签，逗号分隔',
    get() {
      const raw = this.getDataValue('tags')
      return raw ? raw.split(',').filter(Boolean) : []
    },
    set(val) {
      this.setDataValue('tags', Array.isArray(val) ? val.join(',') : val)
    }
  },
  sort: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    comment: '排序，数值越小越靠前'
  },
  visible: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    comment: '是否在首页展示'
  },
  color: {
    type: DataTypes.STRING,
    defaultValue: '#409eff',
    comment: '卡片主题色'
  }
}, {
  tableName: 'projects',
  timestamps: true
})

module.exports = Project
