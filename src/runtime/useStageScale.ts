import { useEffect, useState } from 'react'

export const STAGE_WIDTH = 1920
export const STAGE_HEIGHT = 1080

const computeScale = () => {
  if (typeof window === 'undefined') {
    return 1
  }

  return Math.min(window.innerWidth / STAGE_WIDTH, window.innerHeight / STAGE_HEIGHT)
}

export function useStageScale() {
  const [scale, setScale] = useState(computeScale)

  useEffect(() => {
    const updateScale = () => setScale(computeScale())

    updateScale()
    window.addEventListener('resize', updateScale)
    return () => window.removeEventListener('resize', updateScale)
  }, [])

  return scale
}
