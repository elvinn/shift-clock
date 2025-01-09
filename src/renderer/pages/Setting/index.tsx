import React, { useState, useEffect } from 'react'
import { Switch } from '@/renderer/components/ui/switch'

const Setting: React.FC = () => {
  const [autoLaunch, setAutoLaunch] = useState(false)

  useEffect(() => {
    // Get initial auto launch status
    window.electronAPI.invoke('getAutoLaunchStatus').then((status) => {
      setAutoLaunch(status)
    })
  }, [])

  const handleAutoLaunchChange = async (checked: boolean) => {
    await window.electronAPI.invoke('setAutoLaunch', checked)
    setAutoLaunch(checked)
  }

  return (
    <div className="border-b border-[#ddd]">
      <h2 className="text-2xl">Auto Launch</h2>
      <div className="mt-2 mb-4 flex items-center justify-between">
        <span className="text-xl">Launch on startup</span>
        <Switch checked={autoLaunch} onCheckedChange={handleAutoLaunchChange} />
      </div>
    </div>
  )
}

export default Setting
