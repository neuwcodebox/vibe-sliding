import { forwardRef, type ReactNode } from 'react'
import { STAGE_HEIGHT, STAGE_WIDTH, useStageScale } from './useStageScale'

type SlideStageProps = {
  children: ReactNode
  isCursorHidden?: boolean
  onStageClick?: () => void
}

export const SlideStage = forwardRef<HTMLDivElement, SlideStageProps>(
  ({ children, isCursorHidden = false, onStageClick }, ref) => {
    const scale = useStageScale()

    return (
      <main className="slide-viewer" aria-label="Slide viewer">
        <div
          className="slide-stage-frame"
          style={{
            width: STAGE_WIDTH * scale,
            height: STAGE_HEIGHT * scale,
          }}
        >
          <div
            ref={ref}
            className={`slide-stage${isCursorHidden ? ' cursor-hidden' : ''}`}
            onClick={onStageClick}
            style={{
              width: STAGE_WIDTH,
              height: STAGE_HEIGHT,
              transform: `scale(${scale})`,
            }}
          >
            {children}
          </div>
        </div>
      </main>
    )
  },
)

SlideStage.displayName = 'SlideStage'
