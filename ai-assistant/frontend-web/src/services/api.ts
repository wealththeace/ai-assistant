const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

export async function sendChatMessage(message: string, conversationId?: string, agent = 'general') {
  const res = await fetch(`${API_BASE}/chat/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token') || 'demo-token'}`
    },
    body: JSON.stringify({ message, conversation_id: conversationId, agent })
  });
  return res.json();
}

export async function* streamChatMessage(message: string, conversationId?: string, agent = 'general') {
  const res = await fetch(`${API_BASE}/chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token') || 'demo-token'}`
    },
    body: JSON.stringify({ message, conversation_id: conversationId, agent })
  });

  const reader = res.body?.getReader();
  if (!reader) return;

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const data = JSON.parse(line.slice(6));
          yield data;
        } catch (e) {
          console.error('Parse error', e);
        }
      }
    }
  }
}