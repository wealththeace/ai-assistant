import React, { useState, useRef, useEffect } from 'react'
import { Send, Mic, ScreenShare, Bot, Pause } from 'lucide-react'
import { streamChatMessage } from '../services/api'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I'm your AI Personal Assistant. How can I help you today?" }
  ])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [isScreenSharing, setIsScreenSharing] = useState(false)
  const [currentAgent, setCurrentAgent] = useState('general')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return

    const userMessage: Message = { role: 'user', content: input }
    setMessages(prev => [...prev, userMessage])
    const currentInput = input
    setInput('')
    setIsStreaming(true)

    // Add empty assistant message for streaming
    const assistantMessageIndex = messages.length + 1
    setMessages(prev => [...prev, { role: 'assistant', content: '' }])

    try {
      let fullResponse = ''
      
      for await (const chunk of streamChatMessage(currentInput, undefined, currentAgent)) {
        if (chunk.type === 'token') {
          fullResponse += chunk.content
          setMessages(prev => {
            const newMessages = [...prev]
            newMessages[assistantMessageIndex] = {
              role: 'assistant',
              content: fullResponse
            }
            return newMessages
          })
        } else if (chunk.type === 'done') {
          break
        }
      }
    } catch (error) {
      console.error('Streaming error:', error)
      setMessages(prev => {
        const newMessages = [...prev]
        newMessages[assistantMessageIndex] = {
          role: 'assistant',
          content: "I'm having trouble connecting right now. Please try again."
        }
        return newMessages
      })
    } finally {
      setIsStreaming(false)
    }
  }

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing)
    if (!isScreenSharing) {
      // Simulate screen analysis
      setTimeout(() => {
        const screenMsg = { 
          role: 'assistant' as const, 
          content: "I've started analyzing your screen. What would you like me to look for?" 
        }
        setMessages(prev => [...prev, screenMsg])
      }, 800)
    }
  }

  const changeAgent = (agent: string) => {
    setCurrentAgent(agent)
    const agentMsg = { 
      role: 'assistant' as const, 
      content: `Switched to ${agent.charAt(0).toUpperCase() + agent.slice(1)} Agent. How can I assist you?` 
    }
    setMessages(prev => [...prev, agentMsg])
  }

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-white">
      {/* Header */}
      <div className="border-b border-zinc-800 p-4 flex items-center justify-between bg-zinc-950/80 backdrop-blur">
        <div className="flex items-center gap-3">
          <Bot className="w-8 h-8 text-emerald-400" />
          <div>
            <h1 className="font-semibold text-xl">AI Assistant</h1>
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span>Claude 3.5 Sonnet</span>
              <span>•</span>
              <span className="text-emerald-400">Online</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Agent Selector */}
          <div className="flex bg-zinc-900 rounded-2xl p-1 text-sm">
            {['general', 'coding', 'learning', 'research'].map(agent => (
              <button
                key={agent}
                onClick={() => changeAgent(agent)}
                className={`px-4 py-1.5 rounded-xl transition ${currentAgent === agent ? 'bg-emerald-600 text-white' : 'hover:bg-zinc-800'}`}
              >
                {agent.charAt(0).toUpperCase() + agent.slice(1)}
              </button>
            ))}
          </div>

          <button 
            onClick={toggleScreenShare}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl transition text-sm ${isScreenSharing ? 'bg-red-600' : 'bg-zinc-800 hover:bg-zinc-700'}`}
          >
            <ScreenShare className="w-4 h-4" />
            {isScreenSharing ? 'Stop Sharing' : 'Share Screen'}
          </button>
          
          <button className="p-3 bg-zinc-800 rounded-2xl hover:bg-zinc-700">
            <Mic className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] px-5 py-4 rounded-3xl text-[15px] leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-emerald-600 text-white' 
                : 'bg-zinc-900 border border-zinc-800'
            }`}>
              {msg.content}
              {isStreaming && index === messages.length - 1 && msg.role === 'assistant' && (
                <span className="inline-block w-1.5 h-4 bg-emerald-400 ml-1 animate-pulse" />
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="border-t border-zinc-800 p-4 bg-zinc-950">
        <div className="flex gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={`Message ${currentAgent} agent...`}
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-3xl px-6 py-4 text-lg focus:outline-none focus:border-emerald-500 placeholder:text-zinc-500"
            disabled={isStreaming}
          />
          <button 
            onClick={sendMessage}
            disabled={isStreaming || !input.trim()}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-700 px-8 rounded-3xl flex items-center justify-center transition"
          >
            {isStreaming ? <Pause className="w-5 h-5" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
        <p className="text-center text-[10px] text-zinc-500 mt-3">
          Real-time streaming • Screen analysis • Voice ready
        </p>
      </div>
    </div>
  )
}