import { Eraser, Expand, type LucideIcon, MonitorOff, MousePointer2, PanelBottomClose, PanelBottomOpen, PenLine, Shrink, Sun, Undo2, X } from 'lucide-react'
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
  publishAudienceHeartbeat,
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
  hasInk: boolean
  isLaserActive: boolean
  isPenActive: boolean
  onClearActiveTool: (tool: AudienceToolStatus['id']) => void
  onClearInk: () => void
  onUndoInk: () => void
  isFullscreen: boolean
  onSetAudienceScreen: (mode: Exclude<AudienceScreenMode, 'visible'>) => void
  onToggleFullscreen: () => void
  onToggleLaser: () => void
  onTogglePen: () => void
}

type AudienceToolStatus = { icon: LucideIcon; id: 'screen' | 'laser' | 'pen'; label: string }

function AudienceQuickControls({ audienceScreenMode, hasInk, isFullscreen, isLaserActive, isPenActive, onClearActiveTool, onClearInk, onSetAudienceScreen, onToggleFullscreen, onToggleLaser, onTogglePen, onUndoInk }: AudienceQuickControlsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const suppressPointerFocus = useRef(false)
  useEffect(() => {
    const removePointerFocus = (event: FocusEvent) => {
      if (!suppressPointerFocus.current || !(event.target instanceof HTMLButtonElement) || !event.target.closest('.audience-quick-controls')) return
      event.target.blur()
      suppressPointerFocus.current = false
    }
    window.addEventListener('focusin', removePointerFocus, true)
    return () => window.removeEventListener('focusin', removePointerFocus, true)
  }, [])
  const selectMenuAction = (action: () => void) => {
    action()
    setIsOpen(false)
  }
  const activeTools: AudienceToolStatus[] = [
    audienceScreenMode === 'black' ? { id: 'screen', label: '검정 화면', icon: MonitorOff } : audienceScreenMode === 'white' ? { id: 'screen', label: '흰색 화면', icon: Sun } : null,
    isLaserActive ? { id: 'laser', label: '레이저 포인터', icon: MousePointer2 } : null,
    isPenActive ? { id: 'pen', label: '펜 주석', icon: PenLine } : null,
  ].filter((tool): tool is AudienceToolStatus => tool !== null)

  return (
    <div
      className={`audience-quick-controls${isOpen ? ' is-open' : ''}`}
      onPointerDownCapture={(event) => {
        const button = event.target instanceof Element ? event.target.closest('button') : null
        if (button instanceof HTMLButtonElement) suppressPointerFocus.current = true
      }}
      onMouseDownCapture={(event) => {
        const button = event.target instanceof Element ? event.target.closest('button') : null
        if (button instanceof HTMLButtonElement) suppressPointerFocus.current = true
      }}
      onClickCapture={(event) => {
        const button = event.target instanceof Element ? event.target.closest('button') : null
        if (button instanceof HTMLButtonElement) window.setTimeout(() => {
          if (document.activeElement instanceof HTMLElement) document.activeElement.blur()
        }, 0)
      }}
    >
      {!isOpen && activeTools.length > 0 && (
        <div className="audience-quick-statuses" aria-live="polite">
          {activeTools.map((tool) => {
            const Icon = tool.icon
            return (
              <div className="audience-quick-status" key={tool.id} aria-label={`활성 도구: ${tool.label}`}>
                <Icon size={14} aria-hidden />
                <button className="audience-quick-status-cancel" onClick={() => onClearActiveTool(tool.id)} aria-label={`${tool.label} 해제`} title={`${tool.label} 해제`}><X size={13} aria-hidden /></button>
              </div>
            )
          })}
        </div>
      )}
      {isOpen && (
        <div className="audience-quick-menu" aria-label="발표 도구">
          <button className={isLaserActive ? 'is-active' : undefined} onClick={() => selectMenuAction(onToggleLaser)} aria-label="레이저 포인터" title="레이저 포인터 (R)"><MousePointer2 size={18} aria-hidden /></button>
          <div className="audience-quick-tool-group" aria-label="청중 화면 색상">
            <button className={audienceScreenMode === 'black' ? 'is-active' : undefined} onClick={() => selectMenuAction(() => onSetAudienceScreen('black'))} aria-label="검정 화면 전환" title="검정 화면 (B)"><MonitorOff size={18} aria-hidden /></button>
            <button className={audienceScreenMode === 'white' ? 'is-active' : undefined} onClick={() => selectMenuAction(() => onSetAudienceScreen('white'))} aria-label="흰색 화면 전환" title="흰색 화면 (W)"><Sun size={18} aria-hidden /></button>
          </div>
          <div className="audience-quick-tool-group" aria-label="펜 주석">
            <button className={isPenActive ? 'is-active' : undefined} onClick={() => selectMenuAction(onTogglePen)} aria-label="펜 주석" title="펜 주석 (D)"><PenLine size={18} aria-hidden /></button>
            <button onClick={() => selectMenuAction(onUndoInk)} disabled={!hasInk} aria-label="마지막 펜 주석 되돌리기" title="마지막 획 되돌리기 (Z)"><Undo2 size={18} aria-hidden /></button>
            <button onClick={() => selectMenuAction(onClearInk)} aria-label="이 슬라이드 주석 지우기" title="이 슬라이드 주석 지우기 (C)"><Eraser size={18} aria-hidden /></button>
          </div>
          <button className={isFullscreen ? 'is-active' : undefined} onClick={() => selectMenuAction(onToggleFullscreen)} aria-label={isFullscreen ? '전체 화면 종료' : '전체 화면'} title={`${isFullscreen ? '전체 화면 종료' : '전체 화면'} (F)`}>{isFullscreen ? <Shrink size={18} aria-hidden /> : <Expand size={18} aria-hidden />}</button>
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
  const [isFullscreen, setIsFullscreen] = useState(() => document.fullscreenElement !== null)
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

  const deactivateAudienceTools = useCallback(() => {
    activeInkStroke.current = null
    setAudienceScreenMode('visible')
    setIsAudienceLaserActive(false)
    setIsAudiencePenActive(false)
    setLaserPointer(null)
  }, [])

  const setEditMode = useCallback((enabled: boolean) => {
    if (enabled) deactivateAudienceTools()
    setIsEditMode(enabled)

    const url = new URL(window.location.href)
    if (enabled) {
      url.searchParams.set('edit', '1')
    } else {
      url.searchParams.delete('edit')
    }
    window.history.replaceState(null, '', url)
  }, [deactivateAudienceTools])

  useEffect(() => {
    document.body.classList.toggle('edit-inspect-active', isEditMode)
    return () => document.body.classList.remove('edit-inspect-active')
  }, [isEditMode])

  useEffect(() => {
    const onPopState = () => {
      const enabled = readEditQuery()
      if (enabled) deactivateAudienceTools()
      setIsEditMode(enabled)
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [deactivateAudienceTools])

  useEffect(() => {
    publishSlideChange(currentIndex)
  }, [currentIndex])

  useEffect(() => subscribeToSlideChanges(goToSlide), [goToSlide])
  useEffect(() => subscribeToAudienceScreenMode((mode) => {
    if (!isEditMode) setAudienceScreenMode(mode)
  }), [isEditMode])
  useEffect(() => subscribeToLaserPointer((pointer) => {
    if (!isEditMode) setLaserPointer(pointer)
  }), [isEditMode])
  const setSlideInkStrokes = useCallback((index: number, strokes: InkStroke[]) => {
    inkStrokesBySlideRef.current = { ...inkStrokesBySlideRef.current, [index]: strokes }
    setInkStrokesBySlide((current) => ({ ...current, [index]: strokes }))
  }, [])

  useEffect(() => subscribeToInkStrokes(setSlideInkStrokes), [setSlideInkStrokes])

  useEffect(() => {
    const publishHeartbeat = () => publishAudienceHeartbeat()
    publishHeartbeat()
    const heartbeat = window.setInterval(publishHeartbeat, 1000)
    return () => window.clearInterval(heartbeat)
  }, [])

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(document.fullscreenElement !== null)
    document.addEventListener('fullscreenchange', onFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange)
  }, [])

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

  const undoAudienceInk = useCallback(() => {
    activeInkStroke.current = null
    const strokes = (inkStrokesBySlideRef.current[currentIndex] ?? []).slice(0, -1)
    setSlideInkStrokes(currentIndex, strokes)
    publishInkStrokes(currentIndex, strokes)
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

  const clearAudienceActiveTool = useCallback((tool: AudienceToolStatus['id']) => {
    if (tool === 'screen') setAudienceScreenMode('visible')
    if (tool === 'laser') {
      setIsAudienceLaserActive(false)
      setLaserPointer(null)
    }
    if (tool === 'pen') {
      activeInkStroke.current = null
      setIsAudiencePenActive(false)
    }
  }, [])

  const toggleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      void document.exitFullscreen()
    } else {
      void document.documentElement.requestFullscreen()
    }
  }, [])

  const onAudiencePointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (isEditMode || !isAudiencePenActive) return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    const strokes = [...(inkStrokesBySlideRef.current[currentIndex] ?? []), { points: [getStagePoint(event)] }]
    activeInkStroke.current = strokes.length - 1
    setSlideInkStrokes(currentIndex, strokes)
    publishInkStrokes(currentIndex, strokes)
  }, [currentIndex, getStagePoint, isAudiencePenActive, isEditMode, setSlideInkStrokes])

  const onAudiencePointerMove = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (isEditMode) return
    if (isAudienceLaserActive) setLaserPointer(getStagePoint(event))
    if (!isAudiencePenActive || activeInkStroke.current === null) return
    event.preventDefault()
    const strokeIndex = activeInkStroke.current
    const strokes = (inkStrokesBySlideRef.current[currentIndex] ?? []).map((stroke, index) => index === strokeIndex ? { points: [...stroke.points, getStagePoint(event)] } : stroke)
    setSlideInkStrokes(currentIndex, strokes)
    publishInkStrokes(currentIndex, strokes)
  }, [currentIndex, getStagePoint, isAudienceLaserActive, isAudiencePenActive, isEditMode, setSlideInkStrokes])

  const onAudiencePointerUp = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (activeInkStroke.current !== null && event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    activeInkStroke.current = null
  }, [])

  useEffect(() => {
    if (isEditMode) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable="true"]')) return

      if (event.key.toLowerCase() === 'b') {
        event.preventDefault()
        setAudienceScreen('black')
      }
      if (event.key.toLowerCase() === 'w') {
        event.preventDefault()
        setAudienceScreen('white')
      }
      if (event.key.toLowerCase() === 'r') {
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
      if (event.key.toLowerCase() === 'z') {
        event.preventDefault()
        undoAudienceInk()
      }
      if (event.key.toLowerCase() === 'f') {
        event.preventDefault()
        toggleFullscreen()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [clearAudienceInk, isEditMode, setAudienceScreen, toggleAudienceLaser, toggleAudiencePen, toggleFullscreen, undoAudienceInk])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof Element && event.target.closest('input, textarea, select, [contenteditable="true"]')) return

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
      {!isEditMode && laserPointer && audienceScreenMode === 'visible' && (
        <div
          className="audience-laser-pointer"
          aria-hidden
          style={{ left: `${laserPointer.x * 100}%`, top: `${laserPointer.y * 100}%` }}
        />
      )}
      {!isEditMode && (inkStrokesBySlide[currentIndex] ?? []).length > 0 && audienceScreenMode === 'visible' && (
        <svg className="audience-ink-overlay" aria-hidden viewBox="0 0 1 1" preserveAspectRatio="none">
          {(inkStrokesBySlide[currentIndex] ?? []).map((stroke, index) => (
            <polyline fill="none" key={index} points={stroke.points.map((point) => `${point.x},${point.y}`).join(' ')} stroke="#ff4d4f" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.006" />
          ))}
        </svg>
      )}
      {!isEditMode && audienceScreenMode !== 'visible' && (
        <div className={`audience-screen-overlay audience-screen-overlay-${audienceScreenMode}`} aria-hidden />
      )}
      <EditInspectMode
        active={isEditMode && !isEndScreen}
        onGoToSlide={goToSlide}
        slideFile={currentSlideFile}
        slideNumber={currentIndex + 1}
        stageRef={stageRef}
      />
      </SlideStage>
      {!isEditMode && (
        <AudienceQuickControls
          audienceScreenMode={audienceScreenMode}
          hasInk={(inkStrokesBySlide[currentIndex] ?? []).length > 0}
          isFullscreen={isFullscreen}
          isLaserActive={isAudienceLaserActive}
          isPenActive={isAudiencePenActive}
          onClearActiveTool={clearAudienceActiveTool}
          onClearInk={clearAudienceInk}
          onUndoInk={undoAudienceInk}
          onSetAudienceScreen={setAudienceScreen}
          onToggleFullscreen={toggleFullscreen}
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
