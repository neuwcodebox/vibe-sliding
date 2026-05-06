import type { ComponentType } from 'react'
import Slide001 from './slides/001-title'
import Slide002 from './slides/002-agenda'
import Slide003 from './slides/003-content'

export type SlideDefinition = {
  component: ComponentType
  file: string
}

export const slides: SlideDefinition[] = [
  {
    component: Slide001,
    file: 'src/slides/001-title.tsx',
  },
  {
    component: Slide002,
    file: 'src/slides/002-agenda.tsx',
  },
  {
    component: Slide003,
    file: 'src/slides/003-content.tsx',
  },
]
