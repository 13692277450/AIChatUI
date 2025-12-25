import OpenAI from 'openai'

// 创建OpenAI客户端（DeepSeek兼容）
const createDeepSeekClient = () => {
  const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY
  
  if (!apiKey || apiKey === '8ac6f7af640e468f90032fea55e94246') {
    console.warn('⚠️ DeepSeek API密钥未配置，请设置 VITE_DEEPSEEK_API_KEY')
    return null
  }

  console.log('🔧 创建DeepSeek客户端，密钥:', apiKey.substring(0, 8) + '...')
  
  return new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: apiKey,
    dangerouslyAllowBrowser: true  // 前端使用需要这个选项
  })
}

// 全局客户端实例
let client = null

export const getDeepSeekClient = () => {
  if (!client) {
    client = createDeepSeekClient()
  }
  return client
}

// 发送消息到DeepSeek
export const sendMessageToDeepSeek = async (messages, options = {}) => {
  try {
    const deepseekClient = getDeepSeekClient()
    
    if (!deepseekClient) {
      throw new Error('DeepSeek客户端未初始化，请检查API密钥配置')
    }

    console.log('📤 发送消息到DeepSeek:', {
      消息数量: messages.length,
      模型: options.model || 'deepseek-chat',
      最大tokens: options.max_tokens || 2000
    })

    const completion = await deepseekClient.chat.completions.create({
      model: options.model || 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: `你是DeepSeek AI助手，一个智能的语言模型。
          请以友好、专业、乐于助人的方式回答用户的问题。
          当前时间：${new Date().toLocaleString('zh-CN')}
          请优先使用中文回答，除非用户要求其他语言。`
        },
        ...messages
      ],
      max_tokens: options.max_tokens || 2000,
      temperature: options.temperature || 0.7,
      stream: options.stream || false,
    })

    console.log('✅ DeepSeek响应:', completion.choices[0].message)
    
    return {
      success: true,
      content: completion.choices[0].message.content,
      usage: completion.usage
    }
    
  } catch (error) {
    console.error('❌ DeepSeek API错误:', error)
    
    let errorMessage = '未知错误'
    
    if (error.response) {
      // OpenAI SDK的错误格式
      console.error('错误状态:', error.response.status)
      console.error('错误数据:', error.response.data)
      
      switch (error.response.status) {
        case 401:
          errorMessage = 'API密钥无效或已过期'
          break
        case 429:
          errorMessage = '请求过于频繁，请稍后再试'
          break
        default:
          errorMessage = error.response.data?.error?.message || `API错误: ${error.response.status}`
      }
    } else if (error.message) {
      errorMessage = error.message
    }
    
    throw new Error(`DeepSeek API错误: ${errorMessage}`)
  }
}

// 测试API连接
export const testDeepSeekConnection = async () => {
  try {
    const deepseekClient = getDeepSeekClient()
    
    if (!deepseekClient) {
      return {
        success: false,
        message: 'API客户端未初始化'
      }
    }

    console.log('🔍 测试DeepSeek API连接...')
    
    const completion = await deepseekClient.chat.completions.create({
      model: 'deepseek-chat',
      messages: [{ role: 'user', content: 'Hello' }],
      max_tokens: 5,
    })

    console.log('✅ 连接测试成功:', completion.choices[0].message.content)
    
    return {
      success: true,
      message: 'API连接成功'
    }
    
  } catch (error) {
    console.error('❌ 连接测试失败:', error)
    
    return {
      success: false,
      message: error.message || '连接测试失败'
    }
  }
}