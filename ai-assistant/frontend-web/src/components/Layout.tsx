import React from 'react'
import { NavLink } from 'react-router-dom'
import { Bot, Home, MessageCircle, Brain, Users, FileText, Swords } from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navItems = [
    { to: '/', icon: Home, label: 'Dashboard' },
    { to: '/chat', icon: MessageCircle, label: 'Chat' },
    { to: '/memory', icon: Brain, label: 'Memory' },
    { to: '/agents', icon: Users, label: 'Agents' },
    { to: '/documents', icon: FileText, label: 'Documents' },
    { to: '/arena', icon: Swords, label: 'LM Arena' },
  ]

  return (
    <div className="flex h-screen bg-zinc-950 text-white">
      {/* Sidebar */}
      <div className="w-64 border-r border-zinc-800 bg-zinc-950 flex flex-col">
        <div className="p-6 border-b border-zinc-800 flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-500 rounded-2xl flex items-center justify-center">
            <Bot className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="font-semibold">AI Assistant</div>
            <div className="text-[10px] text-emerald-400">v1.0 • Production</div>
          </div>
        </div>

        <nav className="p-3 flex-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-2xl mb-1 text-sm transition ${isActive 
                  ? 'bg-emerald-600 text-white' 
                  : 'hover:bg-zinc-900 text-zinc-400'}`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 text-xs px-4 py-2 text-zinc-400">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            All systems operational
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  )
}