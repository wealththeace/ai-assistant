import React from 'react'
import { Bot, Mic, ScreenShare, BookOpen, Users, TrendingUp } from 'lucide-react'

export const Dashboard: React.FC = () => {
  const stats = [
    { label: "Conversations", value: "142", change: "+23" },
    { label: "Memories Stored", value: "87", change: "+12" },
    { label: "Screen Sessions", value: "34", change: "+8" },
    { label: "Learning Hours", value: "19.5", change: "+4.2" }
  ]

  const quickActions = [
    { icon: Mic, label: "Voice Chat", color: "emerald" },
    { icon: ScreenShare, label: "Share Screen", color: "blue" },
    { icon: BookOpen, label: "Start Learning", color: "violet" },
    { icon: Users, label: "Collaborate", color: "orange" }
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-10">
        <h1 className="text-4xl font-semibold tracking-tight">Good evening, Alex.</h1>
        <p className="text-zinc-400 mt-2 text-lg">Your AI second brain is ready to help.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <div className="text-sm text-zinc-400">{stat.label}</div>
            <div className="text-4xl font-semibold mt-2">{stat.value}</div>
            <div className="text-emerald-400 text-sm mt-1">{stat.change} this week</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-10">
        <h2 className="text-xl font-medium mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <button 
              key={index}
              className="flex flex-col items-center justify-center gap-3 p-8 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-3xl transition group"
            >
              <action.icon className={`w-8 h-8 text-${action.color}-400 group-hover:scale-110 transition`} />
              <span className="font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-medium mb-4">Recent Activity</h2>
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl divide-y divide-zinc-800">
          {[
            "Analyzed Figma prototype and suggested improvements",
            "Created study plan for System Design interview",
            "Debugged React performance issue",
            "Summarized 45-minute YouTube video on AI agents"
          ].map((activity, i) => (
            <div key={i} className="px-6 py-4 flex items-center gap-4 text-sm">
              <Bot className="w-4 h-4 text-emerald-400" />
              {activity}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}