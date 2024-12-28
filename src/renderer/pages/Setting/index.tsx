import React, { useState, useEffect } from 'react'
import './styles.scss'
import { Switch } from 'antd'

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
    <div className="page setting-page">
      <div className="setting-block">
        <h2 className="setting-title">Auto Launch</h2>
        <div className="setting-item">
          <span className="setting-label">Launch on startup</span>
          <Switch checked={autoLaunch} onChange={handleAutoLaunchChange} />
        </div>
      </div>
    </div>
  )
}

export default Setting
