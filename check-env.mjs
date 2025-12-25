import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('=== DeepSeek 环境变量检查 ===\n')
console.log('项目目录:', __dirname)

// 检查文件列表
const files = fs.readdirSync(__dirname)
console.log('\n项目根目录文件:')
files.forEach(file => {
  const stats = fs.statSync(path.join(__dirname, file))
  console.log(`  ${file} ${stats.isDirectory() ? '(目录)' : `(${stats.size} bytes)`}`)
})

// 检查 .env.local
const envPath = path.join(__dirname, '.env.local')
console.log('\n=== 检查 .env.local 文件 ===')

if (fs.existsSync(envPath)) {
  console.log('✅ 找到 .env.local 文件')
  const content = fs.readFileSync(envPath, 'utf8')
  console.log('文件大小:', content.length, '字符')
  
  // 显示原始内容（隐藏部分密钥）
  console.log('\n文件内容:')
  const lines = content.split('\n')
  lines.forEach((line, i) => {
    if (line.trim()) {
      if (line.includes('API_KEY')) {
        const [key, value] = line.split('=')
        if (value) {
          console.log(`  ${key}=${value.substring(0, Math.min(10, value.length))}...`)
        }
      } else {
        console.log(`  ${line}`)
      }
    }
  })
  
  // 详细分析
  console.log('\n=== 详细分析 ===')
  const validLines = lines.filter(line => 
    line.trim() && 
    !line.startsWith('#') && 
    line.includes('=')
  )
  
  validLines.forEach(line => {
    const [key, ...values] = line.split('=')
    const value = values.join('=')
    console.log(`\n变量: ${key.trim()}`)
    console.log(`  值: ${value.substring(0, 20)}...`)
    console.log(`  长度: ${value.length} 字符`)
    
    if (key.trim() === 'VITE_DEEPSEEK_API_KEY') {
      if (value === 'sk-8ac6f7af640e468f90032fea55e94246') {
        console.log('  ❌ 状态: 使用默认值，请替换为真实密钥')
      } else if (value.startsWith('sk-')) {
        console.log('  ✅ 状态: 格式正确 (以 sk- 开头)')
      } else {
        console.log('  ⚠️ 状态: 格式可能不正确 (应以 sk- 开头)')
      }
    }
  })
} else {
  console.log('❌ 未找到 .env.local 文件')
  console.log('创建位置:', envPath)
  
  // 创建示例文件
  const exampleContent = `VITE_DEEPSEEK_API_KEY=sk-8ac6f7af640e468f90032fea55e94246
VITE_DEEPSEEK_API_URL=https://api.deepseek.com/`
  
  fs.writeFileSync(envPath + '.example', exampleContent)
  console.log('已创建示例文件:', envPath + '.example')
}

// 检查 package.json
console.log('\n=== 检查 package.json ===')
const packagePath = path.join(__dirname, 'package.json')
if (fs.existsSync(packagePath)) {
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'))
  console.log('项目名称:', pkg.name)
  console.log('运行命令:', Object.keys(pkg.scripts || {}))
} else {
  console.log('❌ 未找到 package.json')
}