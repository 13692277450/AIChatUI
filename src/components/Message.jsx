import React, { useState } from 'react'

const Message = ({ message }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className={`message ${message.role}`}>
      <div className="message-header">
        <div className="avatar">
          {message.role === 'user' ? (
            <i className="fas fa-user"></i>
          ) : (
            <i className="fas fa-robot"></i>
          )}
        </div>
        <div className="message-info">
          <span className="sender">
            {message.role === 'user' ? '您' : 'DeepSeek AI'}
          </span>
          <span className="time">{formatTime(message.timestamp)}</span>
        </div>
        
        {message.role === 'assistant' && (
          <button 
            className="copy-btn" 
            onClick={handleCopy}
            title="复制"
          >
            <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
          </button>
        )}
      </div>
      
      <div className="message-content">
        {message.content}
      </div>
    </div>
  )
}

export default Message