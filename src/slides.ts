import type { ComponentType } from 'react'
import Slide001 from './slides/001-title'
import Slide002 from './slides/002-agenda'
import Slide003 from './slides/003-content'
import Slide004 from './slides/004-demo-summary'
import Slide005 from './slides/005-review-loop'

export type SlideDefinition = {
  component: ComponentType
  file: string
  /** Optional presenter-only script. This never appears on the audience screen. */
  notes?: string[]
}

export const slides: SlideDefinition[] = [
  {
    component: Slide001,
    file: 'src/slides/001-title.tsx',
    notes: [
      '오늘은 Vibe Sliding이 무엇을 해결하는지 짧게 소개합니다.',
      '핵심은 슬라이드의 결과물뿐 아니라, 수정 가능한 React 소스를 함께 남긴다는 점입니다.',
    ],
  },
  {
    component: Slide002,
    file: 'src/slides/002-agenda.tsx',
    notes: [
      '발표 흐름은 이야기 설계, 테마 선택, 구현, 그리고 브라우저 검토의 순서입니다.',
      '각 단계는 에이전트와 사람이 나눠 맡을 수 있도록 단순하게 설계했습니다.',
    ],
  },
  {
    component: Slide003,
    file: 'src/slides/003-content.tsx',
    notes: [
      '이 슬라이드는 실제 작업 루프를 보여줍니다. 먼저 발표자가 원하는 내용과 청중, 전달 방식, 그리고 반드시 포함해야 할 근거를 짧은 요청으로 정리합니다. 이 단계에서 디자인 테마를 하나 고르면 이후의 시각적 판단도 한 방향으로 모일 수 있습니다.',
      '다음으로 에이전트가 React 슬라이드 소스를 만들고, 브라우저에서 실제 16:9 스테이지로 렌더링합니다. 여기서 중요한 점은 결과 이미지에만 만족하지 않고, 나중에 수정 가능한 구조와 의미 있는 data-ai-id까지 함께 남긴다는 것입니다.',
      '검토 단계에서는 스크린샷을 보며 여백, 대비, 줄바꿈, 정보 밀도를 확인합니다. 특정 요소를 바꾸고 싶다면 Edit Inspect Mode로 요소 참조를 복사해 요청할 수 있으므로 “왼쪽의 파란 박스” 같은 모호한 피드백을 줄일 수 있습니다.',
      '이처럼 요청·구현·검토를 짧게 반복하면 발표 직전의 수정도 안전하게 처리할 수 있습니다. 지금 Presenter View에서는 이 정도 길이의 대본이 영역 안에서 스크롤되는 모습을 확인할 수 있습니다.',
    ],
  },
  {
    component: Slide004,
    file: 'src/slides/004-demo-summary.tsx',
    notes: [
      '데모 덱은 결과물이 아니라 반복 가능한 작업 방식의 예시입니다.',
      'P 키를 누르면 지금 보고 있는 Presenter View가 별도 창으로 열립니다.',
    ],
  },
  {
    component: Slide005,
    file: 'src/slides/005-review-loop.tsx',
    notes: [
      '마지막으로, 시각 검토를 코드 작성의 일부로 둡니다.',
      '대본이 비어 있는 슬라이드도 Presenter View에서 명확히 표시하므로 발표 중 당황하지 않습니다.',
    ],
  },
]
