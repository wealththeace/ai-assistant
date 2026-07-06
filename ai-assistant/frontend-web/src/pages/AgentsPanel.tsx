import React from 'react'
import { Bot, Code2, BookOpen, Search, Briefcase } from 'lucide-react'

const agents = [
  {
    id: 'general',
    name: 'General Assistant',
    icon: Bot,
    description: 'Your primary companion for daily tasks and conversations',
    color: 'emerald'
  },
  {
    id: 'coding',
    name: 'Coding Agent',
    icon: Code2,
    description: 'Expert software engineer. Debug, generate, and review code',
    color: 'blue'
  },
  {
    id: 'learning',
    name: 'Learning Coach',
    icon: BookOpen,
    description: 'Personalized study plans, quizzes, and adaptive teaching',
    color: 'violet'
  },
  {
    id: 'research',
    name: 'Research Agent',
    icon: Search,
    description: 'Deep research with citations from trusted sources',
    color: 'orange'
  },
  {
    id: 'business',
    name: 'Business Advisor',
    icon: Briefcase,
    description: 'Strategic advice for business, productivity, and growth',
    color: 'rose'
  }
]

export const AgentsPanel: React.FC = () => {
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-semibold">AI Agents</h1>
        <p className="text-zinc-400 mt-2 text-lg">Specialized intelligence that collaborates to help you</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {agents.map(agent => (
          <div 
            key={agent.id}
            className="group bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-3xl p-7 transition flex flex-col"
          >
            <div className={`w-12 h-12 rounded-2xl bg-${agent.color}-500/10 flex items-center justify-center mb-5`}>
              <agent.icon className={`w-6 h-6 text-${agent.color}-400`} />
            </div>
            
            <h3 className="font-semibold text-xl mb-2">{agent.name}</h3>
            <p className="text-zinc-400 flex-1">{agent.description}</p>
            
            <button 
              className="mt-6 w-full py-3 text-sm bg-white/5 hover:bg-white/10 rounded-2xl transition font-medium"
              onClick={() => window.location.href = '/chat'}
            >
              Use {agent.name.split(' ')[0]} Agent
            </button>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center text-xs text-zinc-500">
        Agents can collaborate. Ask the Coding Agent to work with the Research Agent on complex tasks.
      </div>
    </div>
  )
}