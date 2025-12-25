import React, { useState, useRef, useEffect } from 'react'
import ChatWindow from './components/ChatWindow'
import { sendMessageToDeepSeek, testDeepSeekConnection } from './services/deepseekApi'
import './styles.css'

function App() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: 'assistant',
      content: '你好！我是DeepSeek AI助手，有什么可以帮您的吗？',
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [apiStatus, setApiStatus] = useState('checking')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
    checkApiConnection()
  }, [])

  const checkApiConnection = async () => {
    setApiStatus('checking')
    console.log('🔄 检查API连接...')
    
    const result = await testDeepSeekConnection()
    
    if (result.success) {
      setApiStatus('connected')
      console.log('✅ API连接正常')
    } else {
      setApiStatus('disconnected')
      console.log('❌ API连接失败:', result.message)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      console.log('🚀 开始发送消息...')
      
      // 准备消息（排除系统消息）
      const chatMessages = messages
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      
      chatMessages.push({ role: 'user', content: input.trim() })

      // 调用DeepSeek API
      const result = await sendMessageToDeepSeek(chatMessages, {
        model: 'deepseek-chat',
        max_tokens: 2000,
        temperature: 0.7
      })

      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: result.content,
        timestamp: new Date(),
      }
      
      setMessages(prev => [...prev, aiMessage])
      setApiStatus('connected')
      
      console.log('✅ 消息发送成功')
      
    } catch (error) {
      console.error('❌ 发送消息失败:', error)
      
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: `抱歉，发送消息时出错：${error.message}`,
        timestamp: new Date(),
        isError: true,
      }
      
      setMessages(prev => [...prev, errorMessage])
      setApiStatus('disconnected')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const clearChat = () => {
    setMessages([{
      id: 1,
      role: 'assistant',
      content: '你好！我是DeepSeek AI助手，有什么可以帮您的吗？',
      timestamp: new Date(),
    }])
  }

  const reconnectApi = async () => {
    await checkApiConnection()
  }

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <i className="fas fa-brain"></i>
          <h1>DeepSeek AI</h1>
        </div>
        
        <div className="header-controls">
          <div className={`api-status ${apiStatus}`}>
            <span className={`status-dot ${apiStatus}`}></span>
            <span>
              {apiStatus === 'connected' && 'API已连接'}
              {apiStatus === 'disconnected' && 'API未连接'}
              {apiStatus === 'checking' && '检查连接...'}
            </span>
            {apiStatus !== 'connected' && (
              <button onClick={reconnectApi} className="reconnect-btn">
                <i className="fas fa-sync-alt"></i>
              </button>
            )}
          </div>
          
          <button 
            className="debug-btn"
            onClick={() => {
              console.log('=== 调试信息 ===')
              console.log('消息数量:', messages.length)
              console.log('API状态:', apiStatus)
              console.log('输入内容:', input)
              console.log('加载状态:', loading)
            }}
          >
            <i className="fas fa-bug"></i>
          </button>
        </div>
      </header>

      <main className="main">
        <ChatWindow messages={messages} loading={loading} />
        
        <div className="input-area">
          <div className="input-container">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="输入您的问题..."
              rows="3"
              disabled={loading || apiStatus === 'checking'}
            />
            
            <div className="input-actions">
              <button 
                className="clear-btn" 
                onClick={clearChat}
                disabled={messages.length <= 1}
              >
                <i className="fas fa-trash"></i> 清空
              </button>
              
              <button 
                className="send-btn" 
                onClick={sendMessage}
                disabled={!input.trim() || loading || apiStatus !== 'connected'}
              >
                {loading ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <i className="fas fa-paper-plane"></i>
                )}
                发送
              </button>
            </div>
          </div>
          
          <div className="hint">
            <i className="fas fa-lightbulb"></i>
            {apiStatus === 'connected' 
              ? 'API已连接，可以开始对话' 
              : apiStatus === 'disconnected'
                ? 'API连接失败，请检查控制台错误'
                : '正在检查API连接...'}
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>
          Powered by DeepSeek API | 
          使用OpenAI兼容SDK |
          {apiStatus === 'connected' ? ' ✅ 已连接' : ' ❌ 未连接'}
        </p>
      </footer>
    </div>
  )
}

export default App