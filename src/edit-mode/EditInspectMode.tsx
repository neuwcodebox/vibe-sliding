import { type RefObject, useEffect, useState } from 'react'
import { createEditReference, getElementLabel } from './elementReference'

type EditInspectModeProps = {
  active: boolean
  slideFile: string
  slideNumber: number
  stageRef: RefObject<HTMLDivElement | null>
}

type HoverState = {
  element: HTMLElement
  label: string
  rect: DOMRect
}

const isInspectableElement = (
  target: EventTarget | null,
  root: HTMLElement,
): target is HTMLElement =>
  target instanceof HTMLElement &&
  root.contains(target) &&
  !target.closest('[data-edit-inspect-ui="true"]')

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
      if (!isInspectableElement(event.target, root)) {
        setHover(null)
        return
      }

      const element = event.target
      setHover({
        element,
        label: getElementLabel(element),
        rect: element.getBoundingClientRect(),
      })
    }

    const onPointerLeave = () => setHover(null)

    const onClick = async (event: MouseEvent) => {
      if (!isInspectableElement(event.target, root)) {
        return
      }

      event.preventDefault()
      event.stopPropagation()

      const reference = createEditReference({
        element: event.target,
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

  return (
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
    </div>
  )
}
