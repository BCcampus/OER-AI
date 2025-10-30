import { BrowserRouter, Routes, Route } from 'react-router'
import AIChatPage from './pages/ChatInterface/ChatInterface'
import HomePage from './pages/HomePage'
import { ModeProvider } from '@/providers/ModeContext'
import PracticeMaterialPage from './pages/PracticeMaterial/PracticeMaterialPage'

function App() {
  return (
    <ModeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PracticeMaterialPage />} />
          <Route path="/textbook/:id/chat" element={<AIChatPage />} />
        </Routes>
      </BrowserRouter>
    </ModeProvider>
  )
}

export default App
