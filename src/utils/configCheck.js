// 配置检查工具
export const checkConfig = () => {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY
  const apiUrl = import.meta.env.VITE_DEEPSEEK_API_URL
  
  console.log('=== DeepSeek 配置检查 ===')
  console.log('API密钥:', apiKey ? `${apiKey.substring(0, 8)}...` : '未设置')
  console.log('API端点:', apiUrl || '未设置')
  console.log('环境:', import.meta.env.MODE)
  
  const issues = []
  
  if (!apiKey || apiKey === 'sk-8ac6f7af640e468f90032fea55e94246') {
    issues.push('❌ API密钥未配置或使用默认值')
  } else if (apiKey.length < 20) {
    issues.push('❌ API密钥长度异常，可能无效')
  }
  
  if (!apiUrl) {
    issues.push('❌ API端点未配置')
  }
  
  if (issues.length === 0) {
    console.log('✅ 配置检查通过')
    return { valid: true }
  } else {
    console.log('❌ 配置存在问题:')
    issues.forEach(issue => console.log(issue))
    return { 
      valid: false, 
      issues 
    }
  }
}