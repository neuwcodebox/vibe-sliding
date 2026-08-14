# Vibe Sliding

[English README](README.md)

![Vibe Sliding 작업공간 미리보기](docs/hero.png)

Vibe Sliding은 AI 코딩 에이전트에게 슬라이드 쇼 생성, 수정, 검토를 맡기기 위한 로컬 작업공간입니다. 사용자는 미리보기 서버를 실행하고, 테마를 고르고, 원하는 발표 자료를 설명하면 됩니다. 실제 `src/slides/`의 React 컴포넌트 작성은 AI Agent가 담당합니다.

이 프로젝트는 GUI 중심의 PowerPoint 대체제가 아닙니다. 브라우저는 미리보기와 발표 화면이고, `src/slides/` 아래 파일들은 AI Agent가 사용자를 대신해 수정하는 소스 파일입니다.

## 데모 덱

포함된 데모 덱은 테마 leaf 선택, Agent에게 덱 요청, 특정 요소 inspect, 생성된 슬라이드 검토 흐름을 보여줍니다.

호스팅된 데모는 [https://neuwcodebox.github.io/vibe-sliding/](https://neuwcodebox.github.io/vibe-sliding/)에서 볼 수 있습니다.

![Vibe Sliding 데모 슬라이드 그리드](docs/demo-slides-grid.png)

## 빠른 시작

```bash
npm install
npm run dev
```

Vite가 출력한 로컬 URL을 브라우저에서 열면 슬라이드 쇼를 볼 수 있습니다. 보통 `http://localhost:5173/` 형태입니다.

## 이 프로젝트로 얻는 것

- 로컬 브라우저 기반 슬라이드 뷰어
- AI Agent가 안정적으로 수정할 수 있는 React 슬라이드 코드베이스
- `designs/` 아래에서 일원화한 동등한 테마 컬렉션 카탈로그
- 슬라이드 요소를 가리켜 정확한 수정 참조를 복사하는 Edit Inspect Mode
- 생성된 슬라이드를 이미지로 검토하는 screenshot capture 스크립트
- 렌더된 덱을 PowerPoint에서 공유하기 위한 이미지 기반 및 실험적 편집 가능 PPTX export
- 플로우차트, 시퀀스 다이어그램 등 기술 시각화를 위한 Mermaid 렌더링

의도된 흐름은 “사용자가 슬라이드 쇼를 설명하고, Agent가 소스를 수정하고, 사용자가 브라우저에서 결과를 검토하는 방식”입니다.

## 조작 방법

- 오른쪽 화살표, 아래쪽 화살표, Space, 화면 클릭: 다음 슬라이드
- 왼쪽 화살표 또는 위쪽 화살표: 이전 슬라이드
- Home: 첫 슬라이드
- End: 마지막 슬라이드
- `?slide=N`: N번째 슬라이드 바로 열기
- `?edit=1`: Edit Inspect Mode 켜기
- `P`: Presenter View 팝업 열기 (대본, 다음 슬라이드, 경과 시간)

Presenter View에서는 다음 단축키를 사용할 수 있습니다.

- `B` / `W`: 청중 화면을 검정 / 흰색으로 전환
- `F`: 청중 화면을 고정한 채 발표자만 슬라이드 이동
- `L`: 레이저 포인터 켜기·끄기
- `D`: 펜 주석 켜기·끄기, `C`: 현재 주석 지우기

예시:

```txt
http://localhost:5173/?slide=3
http://localhost:5173/?slide=3&edit=1
http://localhost:5173/?slide=3&presenter=1
```

## Agent에게 슬라이드 쇼 생성 요청하기

1. `designs/README.md`의 컬렉션에서 발표에 맞는 테마 하나를 고르거나, Agent에게 선택을 명시적으로 맡깁니다.
2. 주제, 청중, 슬라이드 수, 톤, 반드시 포함할 내용을 Agent에게 설명합니다.
3. Agent에게 슬라이드 컴포넌트를 생성하거나 수정해 달라고 요청합니다.
4. 브라우저에서 결과를 확인합니다.
5. 스크린샷이나 Edit Inspect Mode를 사용해 구체적인 수정 요청을 이어갑니다.

예시 프롬프트:

```txt
Use designs/basics/technical-grid.md. Create a 5-slide deck about our internal AI agent platform for an engineering leadership audience. Keep the style technical, structured, and presentation-ready.
```

전체 스타일을 크게 바꿀 때는 테마 하나를 명시하거나 Agent에게 선택을 명시적으로 맡기세요. 둘 다 없다면 Agent가 시각 시스템을 바꾸기 전에 물어봐야 합니다. 작은 문구 수정, 오타 수정, 좁은 버그 수정은 기존 슬라이드 스타일을 유지하라고 요청하면 됩니다.

## 테마 leaf 고르기

[`designs/README.md`](designs/README.md)가 카탈로그와 선택 규칙을 제공합니다. 이곳의 컬렉션은 동등합니다. 관리·라이선스 방식은 다르지만, 덱을 고를 때 어느 한쪽이 우위에 있지 않습니다.

| 컬렉션 | 선택 가능한 leaf | 탐색 방법 |
| --- | --- | --- |
| [`basics/`](designs/basics/README.md) | 컬렉션 README에 적힌 `<theme>.md` 파일 하나 | 컬렉션 README |
| [`beautiful-html-templates/`](designs/beautiful-html-templates/) | `templates/<theme>/` 디렉터리 하나 | `index.json` 후 후보 메타데이터 |

새 덱이나 큰 리디자인에는 leaf 하나를 명시하거나 Agent에게 선택을 명시적으로 맡기세요. 컬렉션 README, `index.json`, 라이선스, 출처 파일은 탐색용이며 테마 자체가 아닙니다. 두 테마를 같은 비중의 시스템으로 섞지 않고, 선택 결과를 설정 파일에 저장하지 않습니다.

예시:

```txt
Use designs/basics/technical-grid.md as the theme. Create a 5-slide architecture review for engineering leaders.
```

```txt
Use designs/beautiful-html-templates/templates/cobalt-grid/ as the theme. Create a 5-slide product demo for engineering leaders.
```

Beautiful HTML Templates를 고를 때 Agent는 먼저 `index.json`에서 후보를 찾고, 관련 후보의 메타데이터와 디자인 가이드만 읽습니다. 구현에 필요한 세부 사항이 있을 때만 선택된 템플릿의 HTML 원본을 엽니다. 템플릿의 시각 문법은 유지하되, 실제 콘텐츠·고정 1920×1080 React 스테이지·설치된 글꼴 스택으로 번역합니다. 원본 HTML 런타임, 샘플 문구, 내비게이션, 원격 글꼴 설정은 가져오지 않습니다.

## Agent가 수정하는 파일

일반적인 덱 생성·수정에서 Agent는 보통 다음 파일을 수정합니다.

- `src/slides/`: 생성된 슬라이드 컴포넌트
- `src/slides.ts`: 슬라이드 등록 순서

`designs/`는 재사용할 테마의 추가·수정이나 원문 보존 외부 스냅샷 갱신을 명시적으로 요청할 때만 바뀝니다. 덱에 사용할 테마를 고르는 행위만으로는 컬렉션 파일을 수정하지 않습니다.

생성되는 슬라이드는 고정 16:9 스테이지를 채우는 default-export React 컴포넌트입니다.

```tsx
export default function Slide004Topic() {
  return <section className="h-full w-full">...</section>
}
```

Agent는 해당 슬라이드를 `src/slides.ts`에도 등록해야 합니다.

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

사용자가 이 패턴을 외울 필요는 없지만, Agent가 어떤 작업을 해야 하는지 이해하는 데 도움이 됩니다.

## Mermaid 다이어그램 추가하기

플로우차트, 시퀀스 다이어그램 등 Mermaid가 지원하는 시각 요소가 필요하면 `MermaidDiagram`을 사용합니다.

```tsx
import { MermaidDiagram } from '../runtime/MermaidDiagram'

const chart = `---
config:
  theme: base
  themeVariables:
    darkMode: true
    background: '#0B1020'
    primaryColor: '#111827'
    primaryTextColor: '#F8FAFC'
    primaryBorderColor: '#334155'
    lineColor: '#5EEAD4'
    fontFamily: 'Inter, Noto Sans KR, sans-serif'
---
flowchart LR
  A[Prompt] --> B[React slide]
  B --> C[Browser review]
`

export default function Slide004Topic() {
  return <MermaidDiagram chart={chart} className="h-[420px]" />
}
```

다이어그램별 테마는 chart 문자열 상단의 YAML frontmatter로 설정합니다. Mermaid `%%{init:...}%%` directive도 호환성상 동작할 수 있지만, 새 슬라이드 예시는 frontmatter 방식을 권장합니다.

## Agent가 정확히 수정할 수 있게 만들기

중요한 제목, 카드, 차트, 섹션에는 `data-ai-id`가 붙어 있으면 이후 수정 요청을 정확히 할 수 있습니다.

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

브라우저에서 특정 요소를 직접 가리킨 뒤 Agent에게 “이 요소를 수정해 달라”고 요청하고 싶을 때 사용합니다.

```txt
http://localhost:5173/?slide=3&edit=1
```

활성화하면 마우스 아래 요소가 강조되고, 클릭하면 한 줄짜리 참조가 복사됩니다.

```txt
@element(slide=3 file="src/slides/003-content.tsx" target="data-ai-id=runtime-flow-title" text="Runtime flow")
```

이 참조를 다음 Agent 요청에 붙여 넣으세요.

```txt
Change @element(slide=3 file="src/slides/003-content.tsx" target="data-ai-id=runtime-flow-title" text="Runtime flow") to make the heading shorter and align it with the chart below.
```

클립보드 접근이 실패하면 화면에 참조가 표시됩니다.

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

기본 데모 덱을 바꿨다면 위 README에 쓰이는 그리드도 갱신합니다.

```bash
npm run capture:all
npm run capture:demo-grid
```

그리드는 `src/slides.ts`에 현재 등록된 슬라이드만 사용하며
`docs/demo-slides-grid.png`에 저장됩니다.

차트나 애니메이션이 있는 슬라이드는 캡처 전에 잠시 기다립니다. 필요하면 대기 시간을 조정할 수 있습니다.

```bash
SLIDE_CAPTURE_SETTLE_MS=2000 npm run capture:slide -- 3
```

## PowerPoint로 내보내기

PPTX export는 스크린샷과 같은 브라우저 렌더링 경로를 사용합니다. 먼저 개발 서버를 켜둡니다.

```bash
npm run dev
```

등록된 모든 슬라이드를 이미지 기반 PPTX로 기본 경로에 내보냅니다.

```bash
npm run export:pptx
```

원하는 출력 경로를 지정할 수도 있습니다.

```bash
npm run export:pptx -- exports/demo.pptx
```

기본 출력 파일은 `exports/vibe-sliding.pptx`입니다. 생성된 PPTX는 이미지 기반입니다. 각 슬라이드가 한 장의 전체 화면 PNG로 들어가므로 PowerPoint에서 발표할 수는 있지만, 텍스트 상자, 도형, 차트, 다이어그램을 개별 요소로 편집할 수는 없습니다.

실험적인 편집 가능 PPTX도 만들 수 있습니다.

```bash
npm run export:pptx:editable
```

편집 가능 export도 출력 경로를 지정할 수 있습니다.

```bash
npm run export:pptx:editable -- exports/demo-editable.pptx
```

편집 가능 export의 기본 출력 파일은 `exports/vibe-sliding-editable.pptx`입니다. 이 경로는 `dom-to-pptx`를 사용해 스케일 없는 1920x1080 슬라이드 DOM을 PowerPoint 텍스트, 도형, 이미지, SVG 객체로 변환하려고 시도합니다. 편집 가능성이 중요할 때 사용하고, 시각적 재현성이 더 중요하면 이미지 기반 export를 권장합니다. 일부 차트, Mermaid 다이어그램, SVG, 고급 CSS, 효과는 완전한 PowerPoint native 객체가 아니라 부분 변환되거나 SVG/이미지 객체로 들어갈 수 있습니다.

다른 개발 서버 URL을 사용해야 하면 두 export 명령 모두에 `SLIDE_BASE_URL`을 지정할 수 있습니다.

```bash
SLIDE_BASE_URL=http://localhost:4173 npm run export:pptx
SLIDE_BASE_URL=http://localhost:4173 npm run export:pptx:editable
```

차트나 애니메이션이 있는 슬라이드는 export 전에 잠시 기다립니다. 필요하면 대기 시간을 조정할 수 있습니다.

```bash
SLIDE_CAPTURE_SETTLE_MS=2000 npm run export:pptx
SLIDE_CAPTURE_SETTLE_MS=2000 npm run export:pptx:editable
```

## Agent에게 새 Basics 테마 요청하기

두 컬렉션의 기존 테마 어디에도 앞으로 반복 사용할 방향이 없다면 Agent에게 `designs/basics/` 아래에 새 Basics 테마를 만들라고 요청하세요.

예시 프롬프트:

```txt
Create a new Basics theme under designs/basics/ for executive product strategy reviews. Use a restrained, high-density style with strong chart readability.
```

Agent는 `skills/design-guide-authoring/assets/design-guide-template.md`를 구조로 사용하고, `skills/design-guide-authoring/assets/design-guide-example.md`를 완성 예시로 참고해야 합니다.

Basics 테마는 특정 한 장의 슬라이드 내용이 아니라 여러 슬라이드에 반복 적용할 수 있는 시각 규칙이어야 합니다. 선택한 외부 테마를 편의상 다시 풀어쓴 중복 문서여서는 안 됩니다.

## GitHub Pages에 배포하기

이 프로젝트는 GitHub Actions로 `dist/` 프로덕션 빌드 산출물을 GitHub Pages에 게시할 수 있습니다. 포함된 워크플로는 `main`에 푸시될 때 자동으로 배포하며, Actions 탭에서 수동 실행도 가능합니다.

배포 base path는 `vite.config.ts`에 하드코딩하지 않고 `VITE_BASE_PATH`로 제어합니다. 이 저장소의 프로젝트 사이트용 워크플로에서는 다음 값을 사용합니다.

```txt
VITE_BASE_PATH=/vibe-sliding/
```

프로젝트를 포크하거나, 저장소명을 바꾸거나, 커스텀 도메인을 쓰는 경우 `.github/workflows/deploy-pages.yml`의 `VITE_BASE_PATH`만 수정하면 됩니다. 앱이 도메인 루트에서 제공된다면 `/`를 사용하세요. 로컬 예시는 `.env.example`을 참고하세요.

GitHub에서는 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 설정하세요.

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
  README.md
  basics/
  beautiful-html-templates/
skills/
scripts/
public/
screenshots/
exports/
```

공유 인프라:

- `src/runtime/`: 뷰어 런타임, 스케일링, 내비게이션
- `src/edit-mode/`: 요소 검사와 복사되는 참조
- `src/styles/global.css`: 앱 전역 기본 스타일

덱별 콘텐츠:

- `src/slides/`: Agent가 생성하는 슬라이드 컴포넌트
- `src/slides.ts`: 슬라이드 등록 순서
- `designs/`: 테마 컬렉션 카탈로그, Basics 테마, 원본 보존 테마
- `screenshots/`: 캡처된 슬라이드 이미지
- `exports/`: 생성된 PPTX 파일

대부분의 발표 내용과 시각 수정은 `src/slides/` 안에서 해결해야 합니다. `runtime/`, `edit-mode/`, `styles/global.css`는 여러 슬라이드 쇼에서 재사용되는 일반 인프라로 유지해야 합니다.
