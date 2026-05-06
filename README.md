# Vibe Sliding

Vibe Sliding은 React 컴포넌트로 자신만의 슬라이드 쇼를 만드는 로컬 작업공간입니다. PPT처럼 GUI에서 모든 것을 편집하는 도구가 아니라, 브라우저는 미리보기와 발표 화면으로 쓰고 `src/slides/`의 소스 코드를 직접 편집하는 방식입니다.

슬라이드는 일반 React 컴포넌트라서 AI 코딩 에이전트가 수정하기 쉽고, 디자인 가이드는 `designs/`에 Markdown으로 분리되어 있어 발표마다 일관된 시각 방향을 줄 수 있습니다.

## 빠른 시작

```bash
npm install
npm run dev
```

Vite가 출력한 로컬 URL을 브라우저에서 열면 슬라이드 쇼를 볼 수 있습니다. 보통 `http://localhost:5173/` 형태입니다.

## 조작 방법

- 오른쪽 화살표, Space, 화면 클릭: 다음 슬라이드
- 왼쪽 화살표: 이전 슬라이드
- Home: 첫 슬라이드
- End: 마지막 슬라이드
- `?slide=N`: N번째 슬라이드 바로 열기
- `?edit=1`: Edit Inspect Mode 켜기

예시:

```txt
http://localhost:5173/?slide=3
http://localhost:5173/?slide=3&edit=1
```

## 내 슬라이드 쇼 만들기

1. `designs/`에서 발표에 맞는 디자인 가이드를 고릅니다.
2. `src/slides/`에 슬라이드 컴포넌트를 만들거나 기존 예시 슬라이드를 수정합니다.
3. `src/slides.ts`에 슬라이드 순서를 등록합니다.
4. 브라우저에서 결과를 확인합니다.
5. 필요하면 screenshot capture로 이미지를 저장해 레이아웃을 검토합니다.

새 슬라이드 쇼를 만들 때는 기존 예시 파일을 복사해서 시작하는 편이 가장 빠릅니다. 슬라이드는 고정 16:9 스테이지 안에서 렌더링되므로, 웹페이지처럼 세로로 스크롤되는 레이아웃이 아니라 한 장의 발표 화면을 만든다고 생각하면 됩니다.

## 디자인 가이드 고르기

기본 제공 가이드:

- `designs/minimal-dark.md`
- `designs/executive-clean.md`
- `designs/technical-grid.md`
- `designs/startup-pitch.md`

새 슬라이드를 만들거나 전체 스타일을 크게 바꿀 때는 사용할 디자인 가이드를 명시하세요. 예를 들어 AI 에이전트에게 이렇게 요청할 수 있습니다.

```txt
Use designs/technical-grid.md. Create a 5-slide deck about our internal AI agent platform.
```

작은 문구 수정, 오타 수정, 좁은 버그 수정은 기존 슬라이드의 스타일을 유지하면 됩니다.

## 슬라이드 추가하기

새 파일을 만듭니다.

```txt
src/slides/004-topic.tsx
```

슬라이드 컴포넌트는 default export로 작성하고, 루트 요소가 전체 스테이지를 채우도록 `h-full w-full`을 사용합니다.

```tsx
export default function Slide004Topic() {
  return <section className="h-full w-full">...</section>
}
```

그 다음 `src/slides.ts`에 등록합니다.

```ts
import Slide004 from './slides/004-topic'

export const slides = [
  // existing slides
  {
    component: Slide004,
    file: 'src/slides/004-topic.tsx',
  },
]
```

파일명은 `004-topic.tsx`처럼 세 자리 숫자와 짧은 주제를 사용하고, 컴포넌트명은 `Slide004Topic`처럼 PascalCase를 사용하세요.

## AI가 수정하기 쉽게 만들기

중요한 제목, 카드, 차트, 섹션에는 `data-ai-id`를 붙이면 나중에 AI에게 정확히 지시하기 쉽습니다.

```tsx
<h1 data-ai-id="main-title">Quarterly Roadmap</h1>
```

좋은 이름:

- `main-title`
- `cost-chart`
- `workflow-summary`

피해야 할 이름:

- `blue-box`
- `left-thing`
- `big-text`

## Edit Inspect Mode

수정하고 싶은 요소를 브라우저에서 직접 가리켜 참조를 얻고 싶다면 Edit Inspect Mode를 사용합니다.

```txt
http://localhost:5173/?slide=3&edit=1
```

활성화하면 마우스 아래 요소가 강조되고, 클릭하면 한 줄짜리 참조가 복사됩니다.

```txt
@element(slide=3 file="src/slides/003-content.tsx" target="data-ai-id=runtime-flow-title" text="Runtime flow")
```

이 참조를 AI 에이전트에게 붙여 넣으면 “3번 슬라이드의 이 요소를 수정해줘”처럼 좌표 설명 없이 요청할 수 있습니다. 클립보드 접근이 실패하면 화면에 참조가 표시됩니다.

## 스크린샷으로 검토하기

먼저 개발 서버를 켜둡니다.

```bash
npm run dev
```

특정 슬라이드만 캡처합니다.

```bash
npm run capture:slide -- 3
```

전체 슬라이드를 캡처합니다.

```bash
npm run capture:all
```

결과는 `screenshots/slide-001.png`, `screenshots/slide-002.png` 같은 이름으로 저장됩니다. 생성된 PNG 파일은 git에 포함되지 않습니다.

차트나 애니메이션이 있는 슬라이드는 캡처 전에 잠시 기다립니다. 필요하면 대기 시간을 조정할 수 있습니다.

```bash
SLIDE_CAPTURE_SETTLE_MS=2000 npm run capture:slide -- 3
```

## 새 디자인 가이드 만들기

새로운 발표 톤이 필요하면 `designs/` 아래에 디자인 가이드를 추가합니다.

1. `skills/design-guide-authoring/assets/design-guide-template.md`의 구조를 사용합니다.
2. 완성 예시는 `skills/design-guide-authoring/assets/design-guide-example.md`를 참고합니다.
3. 새 파일을 `designs/my-design.md`처럼 저장합니다.
4. 색상, 타이포그래피, 레이아웃, 시각 요소, 모션, Do/Don't, Agent Prompt Guide를 구체적으로 작성합니다.

디자인 가이드는 특정 한 장의 슬라이드 내용이 아니라 여러 슬라이드에 반복 적용할 수 있는 시각 규칙이어야 합니다.

## 검증

타입 검사를 실행합니다.

```bash
npm run typecheck
```

프로덕션 빌드까지 확인합니다.

```bash
npm run build
```

린트를 실행합니다.

```bash
npm run lint
```

## 프로젝트 구조

```txt
src/
  App.tsx
  slides.ts
  runtime/
  edit-mode/
  slides/
  styles/
designs/
skills/
scripts/
public/
screenshots/
```

자주 수정하는 위치:

- `src/slides/`: 실제 슬라이드 컴포넌트
- `src/slides.ts`: 슬라이드 등록 순서
- `designs/`: 발표 스타일 가이드
- `screenshots/`: 캡처 결과

대부분의 발표 내용과 시각 수정은 `src/slides/` 안에서 해결하는 것이 좋습니다. `runtime/`, `edit-mode/`, `styles/global.css`는 여러 슬라이드 쇼에서 공통으로 쓰는 일반 기능을 위한 코드입니다.
