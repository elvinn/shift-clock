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
      <div className="app-container">
        <Sidebar />
        <main className="content">
          <Routes>
            <Route path="/" element={<Navigate to="/clock" replace />} />
            <Route path="/index.html" element={<Navigate to="/clock" replace />} />
            <Route path="/clock" element={<Clock />} />
            <Route path="/graph" element={<Graph />} />
            <Route path="/setting" element={<Setting />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
