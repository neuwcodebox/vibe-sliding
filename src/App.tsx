import { Eraser, type LucideIcon, MonitorOff, MousePointer2, PanelBottomClose, PanelBottomOpen, PenLine, Sun } from 'lucide-react'
import { type PointerEvent as ReactPointerEvent, useCallback, useEffect, useRef, useState } from 'react'
import { EditInspectMode } from './edit-mode/EditInspectMode'
import { EditablePptxExportMode } from './export-mode/EditablePptxExportMode'
import { SlideErrorBoundary } from './runtime/SlideErrorBoundary'
import { SlideStage } from './runtime/SlideStage'
import { PresenterView } from './runtime/PresenterView'
import {
  type AudienceScreenMode,
  type InkStroke,
  type LaserPointerPosition,
  publishSlideChange,
  publishInkStrokes,
  subscribeToAudienceScreenMode,
  subscribeToInkStrokes,
  subscribeToLaserPointer,
  subscribeToSlideChanges,
} from './runtime/presenterSync'
import { usePresentationCursorAutoHide } from './runtime/usePresentationCursorAutoHide'
import { useSlideNavigation } from './runtime/useSlideNavigation'
import { slides } from './slides'

type AudienceQuickControlsProps = {
  audienceScreenMode: AudienceScreenMode
  isLaserActive: boolean
  isPenActive: boolean
  onClearInk: () => void
  onSetAudienceScreen: (mode: Exclude<AudienceScreenMode, 'visible'>) => void
  onToggleLaser: () => void
  onTogglePen: () => void
}

type AudienceToolStatus = { icon: LucideIcon; label: string }

function AudienceQuickControls({ audienceScreenMode, isLaserActive, isPenActive, onClearInk, onSetAudienceScreen, onToggleLaser, onTogglePen }: AudienceQuickControlsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const activeTools: AudienceToolStatus[] = [
    audienceScreenMode === 'black' ? { label: '검정 화면', icon: MonitorOff } : audienceScreenMode === 'white' ? { label: '흰색 화면', icon: Sun } : null,
    isLaserActive ? { label: '레이저 포인터', icon: MousePointer2 } : null,
    isPenActive ? { label: '펜 주석', icon: PenLine } : null,
  ].filter((tool): tool is AudienceToolStatus => tool !== null)

  return (
    <div className={`audience-quick-controls${isOpen ? ' is-open' : ''}`}>
      {!isOpen && activeTools.length > 0 && (
        <div className="audience-quick-status" aria-label={`활성 도구: ${activeTools.map((tool) => tool.label).join(', ')}`} aria-live="polite">
          {activeTools.map((tool) => {
            const Icon = tool.icon
            return <Icon key={tool.label} size={14} aria-hidden />
          })}
        </div>
      )}
      {isOpen && (
        <div className="audience-quick-menu" aria-label="발표 도구">
          <button className={audienceScreenMode === 'black' ? 'is-active' : undefined} onClick={() => onSetAudienceScreen('black')} aria-label="검정 화면 전환" title="검정 화면"><MonitorOff size={18} aria-hidden /></button>
          <button className={audienceScreenMode === 'white' ? 'is-active' : undefined} onClick={() => onSetAudienceScreen('white')} aria-label="흰색 화면 전환" title="흰색 화면"><Sun size={18} aria-hidden /></button>
          <button className={isLaserActive ? 'is-active' : undefined} onClick={onToggleLaser} aria-label="레이저 포인터" title="레이저 포인터"><MousePointer2 size={18} aria-hidden /></button>
          <button className={isPenActive ? 'is-active' : undefined} onClick={onTogglePen} aria-label="펜 주석" title="펜 주석"><PenLine size={18} aria-hidden /></button>
          <button onClick={onClearInk} aria-label="이 슬라이드 주석 지우기" title="주석 지우기"><Eraser size={18} aria-hidden /></button>
        </div>
      )}
      <button className="audience-quick-toggle" onClick={() => setIsOpen((open) => !open)} aria-label={isOpen ? '발표 도구 접기' : '발표 도구 펼치기'} aria-expanded={isOpen} title={isOpen ? '발표 도구 접기' : '발표 도구 펼치기'}>
        {isOpen ? <PanelBottomClose size={18} aria-hidden /> : <PanelBottomOpen size={18} aria-hidden />}
      </button>
    </div>
  )
}

