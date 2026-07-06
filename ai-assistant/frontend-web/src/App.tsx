import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ChatInterface } from './pages/ChatInterface'
import { Dashboard } from './pages/Dashboard'
import { MemoryPanel } from './pages/MemoryPanel'
import { AgentsPanel } from './pages/AgentsPanel'
import { DocumentsPanel } from './pages/DocumentsPanel'
import { LMArena } from './pages/LMArena'
import { Layout } from './components/Layout'

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/chat" element={<ChatInterface />} />
          <Route path="/memory" element={<MemoryPanel />} />
          <Route path="/agents" element={<AgentsPanel />} />
          <Route path="/documents" element={<DocumentsPanel />} />
          <Route path="/arena" element={<LMArena />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App