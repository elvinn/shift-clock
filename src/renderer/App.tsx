import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import Sidebar from './components/Sidebar'
import Clock from './pages/Clock'
import Graph from './pages/Graph'
import Setting from './pages/Setting'
import './App.css'

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex h-screen select-none">
        <Sidebar />
        <main className="flex-1 h-full overflow-y-auto flex justify-center">
          <div className="w-full min-w-[640px] max-w-[1200px] px-12 py-12">
            <Routes>
              <Route path="/" element={<Navigate to="/clock" replace />} />
              <Route path="/index.html" element={<Navigate to="/clock" replace />} />
              <Route path="/clock" element={<Clock />} />
              <Route path="/graph" element={<Graph />} />
              <Route path="/setting" element={<Setting />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  )
}

export default App
