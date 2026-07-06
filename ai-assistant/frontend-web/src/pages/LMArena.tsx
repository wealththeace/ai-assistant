import React, { useState } from 'react'
import { Swords, Users, Zap, Trophy } from 'lucide-react'

type ArenaMode = 'direct' | 'battle' | 'agent' | 'tournament'

interface ModelOption {
  id: string
  name: string
  provider: string
}

const availableModels: ModelOption[] = [
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic' },
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI' },
  { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'Google' },
  { id: 'llama-3.3-70b', name: 'Llama 3.3 70B', provider: 'Meta (Ollama)' },
  { id: 'qwen2.5-72b', name: 'Qwen2.5 72B', provider: 'Alibaba' }
]

export const LMArena: React.FC = () => {
  const [mode, setMode] = useState<ArenaMode>('battle')
  const [prompt, setPrompt] = useState('')
  const [selectedModels, setSelectedModels] = useState<string[]>(['claude-3-5-sonnet', 'gpt-4o'])
  const [isRunning, setIsRunning] = useState(false)
  const [results, setResults] = useState<any[]>([])

  const toggleModel = (modelId: string) => {
    if (selectedModels.includes(modelId)) {
      if (selectedModels.length > 1) {
        setSelectedModels(selectedModels.filter(m => m !== modelId))
      }
    } else {
      setSelectedModels([...selectedModels, modelId])
    }
  }

  const runArena = async () => {
    if (!prompt.trim()) return

    setIsRunning(true)
    setResults([])

    // Simulate multi-model battle
    const mockResults = await Promise.all(
      selectedModels.map(async (modelId, index) => {
        await new Promise(res => setTimeout(res, 800 + index * 400))
        
        const model = availableModels.find(m => m.id === modelId)!
        
        return {
          model: model.name,
          provider: model.provider,
          response: index === 0 
            ? `Claude's thoughtful response to: "${prompt}". This model tends to be more careful and structured.`
            : `GPT-4o's response: "${prompt}". This model is generally faster and more creative.`,
          tokens: 180 + Math.floor(Math.random() * 80),
          latency: 1200 + Math.floor(Math.random() * 600),
          score: 8.2 + Math.random() * 1.3
        }
      })
    )

    setResults(mockResults)
    setIsRunning(false)
  }

  const getModeIcon = (m: ArenaMode) => {
    if (m === 'battle') return <Swords className="w-5 h-5" />
    if (m === 'agent') return <Users className="w-5 h-5" />
    if (m === 'tournament') return <Trophy className="w-5 h-5" />
    return <Zap className="w-5 h-5" />
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Swords className="w-10 h-10 text-emerald-400" />
        <div>
          <h1 className="text-4xl font-semibold">LM Arena</h1>
          <p className="text-zinc-400 mt-1">Compare models head-to-head • Battle • Agent collaboration</p>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="flex gap-2 mb-8 bg-zinc-900 p-1 rounded-3xl w-fit">
        {(['direct', 'battle', 'agent', 'tournament'] as ArenaMode[]).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-3xl text-sm font-medium transition ${mode === m ? 'bg-emerald-600' : 'hover:bg-zinc-800'}`}
          >
            {getModeIcon(m)}
            {m.charAt(0).toUpperCase() + m.slice(1)} Mode
          </button>
        ))}
      </div>

      {/* Model Selection */}
      <div className="mb-8">
        <div className="text-sm text-zinc-400 mb-3">Select models to compare ({selectedModels.length} selected)</div>
        <div className="flex flex-wrap gap-3">
          {availableModels.map(model => (
            <button
              key={model.id}
              onClick={() => toggleModel(model.id)}
              className={`px-5 py-2 rounded-2xl border text-sm transition ${selectedModels.includes(model.id) 
                ? 'bg-emerald-600 border-emerald-500' 
                : 'bg-zinc-900 border-zinc-700 hover:border-zinc-600'}`}
            >
              {model.name}
              <span className="text-[10px] ml-2 opacity-60">({model.provider})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Prompt Input */}
      <div className="mb-6">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt for the arena battle..."
          className="w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-6 text-lg min-h-[120px] focus:outline-none focus:border-emerald-500"
        />
      </div>

      <button
        onClick={runArena}
        disabled={isRunning || !prompt.trim() || selectedModels.length < 1}
        className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-zinc-700 px-10 py-4 rounded-3xl text-lg font-medium flex items-center gap-3"
      >
        {isRunning ? 'Running Arena...' : `Run ${mode.charAt(0).toUpperCase() + mode.slice(1)} Arena`}
        <Swords className="w-5 h-5" />
      </button>

      {/* Results */}
      {results.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Arena Results</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {results.map((result, index) => (
              <div key={index} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-7">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="font-semibold text-xl">{result.model}</div>
                    <div className="text-xs text-emerald-400">{result.provider}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-emerald-400 text-sm">Score: {result.score.toFixed(1)}</div>
                    <div className="text-xs text-zinc-500">{result.latency}ms • {result.tokens} tokens</div>
                  </div>
                </div>
                
                <div className="text-zinc-300 leading-relaxed text-[15px]">
                  {result.response}
                </div>
              </div>
            ))}
          </div>

          {mode === 'battle' && results.length >= 2 && (
            <div className="mt-8 p-6 bg-zinc-900 border border-zinc-800 rounded-3xl text-center">
              <div className="text-emerald-400 font-medium mb-1">Battle Winner</div>
              <div className="text-2xl font-semibold">
                {results.sort((a, b) => b.score - a.score)[0].model}
              </div>
              <div className="text-sm text-zinc-400 mt-1">Based on response quality, speed, and depth</div>
            </div>
          )}
        </div>
      )}

      {/* Mode Descriptions */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
        {[
          { mode: 'direct', desc: 'Single model response' },
          { mode: 'battle', desc: 'Head-to-head comparison' },
          { mode: 'agent', desc: 'Multiple agents debate' },
          { mode: 'tournament', desc: 'Multi-round elimination' }
        ].map(item => (
          <div key={item.mode} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <div className="font-medium mb-1">{item.mode.charAt(0).toUpperCase() + item.mode.slice(1)} Mode</div>
            <div className="text-zinc-400">{item.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}