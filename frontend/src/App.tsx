import { BrowserRouter, Routes, Route } from 'react-router'
import AIChatPage from './pages/ChatInterface/ChatInterface'
import HomePage from './pages/HomePage'
import { UserSessionProvider } from './contexts/UserSessionContext'
import { ModeProvider } from '@/providers/ModeContext'

function App() {
  return (
    <BrowserRouter>
        <UserSessionProvider>
    <ModeProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/textbook/:id/chat" element={<AIChatPage />} />
          </Routes>
    </ModeProvider>
        </UserSessionProvider>
      </BrowserRouter>
  )
}

export default App
