import { useCallback, useEffect, useRef, useState } from 'react'
import { EditInspectMode } from './edit-mode/EditInspectMode'
import { SlideStage } from './runtime/SlideStage'
import { useSlideNavigation } from './runtime/useSlideNavigation'
import { slides } from './slides'

const readEditQuery = () =>
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).get('edit') === '1'

function App() {
  const stageRef = useRef<HTMLDivElement>(null)
  const [isEditMode, setIsEditMode] = useState(readEditQuery)
  const {
    currentIndex,
    currentSlide,
    nextSlide,
  } = useSlideNavigation(slides.length)

  const setEditMode = useCallback((enabled: boolean) => {
    setIsEditMode(enabled)

    const url = new URL(window.location.href)
    if (enabled) {
      url.searchParams.set('edit', '1')
    } else {
      url.searchParams.delete('edit')
    }
    window.history.replaceState(null, '', url)
  }, [])

  useEffect(() => {
    document.body.classList.toggle('edit-inspect-active', isEditMode)
    return () => document.body.classList.remove('edit-inspect-active')
  }, [isEditMode])

  useEffect(() => {
    const onPopState = () => setIsEditMode(readEditQuery())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'e') {
        event.preventDefault()
        setEditMode(!isEditMode)
      }

      if (event.key === 'Escape' && isEditMode) {
        event.preventDefault()
        setEditMode(false)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isEditMode, setEditMode])

  const CurrentSlide = currentSlide

  return (
    <SlideStage
      ref={stageRef}
      onStageClick={isEditMode ? undefined : nextSlide}
    >
      {CurrentSlide ? (
        <CurrentSlide />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center bg-slate-950 px-24 text-center text-white">
          <h1 className="text-6xl font-semibold">No slides registered</h1>
          <p className="mt-6 max-w-3xl text-3xl text-slate-300">
            Add slide components under src/slides/ and register them in
            src/slides.ts.
          </p>
        </div>
      )}
      <EditInspectMode
        active={isEditMode}
        slideFile={slides[currentIndex]?.file ?? 'src/slides.ts'}
        slideNumber={currentIndex + 1}
        stageRef={stageRef}
      />
    </SlideStage>
  )
}

export default App
