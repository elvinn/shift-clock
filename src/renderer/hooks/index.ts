import { useEffect, useRef, useCallback } from 'react'

export const useEventListener = <K extends keyof globalThis.WindowEventMap>(
  eventName: K,
  handler: (event: globalThis.WindowEventMap[K]) => void,
  {
    element = window,
    enabled = true
  }: {
    element?: globalThis.HTMLElement | globalThis.Window | null;
    enabled?: boolean
  } = {}
) => {
  const fnRef = useRef(handler)
  fnRef.current = handler

  const savedHandler = useCallback((event: globalThis.WindowEventMap[K]) => {
    fnRef.current(event)
  }, [fnRef])

  useEffect(() => {
    if (!enabled || !element) {
      return
    }

    element.addEventListener(eventName, savedHandler as globalThis.EventListener)
    return () => {
      element.removeEventListener(eventName, savedHandler as globalThis.EventListener)
    }
  }, [eventName, element, enabled, savedHandler])
}