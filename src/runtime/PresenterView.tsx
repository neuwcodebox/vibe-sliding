import { ChevronLeft, ChevronRight, Clock3, Eraser, List, Lock, MonitorOff, MonitorUp, MousePointer2, Pause, PenLine, Play, RotateCcw, Sun, X } from 'lucide-react'
import { type CSSProperties, type PointerEvent as ReactPointerEvent, useEffect, useMemo, useRef, useState } from 'react'
import { slides } from '../slides'
import { SlideErrorBoundary } from './SlideErrorBoundary'
import { readSlideIndexFromUrl, writeSlideIndexToUrl } from './useSlideNavigation'
import { publishAudienceScreenMode, publishInkStrokes, publishLaserPointer, publishSlideChange, subscribeToSlideChanges, type AudienceScreenMode, type InkStroke } from './presenterSync'

const formatElapsed = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainder = seconds % 60
  return [hours, minutes, remainder]
    .map((value, index) => (index === 0 ? String(value).padStart(2, '0') : String(value).padStart(2, '0')))
    .join(':')
}

const NOTE_FONT_SIZES = [15, 17, 19, 21]

function InkOverlay({ strokes }: { strokes: InkStroke[] }) {
  if (strokes.length === 0) return null
  return <svg className="presenter-preview-ink" aria-hidden viewBox="0 0 1 1" preserveAspectRatio="none">{strokes.map((stroke, index) => <polyline fill="none" key={index} points={stroke.points.map((point) => `${point.x},${point.y}`).join(' ')} stroke="#ff4d4f" strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.006" />)}</svg>
}

function SlidePreview({ index, isDrawing = false, label, inkStrokes = [], laserPointer, onPointerDown, onPointerLeave, onPointerMove, onPointerUp }: { index: number; isDrawing?: boolean; label: string; inkStrokes?: InkStroke[]; laserPointer?: { x: number; y: number } | null; onPointerDown?: (event: ReactPointerEvent<HTMLElement>) => void; onPointerLeave?: () => void; onPointerMove?: (event: ReactPointerEvent<HTMLElement>) => void; onPointerUp?: (event: ReactPointerEvent<HTMLElement>) => void }) {
  const Slide = slides[index]?.component

  return (
    <section className={`presenter-preview${isDrawing ? ' presenter-preview-is-drawing' : ''}`} aria-label={label} onPointerDown={onPointerDown} onPointerLeave={onPointerLeave} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
      <div className="presenter-preview-stage">
        {Slide ? (
          <SlideErrorBoundary
            resetKeys={[index, Slide]}
            slideFile={slides[index].file}
            slideNumber={index + 1}
          >
            <Slide />
          </SlideErrorBoundary>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-950 text-3xl text-slate-500">
            End of slide show
          </div>
        )}
      </div>
      <InkOverlay strokes={inkStrokes} />
      {laserPointer && <div className="presenter-preview-laser" aria-hidden style={{ left: `${laserPointer.x * 100}%`, top: `${laserPointer.y * 100}%` }} />}
    </section>
  )
}

export function PresenterView() {
  const slideCount = slides.length
  const [currentIndex, setCurrentIndex] = useState(() => readSlideIndexFromUrl(slideCount))
  const [elapsed, setElapsed] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(true)
  const [isSlideMenuOpen, setIsSlideMenuOpen] = useState(false)
  const [noteFontSizeIndex, setNoteFontSizeIndex] = useState(1)
  const [audienceScreenMode, setAudienceScreenMode] = useState<AudienceScreenMode>('visible')
  const [isAudienceFrozen, setIsAudienceFrozen] = useState(false)
  const [isLaserActive, setIsLaserActive] = useState(false)
  const [isPenActive, setIsPenActive] = useState(false)
  const [inkStrokes, setInkStrokes] = useState<InkStroke[]>([])
  const [laserPointer, setLaserPointer] = useState<{ x: number; y: number } | null>(null)
  const activeInkStroke = useRef<number | null>(null)
  const inkStrokesBySlideRef = useRef<Record<number, InkStroke[]>>({})

  useEffect(() => subscribeToSlideChanges((index) => {
    setCurrentIndex(index)
    setInkStrokes(inkStrokesBySlideRef.current[index] ?? [])
  }), [])

  useEffect(() => {
    if (!isTimerRunning) {
      return
    }

    const timer = window.setInterval(() => setElapsed((seconds) => seconds + 1), 1000)
    return () => window.clearInterval(timer)
  }, [isTimerRunning])

  const goToSlide = (index: number) => {
    const nextIndex = Math.min(Math.max(index, 0), slideCount)
    const nextInkStrokes = inkStrokesBySlideRef.current[nextIndex] ?? []
    setCurrentIndex(nextIndex)
    setInkStrokes(nextInkStrokes)
    writeSlideIndexToUrl(nextIndex, slideCount)
    publishLaserPointer(null)
    setLaserPointer(null)
    if (!isAudienceFrozen) {
      publishSlideChange(nextIndex)
      publishInkStrokes(nextIndex, nextInkStrokes)
    }
  }

  const setAudienceScreen = (mode: AudienceScreenMode) => {
    const nextMode = audienceScreenMode === mode ? 'visible' : mode
    setAudienceScreenMode(nextMode)
    publishAudienceScreenMode(nextMode)
  }

  const toggleAudienceFreeze = () => {
    if (isAudienceFrozen) {
      setIsAudienceFrozen(false)
      publishSlideChange(currentIndex)
      publishInkStrokes(currentIndex, inkStrokesBySlideRef.current[currentIndex] ?? [])
    } else {
      setIsAudienceFrozen(true)
      publishLaserPointer(null)
    }
  }

  const toggleLaser = () => {
    setIsLaserActive((active) => !active)
    setIsPenActive(false)
    setLaserPointer(null)
    publishLaserPointer(null)
  }

  const clearInkStrokes = () => {
    activeInkStroke.current = null
    inkStrokesBySlideRef.current[currentIndex] = []
    setInkStrokes([])
    publishInkStrokes(currentIndex, [])
  }

  const togglePen = () => {
    setIsPenActive((active) => !active)
    setIsLaserActive(false)
    setLaserPointer(null)
    publishLaserPointer(null)
  }

  const getPreviewPoint = (event: ReactPointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    return {
      x: Math.min(Math.max((event.clientX - bounds.left) / bounds.width, 0), 1),
      y: Math.min(Math.max((event.clientY - bounds.top) / bounds.height, 0), 1),
    }
  }

  const updateLaserPointer = (event: ReactPointerEvent<HTMLElement>) => {
    if (!isLaserActive) return
    const point = getPreviewPoint(event)
    setLaserPointer(point)
    publishLaserPointer(point)
  }

  const startInkStroke = (event: ReactPointerEvent<HTMLElement>) => {
    if (!isPenActive) return
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    const strokes = [...(inkStrokesBySlideRef.current[currentIndex] ?? []), { points: [getPreviewPoint(event)] }]
    activeInkStroke.current = strokes.length - 1
    inkStrokesBySlideRef.current[currentIndex] = strokes
    setInkStrokes(strokes)
    publishInkStrokes(currentIndex, strokes)
  }

  const extendInkStroke = (event: ReactPointerEvent<HTMLElement>) => {
    if (!isPenActive || activeInkStroke.current === null) return
    event.preventDefault()
    const strokeIndex = activeInkStroke.current
    const strokes = (inkStrokesBySlideRef.current[currentIndex] ?? []).map((stroke, index) => index === strokeIndex ? { points: [...stroke.points, getPreviewPoint(event)] } : stroke)
    inkStrokesBySlideRef.current[currentIndex] = strokes
    setInkStrokes(strokes)
    publishInkStrokes(currentIndex, strokes)
  }

  const finishInkStroke = (event: ReactPointerEvent<HTMLElement>) => {
    if (activeInkStroke.current !== null && event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
    activeInkStroke.current = null
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown' || event.key === ' ') {
        event.preventDefault()
        goToSlide(currentIndex + 1)
      }
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault()
        goToSlide(currentIndex - 1)
      }
      if (event.key === 'Home') {
        event.preventDefault()
        goToSlide(0)
      }
      if (event.key === 'End') {
        event.preventDefault()
        goToSlide(slideCount - 1)
      }
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
        toggleLaser()
      }
      if (event.key.toLowerCase() === 'd') {
        event.preventDefault()
        togglePen()
      }
      if (event.key.toLowerCase() === 'c') {
        event.preventDefault()
        clearInkStrokes()
      }
      if (event.key.toLowerCase() === 'f') {
        event.preventDefault()
        toggleAudienceFreeze()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  const currentSlide = slides[currentIndex]
  const notes = currentSlide?.notes ?? []
  const noteFontSize = NOTE_FONT_SIZES[noteFontSizeIndex]
  const nextIndex = Math.min(currentIndex + 1, slideCount)
  const slideLabel = currentIndex >= slideCount ? '발표 종료 화면' : `${currentIndex + 1} / ${slideCount}`
  const currentFile = useMemo(() => currentSlide?.file ?? '—', [currentSlide])

  return (
    <main className="presenter-view" data-ai-id="presenter-view">
      <header className="presenter-header">
        <div>
          <p className="presenter-kicker">PRESENTER VIEW</p>
          <div className="presenter-title-row">
            <p className="presenter-counter">슬라이드 {slideLabel}</p>
            <button
              className="presenter-icon-button presenter-slide-menu-button"
              onClick={() => setIsSlideMenuOpen((open) => !open)}
              aria-label="슬라이드 목록 열기"
              aria-expanded={isSlideMenuOpen}
              title="슬라이드 목록"
            >
              <List size={20} aria-hidden />
            </button>
          </div>
        </div>
        <div className="presenter-header-actions">
          <div className="presenter-audience-controls" aria-label="청중 화면 제어">
            <button className={`presenter-icon-button${isAudienceFrozen ? ' is-active' : ''}`} onClick={toggleAudienceFreeze} aria-label="청중 화면 고정" aria-pressed={isAudienceFrozen} title="청중 화면 고정 (F)"><Lock size={18} aria-hidden /></button>
            <button className={`presenter-icon-button${isLaserActive ? ' is-active' : ''}`} onClick={toggleLaser} aria-label="레이저 포인터" aria-pressed={isLaserActive} title="레이저 포인터 (L)"><MousePointer2 size={18} aria-hidden /></button>
            <div className="presenter-tool-group" aria-label="청중 화면 색상">
              <button className={`presenter-icon-button${audienceScreenMode === 'black' ? ' is-active' : ''}`} onClick={() => setAudienceScreen('black')} aria-label="청중 화면 검정 전환" aria-pressed={audienceScreenMode === 'black'} title="검정 화면 (B)"><MonitorOff size={18} aria-hidden /></button>
              <button className={`presenter-icon-button${audienceScreenMode === 'white' ? ' is-active' : ''}`} onClick={() => setAudienceScreen('white')} aria-label="청중 화면 흰색 전환" aria-pressed={audienceScreenMode === 'white'} title="흰색 화면 (W)"><Sun size={18} aria-hidden /></button>
            </div>
            <div className="presenter-tool-group" aria-label="펜 주석">
              <button className={`presenter-icon-button${isPenActive ? ' is-active' : ''}`} onClick={togglePen} aria-label="펜 주석" aria-pressed={isPenActive} title="펜 주석 (D)"><PenLine size={18} aria-hidden /></button>
            <button className="presenter-icon-button" onClick={clearInkStrokes} aria-label="펜 주석 지우기" title="이 슬라이드 주석 지우기 (C)"><Eraser size={18} aria-hidden /></button>
            </div>
          </div>
          <div className="presenter-timer-controls">
            <div className="presenter-timer" aria-label={`경과 시간 ${formatElapsed(elapsed)}${isTimerRunning ? '' : ', 일시 정지됨'}`}>
              <Clock3 size={18} aria-hidden /> {formatElapsed(elapsed)}
            </div>
            <button
              className="presenter-icon-button"
              onClick={() => setIsTimerRunning((running) => !running)}
              aria-label={isTimerRunning ? '타이머 일시 정지' : '타이머 시작'}
              title={isTimerRunning ? '일시 정지' : '시작'}
            >
              {isTimerRunning ? <Pause size={18} aria-hidden /> : <Play size={18} aria-hidden />}
            </button>
            <button
              className="presenter-icon-button"
              onClick={() => setElapsed(0)}
              aria-label="타이머 초기화"
              title="초기화"
            >
              <RotateCcw size={18} aria-hidden />
            </button>
          </div>
        </div>
      </header>

      {isSlideMenuOpen && (
        <section className="presenter-slide-menu" aria-label="슬라이드 목록">
          <div className="presenter-slide-menu-header">
            <p>슬라이드로 이동</p>
            <button onClick={() => setIsSlideMenuOpen(false)} aria-label="슬라이드 목록 닫기">
              <X size={18} aria-hidden />
            </button>
          </div>
          <div className="presenter-slide-menu-list">
            {slides.map((slide, index) => (
              <button
                className={index === currentIndex ? 'is-active' : undefined}
                key={slide.file}
                onClick={() => {
                  goToSlide(index)
                  setIsSlideMenuOpen(false)
                }}
              >
                <span>{String(index + 1).padStart(2, '0')}</span>
                <span>{slide.file.replace('src/slides/', '')}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      <div className="presenter-layout">
        <div className="presenter-current-panel">
          <p className="presenter-panel-label"><MonitorUp size={16} aria-hidden /> 현재 화면</p>
          <SlidePreview index={currentIndex} isDrawing={isPenActive} inkStrokes={inkStrokes} label="현재 슬라이드 미리보기" laserPointer={laserPointer} onPointerDown={startInkStroke} onPointerLeave={() => { if (isLaserActive) publishLaserPointer(null); setLaserPointer(null); activeInkStroke.current = null }} onPointerMove={(event) => { updateLaserPointer(event); extendInkStroke(event) }} onPointerUp={finishInkStroke} />
          <p className="presenter-file">{currentFile}</p>
        </div>

        <aside className="presenter-side-panel">
          <section className="presenter-notes-section">
            <div className="presenter-notes-heading">
              <p className="presenter-panel-label">발표 대본</p>
              <div className="presenter-note-size-controls" aria-label="대본 글자 크기">
                <button
                  onClick={() => setNoteFontSizeIndex((index) => index - 1)}
                  disabled={noteFontSizeIndex === 0}
                  aria-label="대본 글자 작게"
                  title="글자 작게"
                >
                  A−
                </button>
                <button
                  onClick={() => setNoteFontSizeIndex((index) => index + 1)}
                  disabled={noteFontSizeIndex === NOTE_FONT_SIZES.length - 1}
                  aria-label="대본 글자 크게"
                  title="글자 크게"
                >
                  A+
                </button>
              </div>
            </div>
            <div className="presenter-notes" style={{ '--presenter-notes-font-size': `${noteFontSize}px` } as CSSProperties}>
              {notes.length > 0 ? notes.map((note, index) => <p key={index}>{note}</p>) : <p className="presenter-empty">이 슬라이드에는 등록된 대본이 없습니다.</p>}
            </div>
          </section>
          <section>
            <p className="presenter-panel-label">다음 슬라이드</p>
            <SlidePreview index={nextIndex} label="다음 슬라이드 미리보기" />
          </section>
        </aside>
      </div>

      <footer className="presenter-controls">
        <button onClick={() => goToSlide(currentIndex - 1)} disabled={currentIndex === 0}>
          <ChevronLeft size={20} aria-hidden /> 이전
        </button>
        <span>← →, Space로 조작</span>
        <button onClick={() => goToSlide(currentIndex + 1)} disabled={currentIndex >= slideCount}>
          다음 <ChevronRight size={20} aria-hidden />
        </button>
      </footer>
    </main>
  )
}