const readEditQuery = () =>
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).get('edit') === '1'

const readExportQuery = () =>
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).get('export') === 'editable-pptx'

const readPresenterQuery = () =>
  typeof window !== 'undefined' &&
  new URLSearchParams(window.location.search).get('presenter') === '1'

function PresentationApp() {
  const stageRef = useRef<HTMLDivElement>(null)
  const [isEditMode, setIsEditMode] = useState(readEditQuery)
  const [audienceScreenMode, setAudienceScreenMode] = useState<AudienceScreenMode>('visible')
  const [laserPointer, setLaserPointer] = useState<LaserPointerPosition>(null)
  const [inkStrokesBySlide, setInkStrokesBySlide] = useState<Record<number, InkStroke[]>>({})
  const [isAudienceLaserActive, setIsAudienceLaserActive] = useState(false)
  const [isAudiencePenActive, setIsAudiencePenActive] = useState(false)
  const activeInkStroke = useRef<number | null>(null)
  const inkStrokesBySlideRef = useRef<Record<number, InkStroke[]>>({})
  const {
    currentIndex,
    currentSlide,
    goToSlide,
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
    publishSlideChange(currentIndex)
  }, [currentIndex])

  useEffect(() => subscribeToSlideChanges(goToSlide), [goToSlide])
  useEffect(() => subscribeToAudienceScreenMode(setAudienceScreenMode), [])
  useEffect(() => subscribeToLaserPointer(setLaserPointer), [])
  const setSlideInkStrokes = useCallback((index: number, strokes: InkStroke[]) => {
    inkStrokesBySlideRef.current = { ...inkStrokesBySlideRef.current, [index]: strokes }
    setInkStrokesBySlide((current) => ({ ...current, [index]: strokes }))
  }, [])

  useEffect(() => subscribeToInkStrokes(setSlideInkStrokes), [setSlideInkStrokes])

  const setAudienceScreen = useCallback((mode: Exclude<AudienceScreenMode, 'visible'>) => {
    const nextMode = audienceScreenMode === mode ? 'visible' : mode
    setAudienceScreenMode(nextMode)
  }, [audienceScreenMode])

  const getStagePoint = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    return {
      x: Math.min(Math.max((event.clientX - bounds.left) / bounds.width, 0), 1),
      y: Math.min(Math.max((event.clientY - bounds.top) / bounds.height, 0), 1),
    }
  }, [])

  const clearAudienceInk = useCallback(() => {
    activeInkStroke.current = null
    setSlideInkStrokes(currentIndex, [])
    publishInkStrokes(currentIndex, [])
  }, [currentIndex, setSlideInkStrokes])

  const toggleAudienceLaser = useCallback(() => {
    setIsAudienceLaserActive((active) => !active)
    setIsAudiencePenActive(false)
    setLaserPointer(null)
  }, [])

  const toggleAudiencePen = useCallback(() => {
    setIsAudiencePenActive((active) => !active)
    setIsAudienceLaserActive(false)
    setLaserPointer(null)
  }, [])

  const onAudiencePointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (!isAudiencePenActive) return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    const strokes = [...(inkStrokesBySlideRef.current[currentIndex] ?? []), { points: [getStagePoint(event)] }]
    activeInkStroke.current = strokes.length - 1
    setSlideInkStrokes(currentIndex, strokes)
    publishInkStrokes(currentIndex, strokes)
  }, [currentIndex, getStagePoint, isAudiencePenActive, setSlideInkStrokes])

  const onAudiencePointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (isAudienceLaserActive) setLaserPointer(getStagePoint(event))
    if (!isAudiencePenActive || activeInkStroke.current === null) return
    event.preventDefault()
    const strokeIndex = activeInkStroke.current
    const strokes = (inkStrokesBySlideRef.current[currentIndex] ?? []).map((stroke, index) => index === strokeIndex ? { points: [...stroke.points, getStagePoint(event)] } : stroke)
    setSlideInkStrokes(currentIndex, strokes)
    publishInkStrokes(currentIndex, strokes)
  }, [currentIndex, getStagePoint, isAudienceLaserActive, isAudiencePenActive, setSlideInkStrokes])

  const onAudiencePointerUp = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (activeInkStroke.current !== null && event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    activeInkStroke.current = null
  }, [])

  useEffect(() => {
    if (isEditMode) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, button, [contenteditable="true"]')) return

      if (event.key.toLowerCase() === 'b') {
        event.preventDefault()
        setAudienceScreen('black')
      }
      if (event.key.toLowerCase() === 'w') {
        event.preventDefault()
        setAudienceScreen('white')
      }
      if (event.key.toLowerCase() === 'l') {
        event.preventDefault()
        toggleAudienceLaser()
      }
      if (event.key.toLowerCase() === 'd') {
        event.preventDefault()
        toggleAudiencePen()
      }
      if (event.key.toLowerCase() === 'c') {
        event.preventDefault()
        clearAudienceInk()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [clearAudienceInk, isEditMode, setAudienceScreen, toggleAudienceLaser, toggleAudiencePen])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'p' && !isEditMode) {
        event.preventDefault()
        const url = new URL(window.location.href)
        url.searchParams.set('presenter', '1')
        url.searchParams.delete('edit')
        window.open(url.toString(), 'vibe-sliding-presenter', 'popup,width=1440,height=920')
        return
      }

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
    <>
      <SlideStage
      isCursorHidden={isCursorHidden}
      ref={stageRef}
      onStageClick={isEditMode || isAudiencePenActive ? undefined : nextSlide}
      onStagePointerDown={onAudiencePointerDown}
      onStagePointerLeave={() => { activeInkStroke.current = null; if (isAudienceLaserActive) setLaserPointer(null) }}
      onStagePointerMove={onAudiencePointerMove}
      onStagePointerUp={onAudiencePointerUp}
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
      {laserPointer && audienceScreenMode === 'visible' && (
        <div
          className="audience-laser-pointer"
          aria-hidden
          style={{ left: `${laserPointer.x * 100}%`, top: `${laserPointer.y * 100}%` }}
        />
      )}
      {(inkStrokesBySlide[currentIndex] ?? []).length > 0 && audienceScreenMode === 'visible' && (
        <svg className="audience-ink-overlay" aria-hidden viewBox="0 0 1 1" preserveAspectRatio="none">
          {(inkStrokesBySlide[currentIndex] ?? []).map((stroke, index) => (
            <polyline fill="none" key={index} points={stroke.points.map((point) => `${point.x},${point.y}`).join(' ')} stroke="#ff4d4f" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.006" />
          ))}
        </svg>
      )}
      {audienceScreenMode !== 'visible' && (
        <div className={`audience-screen-overlay audience-screen-overlay-${audienceScreenMode}`} aria-hidden />
      )}
      <EditInspectMode
        active={isEditMode && !isEndScreen}
        slideFile={currentSlideFile}
        slideNumber={currentIndex + 1}
        stageRef={stageRef}
      />
      </SlideStage>
      {!isEditMode && (
        <AudienceQuickControls
          audienceScreenMode={audienceScreenMode}
          isLaserActive={isAudienceLaserActive}
          isPenActive={isAudiencePenActive}
          onClearInk={clearAudienceInk}
          onSetAudienceScreen={setAudienceScreen}
          onToggleLaser={toggleAudienceLaser}
          onTogglePen={toggleAudiencePen}
        />
      )}
    </>
  )
}

function App() {
  if (readExportQuery()) {
    return <EditablePptxExportMode />
  }

  if (readPresenterQuery()) {
    return <PresenterView />
  }

  return <PresentationApp />
}

export default App
