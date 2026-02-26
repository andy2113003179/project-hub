<template>
  <div class="tool-placeholder">
    <div class="placeholder-content">
      <div class="icon">🛠️</div>
      <h3>工具页面</h3>
      <p>路由路径：<code>/main/{{ $route.params.tool }}</code></p>
      <p class="hint">在 <code>src/router/index.js</code> 中添加新的子路由，<br>并在 <code>src/views/main/</code> 目录下创建对应的 Vue 组件即可集成新工具</p>
      <el-button type="primary" @click="$router.push('/main/dashboard')">返回控制台</el-button>
    </div>
  </div>
</template>

<style scoped>
.tool-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.placeholder-content {
  text-align: center;
  padding: 48px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
}

.icon {
  font-size: 64px;
  margin-bottom: 16px;
}

h3 {
  font-size: 20px;
  font-weight: 700;
  color: #333;
  margin-bottom: 12px;
}

p {
  color: #888;
  margin-bottom: 8px;
  line-height: 1.6;
}

.hint {
  font-size: 13px;
  background: #f5f7fa;
  padding: 12px 20px;
  border-radius: 8px;
  margin: 16px 0;
  text-align: left;
}

code {
  background: #e8ecff;
  color: #667eea;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: monospace;
}
</style>
