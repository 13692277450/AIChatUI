// fix-env.js (使用 CommonJS)
const fs = require('fs')
const path = require('path')

console.log('=== 修复环境变量配置 ===\n')

const projectDir = process.cwd()
console.log('当前目录:', projectDir)

// 创建正确的 .env.local
const envContent = `VITE_DEEPSEEK_API_KEY=sk-8ac6f7af640e468f90032fea55e94246
VITE_DEEPSEEK_API_URL=https://api.deepseek.com/v1/chat/completions`

const envPath = path.join(projectDir, '.env.local')
fs.writeFileSync(envPath, envContent, 'utf8')
console.log('✅ 已创建 .env.local 文件')

// 检查文件
console.log('\n文件内容:')
console.log(fs.readFileSync(envPath, 'utf8'))

// 创建验证脚本
const verifyScript = `
import.meta.env = import.meta.env || {}
console.log('=== Vite 环境变量检查 ===')
console.log('VITE_DEEPSEEK_API_KEY:', import.meta.env.VITE_DEEPSEEK_API_KEY ? '已设置' : '未设置')
console.log('VITE_DEEPSEEK_API_URL:', import.meta.env.VITE_DEEPSEEK_API_URL || '未设置')

// 手动设置测试
if (!import.meta.env.VITE_DEEPSEEK_API_KEY) {
  console.log('尝试手动设置...')
  import.meta.env.VITE_DEEPSEEK_API_KEY = 'sk-8ac6f7af640e468f90032fea55e94246'
  console.log('手动设置后:', import.meta.env.VITE_DEEPSEEK_API_KEY)
}
`

console.log('\n✅ 修复完成！')
console.log('\n下一步：')
console.log('1. 停止开发服务器 (Ctrl+C)')
console.log('2. 重新启动: npm run dev')
console.log('3. 在浏览器控制台查看环境变量')