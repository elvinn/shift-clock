import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Clock, ChartLine, Settings } from 'lucide-react'

import { useEventListener } from '../../hooks'

const MIN_WIDTH = 240

const Sidebar: React.FC = () => {
  const [width, setWidth] = useState(MIN_WIDTH)
  const [isResizing, setIsResizing] = useState(false)

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
    <div
      className="relative w-[250px] min-w-[200px] bg-[#f5f5f5] p-5 border-r border-[#ddd] select-none"
      style={{ width }}
    >
      <h1 className="my-6 text-4xl">Shift Clock</h1>
      <nav className="flex flex-col gap-2.5 text-xl">
        <NavLink
          to="/clock"
          className={({ isActive }) =>
            `flex items-center p-2.5 font-bold text-[#333] rounded-md gap-2.5 [-webkit-user-drag:none]
             ${isActive ? 'bg-[#e0e0e0]' : 'hover:bg-[#eaeaea]'}`
          }
        >
          <Clock />
          Clock
        </NavLink>
        <NavLink
          to="/graph"
          className={({ isActive }) =>
            `flex items-center p-2.5 font-bold text-[#333] rounded-md gap-2.5 [-webkit-user-drag:none]
             ${isActive ? 'bg-[#e0e0e0]' : 'hover:bg-[#eaeaea]'}`
          }
        >
          <ChartLine />
          Graph
        </NavLink>
        <NavLink
          to="/setting"
          className={({ isActive }) =>
            `flex items-center p-2.5 font-bold text-[#333] rounded-md gap-2.5 [-webkit-user-drag:none]
             ${isActive ? 'bg-[#e0e0e0]' : 'hover:bg-[#eaeaea]'}`
          }
        >
          <Settings />
          Setting
        </NavLink>
      </nav>
      <div
        className="absolute right-[-5px] top-0 bottom-0 w-[10px] cursor-col-resize z-[1]"
        onMouseDown={startResizing}
      />
    </div>
  )
}

export default Sidebar
