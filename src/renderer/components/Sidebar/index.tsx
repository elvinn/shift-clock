import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Clock, ChartLine, Settings } from 'lucide-react'

import { useEventListener } from '../../hooks'
import './styles.scss'

const MIN_WIDTH = 240

const Sidebar: React.FC = () => {
  const [width, setWidth] = useState(MIN_WIDTH)
  const [isResizing, setIsResizing] = useState(false)

  const getLinkClass = ({ isActive }: { isActive: boolean }) => (isActive ? 'active' : '')

  const startResizing = (e: React.MouseEvent) => {
    setIsResizing(true)
    e.preventDefault()
  }

  const stopResizing = () => {
    setIsResizing(false)
  }

  const resize = (e: globalThis.MouseEvent) => {
    if (isResizing) {
      const newWidth = e.clientX
      if (newWidth >= MIN_WIDTH) {
        setWidth(newWidth)
      }
    }
  }

  useEventListener('mousemove', resize, { enabled: isResizing })
  useEventListener('mouseup', stopResizing, { enabled: isResizing })

  return (
    <div className="sidebar" style={{ width }}>
      <h1>Shift Clock</h1>
      <nav>
        <NavLink to="/clock" className={getLinkClass}>
          <Clock />
          Clock
        </NavLink>
        <NavLink to="/graph" className={getLinkClass}>
          <ChartLine />
          Graph
        </NavLink>
        <NavLink to="/setting" className={getLinkClass}>
          <Settings />
          Setting
        </NavLink>
      </nav>
      <div className="resize-handle" onMouseDown={startResizing} />
    </div>
  )
}

export default Sidebar
