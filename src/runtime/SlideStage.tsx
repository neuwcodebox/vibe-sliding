import { forwardRef, type PointerEvent, type ReactNode } from 'react'
import { STAGE_HEIGHT, STAGE_WIDTH, useStageScale } from './useStageScale'

type SlideStageProps = {
  children: ReactNode
  isCursorHidden?: boolean
  onStageClick?: () => void
  onStagePointerDown?: (event: PointerEvent<HTMLDivElement>) => void
  onStagePointerLeave?: () => void
  onStagePointerMove?: (event: PointerEvent<HTMLDivElement>) => void
  onStagePointerUp?: (event: PointerEvent<HTMLDivElement>) => void
}

export const SlideStage = forwardRef<HTMLDivElement, SlideStageProps>(
  ({ children, isCursorHidden = false, onStageClick, onStagePointerDown, onStagePointerLeave, onStagePointerMove, onStagePointerUp }, ref) => {
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
            onDragStart={(event) => event.preventDefault()}
            onPointerDown={onStagePointerDown}
            onPointerLeave={onStagePointerLeave}
            onPointerMove={onStagePointerMove}
            onPointerUp={onStagePointerUp}
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
