import { useEffect, useMemo, useState } from 'react'
import type { SlideDefinition } from '../slides'
import { slides } from '../slides'

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

const isEditableTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return Boolean(
    target.closest('input, textarea, select, button, [contenteditable="true"]'),
  )
}

const readSlideIndexFromUrl = (slideCount: number) => {
  if (typeof window === 'undefined' || slideCount < 1) {
    return 0
  }

  const rawSlide = new URLSearchParams(window.location.search).get('slide')
  const parsedSlide = Number.parseInt(rawSlide ?? '', 10)

  if (!Number.isFinite(parsedSlide)) {
    return 0
  }

  return clamp(parsedSlide - 1, 0, slideCount - 1)
}

const writeSlideIndexToUrl = (index: number) => {
  const url = new URL(window.location.href)
  url.searchParams.set('slide', String(index + 1))
  window.history.replaceState(null, '', url)
}

export function useSlideNavigation(slideCount: number) {
  const [currentIndex, setCurrentIndex] = useState(() =>
    readSlideIndexFromUrl(slideCount),
  )

  useEffect(() => {
    if (slideCount > 0) {
      writeSlideIndexToUrl(currentIndex)
    }
  }, [currentIndex, slideCount])

  useEffect(() => {
    const onPopState = () => setCurrentIndex(readSlideIndexFromUrl(slideCount))
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [slideCount])

  const goToSlide = (index: number) => {
    if (slideCount < 1) {
      setCurrentIndex(0)
      return
    }

    setCurrentIndex(clamp(index, 0, slideCount - 1))
  }

  const nextSlide = () => goToSlide(currentIndex + 1)
  const previousSlide = () => goToSlide(currentIndex - 1)
  const firstSlide = () => goToSlide(0)
  const lastSlide = () => goToSlide(slideCount - 1)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (isEditableTarget(event.target)) {
        return
      }

      if (event.key === 'ArrowRight' || event.key === 'PageDown' || event.key === ' ') {
        event.preventDefault()
        nextSlide()
      }

      if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
        event.preventDefault()
        previousSlide()
      }

      if (event.key === 'Home') {
        event.preventDefault()
        firstSlide()
      }

      if (event.key === 'End') {
        event.preventDefault()
        lastSlide()
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  })

  const currentSlide = useMemo<SlideDefinition['component'] | null>(
    () => slides[currentIndex]?.component ?? null,
    [currentIndex],
  )

  return {
    currentIndex,
    currentSlide,
    firstSlide,
    goToSlide,
    lastSlide,
    nextSlide,
    previousSlide,
    slideCount,
  }
}
