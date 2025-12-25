import React, { useState, useEffect } from 'react'

const DebugInfo = () => {
  const [config, setConfig] = useState({})
  const [showDebug, setShowDebug] = useState(false)

  useEffect(() => {
    // 收集所有环境变量
    setConfig({
      apiKey: import.meta.env.VITE_DEEPSEEK_API_KEY,
      apiUrl: import.meta.env.VITE_DEEPSEEK_API_URL,
      mode: import.meta.env.MODE,
      baseUrl: import.meta.env.BASE_URL,
      // 检查所有可能的API键名
      envKeys: Object.keys(import.meta.env).filter(key => key.includes('API') || key.includes('KEY')),
      allEnv: Object.keys(import.meta.env)
    })
  }, [])

  const testApiKey = () => {
    const key = import.meta.env.VITE_DEEPSEEK_API_KEY
    if (!key) {
      alert('❌ API密钥未找到')
      return
    }
    
    console.log('API密钥信息:')
    console.log('完整密钥:', key)
    console.log('密钥长度:', key.length)
    console.log('前8位:', key.substring(0, 8))
    console.log('是否包含 sk-:', key.includes('sk-'))
    
    alert(`✅ API密钥检测成功\n长度: ${key.length} 字符\n前8位: ${key.substring(0, 8)}...`)
  }

  if (!showDebug) {
    return (
      <button 
        onClick={() => setShowDebug(true)}
        className="debug-toggle"
      >
        <i className="fas fa-bug"></i> 显示调试信息
      </button>
    )
  }

  return (
    <div className="debug-info">
      <div className="debug-header">
        <h3><i className="fas fa-bug"></i> 配置调试信息</h3>
        <button onClick={() => setShowDebug(false)} className="close-btn">
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      <div className="debug-content">
        <div className="config-section">
          <h4>环境变量</h4>
          <table>
            <tbody>
              <tr>
                <td>VITE_DEEPSEEK_API_KEY:</td>
                <td className={config.apiKey ? 'valid' : 'invalid'}>
                  {config.apiKey 
                    ? `${config.apiKey.substring(0, 8)}... (${config.apiKey.length} 字符)`
                    : '未设置'}
                </td>
              </tr>
              <tr>
                <td>VITE_DEEPSEEK_API_URL:</td>
                <td className={config.apiUrl ? 'valid' : 'invalid'}>
                  {config.apiUrl || '未设置'}
                </td>
              </tr>
              <tr>
                <td>运行模式:</td>
                <td>{config.mode}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="actions">
          <button onClick={testApiKey} className="test-btn">
            <i className="fas fa-vial"></i> 测试API密钥
          </button>
          <button onClick={() => {
            console.log('完整环境变量:', import.meta.env)
            alert('已在控制台输出完整环境变量')
          }} className="test-btn">
            <i className="fas fa-terminal"></i> 查看所有变量
          </button>
        </div>
        
        <div className="tips">
          <h4><i className="fas fa-lightbulb"></i> 解决建议</h4>
          <ul>
            <li>确保 .env.local 文件在项目根目录</li>
            <li>重启开发服务器: <code>npm run dev</code></li>
            <li>检查文件名是否正确（没有.txt扩展名）</li>
            <li>清除浏览器缓存并硬刷新 (Ctrl+F5)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default DebugInfo