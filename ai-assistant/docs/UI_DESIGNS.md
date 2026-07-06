# UI/UX Design System - AI Personal Assistant

## Design Philosophy
- **Minimal & Calm**: Dark-first with elegant typography
- **Conversational**: Feels like chatting with a smart human
- **Accessible**: WCAG 2.2 AA compliant
- **Fluid**: Smooth animations, responsive on all devices

## Color Palette

**Dark Mode (Primary)**
- Background: `#0a0a0a`
- Surface: `#121212`
- Elevated: `#1f1f1f`
- Accent: `#10b981` (emerald-500)
- Text Primary: `#fafafa`
- Text Secondary: `#a1a1aa`

**Light Mode**
- Background: `#fafafa`
- Accent: `#059669`

## Typography
- Headings: Inter / Satoshi
- Body: Inter / System UI
- Code: JetBrains Mono

## Key Screens

### 1. Chat Interface
- Floating AI avatar
- Message bubbles with subtle shadows
- Real-time typing indicator
- Action toolbar: Mic | Screen Share | Attach | Agents

### 2. Workspace Mode (Split View)
- Left: Chat
- Right: Document / Screen preview / Code editor
- Drag to resize

### 3. Memory Dashboard
- Cards for each memory
- Search + filter by type
- Toggle memory on/off globally

### 4. Agent Selector
- Beautiful horizontal scroll of agent cards
- Active agent highlighted

### 5. Settings & Privacy
- Granular permission toggles with explanations
- Data export / delete buttons

## Components Library

- `ChatBubble`
- `VoiceWaveform`
- `ScreenPreview`
- `AgentCard`
- `MemoryItem`
- `PermissionToggle`
- `StreamingText`

## Mobile Specific
- Bottom sheet for agent selection
- Gesture navigation
- Large touch targets

## Accessibility
- High contrast mode
- Screen reader labels
- Keyboard navigation everywhere
- Focus management

---

**Figma link (future):** https://figma.com/ai-assistant-design-system