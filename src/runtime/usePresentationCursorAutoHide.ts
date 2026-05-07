import { useEffect, useState } from 'react'

const CURSOR_IDLE_MS = 2000

export function usePresentationCursorAutoHide(enabled: boolean) {
  const [isCursorHidden, setIsCursorHidden] = useState(false)

  useEffect(() => {
    let showCursorTimeout: number | undefined

    if (!enabled) {
      showCursorTimeout = window.setTimeout(() => {
        setIsCursorHidden(false)
      }, 0)

      return () => window.clearTimeout(showCursorTimeout)
    }

    showCursorTimeout = window.setTimeout(() => {
      setIsCursorHidden(false)
    }, 0)

    let hideCursorTimeout = window.setTimeout(() => {
      setIsCursorHidden(true)
    }, CURSOR_IDLE_MS)

    const resetCursorIdleTimer = () => {
      window.clearTimeout(hideCursorTimeout)
      setIsCursorHidden(false)

      hideCursorTimeout = window.setTimeout(() => {
        setIsCursorHidden(true)
      }, CURSOR_IDLE_MS)
    }

    window.addEventListener('pointermove', resetCursorIdleTimer, {
      passive: true,
    })

    return () => {
      window.clearTimeout(showCursorTimeout)
      window.clearTimeout(hideCursorTimeout)
      window.removeEventListener('pointermove', resetCursorIdleTimer)
    }
  }, [enabled])

  return enabled && isCursorHidden
}
