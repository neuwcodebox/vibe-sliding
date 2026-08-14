import { ChevronLeft, ChevronRight, Clock3, List, MonitorUp, Pause, Play, RotateCcw, X } from 'lucide-react'
import { type CSSProperties, useEffect, useMemo, useState } from 'react'
import { slides } from '../slides'
import { SlideErrorBoundary } from './SlideErrorBoundary'
import { readSlideIndexFromUrl, writeSlideIndexToUrl } from './useSlideNavigation'
import { publishSlideChange, subscribeToSlideChanges } from './presenterSync'

const formatElapsed = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainder = seconds % 60
  return [hours, minutes, remainder]
    .map((value, index) => (index === 0 ? String(value).padStart(2, '0') : String(value).padStart(2, '0')))
    .join(':')
}

const NOTE_FONT_SIZES = [15, 17, 19, 21]

function SlidePreview({ index, label }: { index: number; label: string }) {
  const Slide = slides[index]?.component

  return (
    <section className="presenter-preview" aria-label={label}>
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

  useEffect(() => subscribeToSlideChanges(setCurrentIndex), [])

  useEffect(() => {
    if (!isTimerRunning) {
      return
    }

    const timer = window.setInterval(() => setElapsed((seconds) => seconds + 1), 1000)
    return () => window.clearInterval(timer)
  }, [isTimerRunning])

  const goToSlide = (index: number) => {
    const nextIndex = Math.min(Math.max(index, 0), slideCount)
    setCurrentIndex(nextIndex)
    writeSlideIndexToUrl(nextIndex, slideCount)
    publishSlideChange(nextIndex)
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
          <p className="presenter-counter">슬라이드 {slideLabel}</p>
        </div>
        <div className="presenter-header-actions">
          <button
            className="presenter-icon-button"
            onClick={() => setIsSlideMenuOpen((open) => !open)}
            aria-label="슬라이드 목록 열기"
            aria-expanded={isSlideMenuOpen}
            title="슬라이드 목록"
          >
            <List size={20} aria-hidden />
          </button>
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
          <button className="presenter-icon-button" onClick={() => window.close()} aria-label="발표자 보기 닫기">
            <X size={20} aria-hidden />
          </button>
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
          <SlidePreview index={currentIndex} label="현재 슬라이드 미리보기" />
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
