import React, { useState } from 'react'
import { Brain, Trash2, Search, ToggleLeft, ToggleRight } from 'lucide-react'

interface Memory {
  id: string
  content: string
  memoryType: string
  importance: number
  createdAt: string
}

export const MemoryPanel: React.FC = () => {
  const [memories, setMemories] = useState<Memory[]>([
    { id: '1', content: 'User prefers concise answers and bullet points', memoryType: 'preference', importance: 0.9, createdAt: '2026-06-20' },
    { id: '2', content: 'Currently learning React Server Components', memoryType: 'fact', importance: 0.75, createdAt: '2026-07-01' },
    { id: '3', content: 'Works at a fintech startup as a senior engineer', memoryType: 'fact', importance: 0.85, createdAt: '2026-05-15' }
  ])
  const [searchTerm, setSearchTerm] = useState('')
  const [memoryEnabled, setMemoryEnabled] = useState(true)

  const filteredMemories = memories.filter(m => 
    m.content.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const deleteMemory = (id: string) => {
    setMemories(prev => prev.filter(m => m.id !== id))
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Brain className="w-9 h-9 text-emerald-400" />
          <div>
            <h1 className="text-3xl font-semibold">Memory</h1>
            <p className="text-zinc-400">Your AI's long-term knowledge about you</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMemoryEnabled(!memoryEnabled)}
            className="flex items-center gap-2 px-4 py-2 bg-zinc-900 rounded-2xl text-sm"
          >
            {memoryEnabled ? <ToggleRight className="text-emerald-400" /> : <ToggleLeft />}
            Memory {memoryEnabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>
      </div>

      <div className="mb-6 relative">
        <Search className="absolute left-5 top-4 text-zinc-500 w-5 h-5" />
        <input
          type="text"
          placeholder="Search memories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-zinc-900 border border-zinc-800 pl-12 py-3.5 rounded-3xl focus:outline-none focus:border-emerald-500"
        />
      </div>

      <div className="space-y-3">
        {filteredMemories.length > 0 ? (
          filteredMemories.map(memory => (
            <div key={memory.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex justify-between items-start group">
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs px-3 py-0.5 bg-zinc-800 rounded-full text-emerald-400">{memory.memoryType}</span>
                  <span className="text-xs text-zinc-500">Importance: {(memory.importance * 100).toFixed(0)}%</span>
                </div>
                <p className="text-lg leading-snug">{memory.content}</p>
                <p className="text-xs text-zinc-500 mt-3">{memory.createdAt}</p>
              </div>
              <button 
                onClick={() => deleteMemory(memory.id)}
                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 p-2"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-zinc-500">No memories found.</div>
        )}
      </div>

      <div className="mt-8 text-center text-xs text-zinc-500">
        Memory is optional. You control everything stored about you.
      </div>
    </div>
  )
}