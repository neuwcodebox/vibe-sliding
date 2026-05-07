import { useEffect, useState } from 'react'
import { exportToPptx } from 'dom-to-pptx'
import { SlideErrorBoundary } from '../runtime/SlideErrorBoundary'
import { slides } from '../slides'

const STAGE_WIDTH = 1920
const STAGE_HEIGHT = 1080
const DEFAULT_SETTLE_MS = 1200
const EXPORT_SLIDE_SELECTOR = '[data-pptx-export-slide]'

const blobToBase64 = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.addEventListener('load', () => {
      const result = reader.result

      if (typeof result !== 'string') {
        reject(new Error('Could not read editable PPTX blob.'))
        return
      }

      resolve(result.split(',')[1] ?? '')
    })
    reader.addEventListener('error', () => {
      reject(reader.error ?? new Error('Could not read editable PPTX blob.'))
    })
    reader.readAsDataURL(blob)
  })

const waitForSettling = (settleMs: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, settleMs)
  })

export function EditablePptxExportMode() {
  const [status, setStatus] = useState('Ready to export editable PPTX.')

  useEffect(() => {
    window.__vibeSlidingExportEditablePptx = async (options = {}) => {
      const settleMs = options.settleMs ?? DEFAULT_SETTLE_MS

      setStatus('Waiting for slide rendering to settle.')
      await waitForSettling(settleMs)

      const slideElements = Array.from(
        document.querySelectorAll<HTMLElement>(EXPORT_SLIDE_SELECTOR),
      )

      if (slideElements.length < 1) {
        throw new Error('No editable PPTX export slides were rendered.')
      }

      setStatus(`Exporting ${slideElements.length} editable slides.`)
      const blob = await exportToPptx(slideElements, {
        fileName: options.fileName ?? 'vibe-sliding-editable.pptx',
        layout: 'LAYOUT_16x9',
        skipDownload: true,
        svgAsVector: true,
      })
      const base64 = await blobToBase64(blob)

      setStatus(`Exported ${slideElements.length} editable slides.`)

      return {
        base64,
        slideCount: slideElements.length,
      }
    }

    return () => {
      delete window.__vibeSlidingExportEditablePptx
    }
  }, [])

  return (
    <main
      aria-label="Editable PPTX export surface"
      className="min-h-full bg-neutral-950 p-8 text-white"
    >
      <div className="mb-8 font-mono text-sm text-white/60">{status}</div>
      <div className="flex flex-col gap-8">
        {slides.map((slideDefinition, index) => {
          const SlideComponent = slideDefinition.component
          const slideNumber = index + 1

          return (
            <section
              aria-label={`Slide ${slideNumber}`}
              className="relative overflow-hidden"
              data-pptx-export-slide
              key={slideDefinition.file}
              style={{
                height: STAGE_HEIGHT,
                width: STAGE_WIDTH,
              }}
            >
              <SlideErrorBoundary
                resetKeys={[slideNumber, SlideComponent]}
                slideFile={slideDefinition.file}
                slideNumber={slideNumber}
              >
                <SlideComponent />
              </SlideErrorBoundary>
            </section>
          )
        })}
      </div>
    </main>
  )
}
