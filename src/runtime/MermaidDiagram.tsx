import { useEffect, useRef, useState, type HTMLAttributes } from 'react'
import { clsx } from 'clsx'
import mermaid from 'mermaid'
import { twMerge } from 'tailwind-merge'

type MermaidDiagramProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  chart: string
  ariaLabel?: string
}

let hasInitializedMermaid = false
let renderCounter = 0

const initializeMermaid = () => {
  if (hasInitializedMermaid) {
    return
  }

  mermaid.initialize({
    securityLevel: 'strict',
    startOnLoad: false,
  })
  hasInitializedMermaid = true
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message
  }

  return 'Unable to render Mermaid diagram.'
}

export function MermaidDiagram({
  ariaLabel = 'Mermaid diagram',
  chart,
  className,
  ...props
}: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let isCancelled = false
    const diagramId = `mermaid-diagram-${++renderCounter}`
    const container = containerRef.current

    if (!container) {
      return undefined
    }

    initializeMermaid()
    container.innerHTML = ''

    const renderDiagram = async () => {
      const { bindFunctions, svg } = await mermaid.render(diagramId, chart)

      if (isCancelled) {
        return
      }

      container.innerHTML = svg
      bindFunctions?.(container)
      setErrorMessage(null)
    }

    renderDiagram().catch((error: unknown) => {
      if (isCancelled) {
        return
      }

      container.innerHTML = ''
      setErrorMessage(getErrorMessage(error))
    })

    return () => {
      isCancelled = true
      container.innerHTML = ''
    }
  }, [chart])

  return (
    <div
      {...props}
      aria-label={ariaLabel}
      className={twMerge(
        clsx(
          'mermaid-diagram relative flex h-full w-full items-center justify-center overflow-hidden',
          className,
        ),
      )}
      role="img"
    >
      <div className="h-full w-full" ref={containerRef} />
      {errorMessage ? (
        <div className="absolute inset-0 flex items-center justify-center bg-red-950/80 p-6 text-center font-mono text-[20px] leading-snug text-red-100">
          Mermaid render error: {errorMessage}
        </div>
      ) : null}
    </div>
  )
}
