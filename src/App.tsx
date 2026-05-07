import { useCallback, useEffect, useRef, useState } from 'react'
import { EditInspectMode } from './edit-mode/EditInspectMode'
import { SlideErrorBoundary } from './runtime/SlideErrorBoundary'
import { SlideStage } from './runtime/SlideStage'
import { usePresentationCursorAutoHide } from './runtime/usePresentationCursorAutoHide'
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
    isEndScreen,
    nextSlide,
  } = useSlideNavigation(slides.length)
  const isCursorHidden = usePresentationCursorAutoHide(!isEditMode)

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
  const hasSlides = slides.length > 0
  const currentSlideFile = slides[currentIndex]?.file ?? 'src/slides.ts'

  return (
    <SlideStage
      isCursorHidden={isCursorHidden}
      ref={stageRef}
      onStageClick={isEditMode ? undefined : nextSlide}
    >
      {isEndScreen ? (
        <div className="flex h-full w-full flex-col items-center justify-center bg-black px-24 text-center text-white">
          <p className="font-mono text-3xl text-white/45">End of slide show</p>
          <h1 className="mt-7 text-[88px] font-semibold leading-none tracking-normal">
            You have reached the end
          </h1>
          <p className="mt-8 text-[34px] text-white/60">
            Press Left or Up to return to the final slide.
          </p>
        </div>
      ) : CurrentSlide ? (
        <SlideErrorBoundary
          resetKeys={[currentIndex, CurrentSlide]}
          slideFile={currentSlideFile}
          slideNumber={currentIndex + 1}
        >
          <CurrentSlide />
        </SlideErrorBoundary>
      ) : !hasSlides ? (
        <div className="flex h-full w-full flex-col items-center justify-center bg-slate-950 px-24 text-center text-white">
          <h1 className="text-6xl font-semibold">No slides registered</h1>
          <p className="mt-6 max-w-3xl text-3xl text-slate-300">
            Add slide components under src/slides/ and register them in
            src/slides.ts.
          </p>
        </div>
      ) : null}
      <EditInspectMode
        active={isEditMode && !isEndScreen}
        slideFile={currentSlideFile}
        slideNumber={currentIndex + 1}
        stageRef={stageRef}
      />
    </SlideStage>
  )
}

export default App
