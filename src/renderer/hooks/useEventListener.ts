import { useEffect, useRef, useCallback } from 'react'

/**
 * A hook to listen for events on a specific element.
 * @param eventName - The name of the event to listen for.
 * @param handler - The handler function to call when the event is triggered.
 * @param options - The options object.
 * @param options.element - The element to listen for the event on.
 * @param options.enabled - Whether the event listener is enabled.
 */
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