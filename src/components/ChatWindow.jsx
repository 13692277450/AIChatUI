import React, { useRef, useEffect } from 'react'
import Message from './Message'

const ChatWindow = ({ messages, loading }) => {
  const messagesEndRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="chat-window">
      <div className="messages-container">
        {messages.map((message) => (
          <Message key={message.id} message={message} />
        ))}
        
        {loading && (
          <div className="typing-indicator">
            <div className="typing-dots">
              <div className="dot"></div>
              <div className="dot"></div>
              <div className="dot"></div>
            </div>
            <span>AI正在思考...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}

export default ChatWindow