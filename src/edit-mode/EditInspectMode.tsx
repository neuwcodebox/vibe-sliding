import { type RefObject, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { createEditReference, getElementLabel } from './elementReference'

type EditInspectModeProps = {
  active: boolean
  slideFile: string
  slideNumber: number
  stageRef: RefObject<HTMLDivElement | null>
}

type HoverState = {
  element: Element
  label: string
  rect: DOMRect
}

type StagePoint = {
  x: number
  y: number
  scaleX: number
  scaleY: number
}

const isElementInspectable = (element: Element, root: HTMLElement) => {
  if (!root.contains(element) || element.closest('[data-edit-inspect-ui="true"]')) {
    return false
  }

  if (['path', 'line', 'polyline', 'polygon', 'circle', 'rect'].includes(element.tagName.toLowerCase())) {
    return false
  }

  const style = window.getComputedStyle(element)
  return (
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.pointerEvents !== 'none'
  )
}

const getDepth = (element: Element, root: HTMLElement) => {
  let depth = 0
  let current: Element | null = element

  while (current && current !== root) {
    depth += 1
    current = current.parentElement
  }

  return depth
}

const getStagePoint = (
  clientX: number,
  clientY: number,
  root: HTMLElement,
): StagePoint | null => {
  const rootRect = root.getBoundingClientRect()
  const scaleX = rootRect.width / root.offsetWidth
  const scaleY = rootRect.height / root.offsetHeight

  if (scaleX <= 0 || scaleY <= 0) {
    return null
  }

  const x = (clientX - rootRect.left) / scaleX
  const y = (clientY - rootRect.top) / scaleY

  if (x < 0 || y < 0 || x > root.offsetWidth || y > root.offsetHeight) {
    return null
  }

  return { x, y, scaleX, scaleY }
}

const containsStagePoint = (
  element: Element,
  root: HTMLElement,
  point: StagePoint,
) => {
  const rootRect = root.getBoundingClientRect()
  const rect = element.getBoundingClientRect()
  const left = (rect.left - rootRect.left) / point.scaleX
  const top = (rect.top - rootRect.top) / point.scaleY
  const width = rect.width / point.scaleX
  const height = rect.height / point.scaleY

  return (
    width > 0 &&
    height > 0 &&
    point.x >= left &&
    point.x <= left + width &&
    point.y >= top &&
    point.y <= top + height
  )
}

const getInspectableElementAtPoint = (
  event: PointerEvent | MouseEvent,
  root: HTMLElement,
) => {
  const point = getStagePoint(event.clientX, event.clientY, root)

  if (!point) {
    return null
  }

  const candidates = Array.from(root.querySelectorAll('*'))
    .filter((element) => isElementInspectable(element, root))
    .filter((element) => containsStagePoint(element, root, point))

  const withAiId = candidates
    .filter((element) => element.hasAttribute('data-ai-id'))
    .sort((a, b) => getDepth(b, root) - getDepth(a, root))

  if (withAiId[0]) {
    return withAiId[0]
  }

  return candidates.reduce<Element | null>((best, element) => {
    if (!best) {
      return element
    }

    const bestDepth = getDepth(best, root)
    const elementDepth = getDepth(element, root)

    if (elementDepth !== bestDepth) {
      return elementDepth > bestDepth ? element : best
    }

    const bestRect = best.getBoundingClientRect()
    const elementRect = element.getBoundingClientRect()
    const bestArea = bestRect.width * bestRect.height
    const elementArea = elementRect.width * elementRect.height

    return elementArea < bestArea ? element : best
  }, null)
}

export function EditInspectMode({
  active,
  slideFile,
  slideNumber,
  stageRef,
}: EditInspectModeProps) {
  const [hover, setHover] = useState<HoverState | null>(null)
  const [copiedReference, setCopiedReference] = useState('')
  const [copyFailed, setCopyFailed] = useState(false)

  useEffect(() => {
    if (!active) {
      return
    }

    const root = stageRef.current
    if (!root) {
      return
    }

    const onPointerMove = (event: PointerEvent) => {
      const element = getInspectableElementAtPoint(event, root)

      if (!element) {
        setHover(null)
        return
      }

      setHover({
        element,
        label: getElementLabel(element),
        rect: element.getBoundingClientRect(),
      })
    }

    const onPointerLeave = () => setHover(null)

    const onClick = async (event: MouseEvent) => {
      const element = getInspectableElementAtPoint(event, root)

      if (!element) {
        return
      }

      event.preventDefault()
      event.stopPropagation()

      const reference = createEditReference({
        element,
        root,
        slideFile,
        slideNumber,
      })

      try {
        await navigator.clipboard.writeText(reference)
        setCopyFailed(false)
      } catch {
        setCopyFailed(true)
      }

      setCopiedReference(reference)
      window.setTimeout(() => setCopiedReference(''), 2600)
    }

    root.addEventListener('pointermove', onPointerMove, true)
    root.addEventListener('pointerleave', onPointerLeave, true)
    root.addEventListener('click', onClick, true)

    return () => {
      root.removeEventListener('pointermove', onPointerMove, true)
      root.removeEventListener('pointerleave', onPointerLeave, true)
      root.removeEventListener('click', onClick, true)
    }
  }, [active, slideFile, slideNumber, stageRef])

  if (!active) {
    return null
  }

  return createPortal(
    <div
      className="pointer-events-none fixed inset-0 z-50"
      data-edit-inspect-ui="true"
    >
      {hover ? (
        <>
          <div
            className="absolute rounded-sm border-2 border-cyan-300 bg-cyan-300/10 shadow-[0_0_0_1px_rgba(8,145,178,0.35)]"
            style={{
              left: hover.rect.left,
              top: hover.rect.top,
              width: hover.rect.width,
              height: hover.rect.height,
            }}
          />
          <div
            className="absolute max-w-[520px] truncate rounded bg-cyan-300 px-2.5 py-1 font-mono text-sm font-semibold text-slate-950 shadow-lg"
            style={{
              left: Math.max(8, hover.rect.left),
              top: Math.max(8, hover.rect.top - 30),
            }}
          >
            {hover.label}
          </div>
        </>
      ) : null}
      <div className="absolute left-5 top-5 rounded bg-cyan-300 px-3 py-1.5 font-mono text-sm font-semibold text-slate-950 shadow-lg">
        Edit Inspect Mode
      </div>
      {copiedReference ? (
        <div className="absolute bottom-5 left-1/2 max-w-[min(920px,calc(100vw-40px))] -translate-x-1/2 rounded bg-slate-950 px-4 py-3 font-mono text-sm text-white shadow-2xl">
          {copyFailed ? 'Clipboard unavailable: ' : 'Copied: '}
          <span className="text-cyan-200">{copiedReference}</span>
        </div>
      ) : null}
    </div>,
    document.body,
  )
}
