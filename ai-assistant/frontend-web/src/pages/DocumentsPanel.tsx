import React, { useState } from 'react'
import { Upload, FileText, Download } from 'lucide-react'

export const DocumentsPanel: React.FC = () => {
  const [documents, setDocuments] = useState([
    { id: '1', name: 'System Design Notes.pdf', type: 'pdf', summary: 'Key concepts around distributed systems and scalability.' },
    { id: '2', name: 'Q2 Business Plan.docx', type: 'docx', summary: 'Growth targets and product roadmap for the next quarter.' }
  ])
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    
    // Simulate upload + analysis
    setTimeout(() => {
      setDocuments(prev => [...prev, {
        id: Date.now().toString(),
        name: file.name,
        type: file.name.split('.').pop() || 'file',
        summary: 'Document analyzed. Key insights extracted and stored in memory.'
      }])
      setIsUploading(false)
    }, 1500)
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-semibold">Documents</h1>
          <p className="text-zinc-400">Upload and chat with your files</p>
        </div>
        
        <label className="cursor-pointer flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 rounded-2xl text-sm font-medium">
          <Upload className="w-4 h-4" />
          Upload Document
          <input type="file" className="hidden" onChange={handleUpload} accept=".pdf,.docx,.txt,.csv,.xlsx" />
        </label>
      </div>

      {isUploading && (
        <div className="mb-6 bg-zinc-900 border border-zinc-800 rounded-3xl p-4 text-sm flex items-center gap-3">
          <div className="animate-spin h-4 w-4 border-2 border-emerald-400 border-t-transparent rounded-full" />
          Analyzing document with AI...
        </div>
      )}

      <div className="space-y-4">
        {documents.map(doc => (
          <div key={doc.id} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex items-start justify-between">
            <div className="flex gap-4">
              <div className="mt-1">
                <FileText className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <div className="font-medium text-lg">{doc.name}</div>
                <div className="text-sm text-zinc-400 mt-1 max-w-lg">{doc.summary}</div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="p-3 hover:bg-zinc-800 rounded-2xl">
                <Download className="w-4 h-4" />
              </button>
              <button 
                onClick={() => window.location.href = '/chat'}
                className="px-4 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 rounded-2xl"
              >
                Ask Questions
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}