# Vibe Sliding

[English README](README.md)

![Vibe Sliding 작업공간 미리보기](docs/hero.png)

Vibe Sliding은 AI 코딩 에이전트와 함께 슬라이드 덱을 만들고, 발표하고, 검토하는 로컬 작업공간입니다. 사용자가 덱을 설명하면 Agent가 평범한 React 컴포넌트를 수정하고, 브라우저가 미리보기와 발표 화면이 됩니다.

이 프로젝트는 GUI 중심의 PowerPoint 대체제가 아닙니다. 진짜 원본은 `src/slides/` 아래의 코드이며, 스크린샷과 PPTX는 같은 브라우저 렌더링 경로에서 만들어지는 결과물입니다.

포함된 데모 덱은 이 작업 흐름을 직접 소개합니다. 호스팅된 버전은 [neuwcodebox.github.io/vibe-sliding](https://neuwcodebox.github.io/vibe-sliding/)에서 볼 수 있습니다.

![Vibe Sliding 데모 슬라이드 그리드](docs/demo-slides-grid.png)

## 빠른 시작

```bash
npm install
npm run dev
```

Vite가 출력한 로컬 URL을 브라우저에서 여세요. 보통 `http://localhost:5173/`입니다.

기본 작업 흐름은 다음과 같습니다.

1. 디자인 leaf 하나를 고르거나 Agent에게 선택을 명시적으로 맡깁니다.
2. 청중, 목적, 슬라이드 수, 톤, 필수 내용을 설명합니다.
3. Agent가 `src/slides/`와 `src/slides.ts`를 생성하거나 수정합니다.
4. 브라우저에서 렌더링된 덱을 검토합니다.
5. Edit Mode나 스크린샷으로 정확한 수정을 요청합니다.
6. 브라우저에서 발표하거나 완성된 덱을 PPTX로 내보냅니다.

## 덱 생성과 수정

### Agent에게 요구사항 전달하기

좋은 요청에는 콘텐츠의 역할과 덱을 지배할 디자인 방향이 함께 들어갑니다.

```txt
Use designs/basics/themes/technical-grid.md. Create a 5-slide deck about our internal AI agent platform for an engineering leadership audience. Keep the style technical, structured, and presentation-ready.
```

새 덱이나 큰 리디자인에는 디자인 leaf 하나를 명시하거나 선택을 Agent에게 명시적으로 맡기세요. 둘 다 없다면 Agent가 시각 시스템을 바꾸기 전에 물어봐야 합니다. 오타, 문구 조정, 좁은 버그 수정은 현재 덱의 스타일을 유지합니다.

### 디자인 leaf 하나 고르기

[`designs/README.md`](designs/README.md)는 디자인 카탈로그와 선택 규칙입니다. 바로 아래의 컬렉션은 서로 동등하지만 제공하는 디자인 지침의 수준은 다릅니다.

| 컬렉션 | 선택 가능한 leaf | 디자인 수준 |
| --- | --- | --- |
| [`basics/`](designs/basics/README.md) | `index.json`에 등록된 `themes/<theme>.md` 파일 | 완전한 디자인 시스템 |
| [`beautiful-html-templates/`](designs/beautiful-html-templates/) | `templates/<theme>/` 디렉터리 | 슬라이드 템플릿과 반복 가능한 구조 |
| [`pptx-design-styles/`](designs/pptx-design-styles/) | `index.json`에 등록된 `styles/` 파일 | 시각 스타일 레퍼런스 |

컬렉션 README, `index.json`, 라이선스, 출처 파일은 탐색용이지 선택 가능한 leaf가 아닙니다. 두 테마를 같은 비중으로 섞지 말고, 하나의 leaf를 덱의 지배적인 방향으로 사용하세요. 선택 결과는 작업 요청에만 존재하며 프로젝트 설정에 저장하지 않습니다.

예시:

```txt
Use designs/basics/themes/technical-grid.md as the theme. Create a 5-slide architecture review for engineering leaders.
```

```txt
Use designs/beautiful-html-templates/templates/cobalt-grid/ as the theme. Create a 5-slide product demo for engineering leaders.
```

각 컬렉션은 디자인 수준에 맞게 탐색합니다.

- Basics는 `basics/index.json`에서 후보를 고른 뒤 선택한 Markdown 디자인 시스템을 읽습니다.
- Beautiful HTML Templates는 `index.json`에서 후보를 고르고 관련 있는 `template.json`과 `design.md`만 읽습니다. 구조 구현에 세부 정보가 필요할 때만 `template.html`을 엽니다. 시각 문법은 고정 1920×1080 React 스테이지와 설치된 글꼴에 맞게 번역하되, 원본 HTML 런타임, 샘플 문구, 내비게이션, 원격 글꼴 설정은 가져오지 않습니다.
- PPTX Design Styles는 `index.json`에서 후보를 고른 뒤 선택한 스타일 파일을 읽습니다. 스타일 레퍼런스는 시각 단서만 제공하므로 덱의 주장, 근거, 구성은 별도로 설계해야 합니다.

### Agent가 수정하는 범위 이해하기

일반적인 덱 작업은 다음 위치에 머물러야 합니다.

- `src/slides/`: 덱별 React 슬라이드 컴포넌트
- `src/slides.ts`: 명시적인 등록 순서, 소스 경로, 선택적 발표자 노트

디자인 leaf를 선택하는 것만으로 `designs/`가 바뀌지는 않습니다. 재사용할 디자인의 추가·수정이나 외부 스냅샷 갱신을 명시적으로 요청할 때만 이 디렉터리를 변경합니다.

각 슬라이드는 고정 16:9 스테이지를 채우는 default-export 컴포넌트입니다.

```tsx
export default function Slide004Topic() {
  return <section className="h-full w-full">...</section>
}
```

`src/slides.ts`에도 등록해야 합니다.

```ts
import Slide004 from './slides/004-topic'

export const slides = [
  {
    component: Slide004,
    file: 'src/slides/004-topic.tsx',
    notes: ['결론부터 소개합니다.', '여기에서 질문을 받습니다.'],
  },
]
```

`notes`는 선택 사항입니다. 각 문자열은 Presenter View에서 별도 문단으로 표시되며 청중 화면에는 나타나지 않습니다.

공용 뷰어 동작은 `src/runtime/`과 `src/edit-mode/`에 둡니다. 특정 덱의 레이아웃 문제를 이곳이나 `src/styles/global.css`에서 해결하지 않습니다.

### Mermaid 다이어그램 추가하기

플로우차트, 시퀀스 다이어그램 등 Mermaid가 지원하는 시각 요소에는 `MermaidDiagram`을 사용합니다.

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

다이어그램별 테마는 YAML frontmatter로 설정하는 방식을 권장합니다. Mermaid `%%{init:...}%%` directive도 호환성상 동작할 수 있지만 새 슬라이드는 frontmatter를 사용하세요.

### 이후 수정을 정확히 지칭할 수 있게 만들기

중요한 제목, 카드, 차트, 섹션에는 안정적인 `data-ai-id`를 붙입니다.

```tsx
<h1 data-ai-id="main-title">Quarterly Roadmap</h1>
```

`main-title`, `cost-chart`, `workflow-summary`처럼 의미를 설명하는 이름을 사용하세요. `blue-box`, `left-thing`, `big-text`처럼 모양이나 위치만 설명하는 이름은 피합니다.

## 검토와 피드백

### Edit Mode에서 정확한 참조와 피드백 남기기

`?edit=1`로 Edit Mode를 엽니다.

```txt
http://localhost:5173/?slide=3&edit=1
```

Edit Mode에서는 클릭으로 다음 슬라이드로 넘어가지 않습니다. 슬라이드 콘텐츠에 커서를 올리면 실제로 선택될 요소에 테두리가 표시됩니다. 하단 발표 메뉴는 다음 단축키를 가진 편집 메뉴로 바뀝니다.

| 입력 | 동작 |
| --- | --- |
| `E` | Edit Mode 켜기 또는 끄기 |
| `Esc` | Edit Mode 종료, 열려 있는 피드백 창이나 목록이 있으면 먼저 닫기 |
| `R` | Reference를 선택한 뒤 요소를 클릭해 한 줄짜리 `@element(...)` 참조 복사 |
| `F` | Feedback을 선택한 뒤 요소를 클릭해 연결된 피드백 추가 또는 편집 |
| `V` | 누적된 피드백 목록 열기 또는 닫기 |

복사되는 참조는 다음과 같습니다.

```txt
@element(slide=3 file="src/slides/003-content.tsx" target="data-ai-id=runtime-flow-title" text="Runtime flow")
```

이 참조를 구체적인 수정 요청에 붙여 넣을 수 있습니다.

```txt
Change @element(slide=3 file="src/slides/003-content.tsx" target="data-ai-id=runtime-flow-title" text="Runtime flow") to make the heading shorter and align it with the chart below.
```

피드백에는 현재 세션 전체에서 이어지는 번호가 붙습니다. 저장한 피드백은 요소 옆의 번호 버블로 표시됩니다. 버블에 커서를 올리면 연결된 요소가 강조되고, 버블을 선택하면 피드백을 편집하거나 삭제할 수 있습니다. 피드백 목록에서는 다음 작업을 할 수 있습니다.

- 번호를 선택해 다른 슬라이드에 있더라도 해당 버블로 이동하고 포커스하기
- 개별 피드백 편집 또는 삭제
- 모든 피드백 삭제
- 모든 참조와 피드백을 하나의 요청문으로 복사

![요소 피드백과 피드백 목록을 표시한 Edit Mode](docs/edit-mode-feedback.png)

전체 복사 형식은 다음과 같습니다.

```txt
1. @element(...)
첫 번째 피드백

---

2. @element(...)
두 번째 피드백
```

피드백은 현재 브라우저 세션에만 유지되며 페이지를 새로고침하면 초기화됩니다. 클립보드 접근이 실패하면 직접 복사할 수 있도록 화면에 내용을 표시합니다.

### 스크린샷으로 검토하기

개발 서버를 실행해 둔 상태에서 특정 슬라이드나 등록된 덱 전체를 캡처합니다.

```bash
npm run capture:slide -- 3
npm run capture:all
```

이미지는 `screenshots/slide-001.png`, `screenshots/slide-002.png` 같은 이름으로 저장됩니다. 생성된 스크린샷은 git에 포함되지 않습니다.

기본 데모 덱을 변경했다면 이 README에서 사용하는 그리드도 갱신합니다.

```bash
npm run capture:all
npm run capture:demo-grid
```

그리드는 `src/slides.ts`에 현재 등록된 슬라이드만 사용해 `docs/demo-slides-grid.png`에 저장됩니다. 차트나 애니메이션에 시간이 더 필요하면 대기 시간을 조정할 수 있습니다.

```bash
SLIDE_CAPTURE_SETTLE_MS=2000 npm run capture:slide -- 3
```

## 발표하기

### 청중 화면 이동하기

| 입력 | 동작 |
| --- | --- |
| `Right` / `Down` / `Space` / 슬라이드 클릭 | 다음 슬라이드 |
| `Left` / `Up` | 이전 슬라이드 |
| `Home` / `End` | 첫 슬라이드 / 마지막 슬라이드 |
| `?slide=N` | N번째 슬라이드 바로 열기 |
| `P` | Presenter View 팝업 열기 |

직접 접근 URL 예시:

```txt
http://localhost:5173/?slide=3
http://localhost:5173/?slide=3&edit=1
http://localhost:5173/?slide=3&presenter=1
```

Presenter View를 열지 않았을 때는 청중 화면 중앙 하단의 작은 반투명 탭으로 발표 메뉴를 펼칠 수 있습니다. 슬라이드 위에 지속적인 UI를 남기지 않으면서 검정/흰색 화면, 레이저, 펜, 되돌리기, 지우기, 전체 화면 기능을 제공합니다.

청중 화면 조작:

| 입력 | 동작 |
| --- | --- |
| `B` / `W` | 청중 화면을 검정 / 흰색으로 전환 |
| `R` | 레이저 포인터 켜기 또는 끄기 |
| `D` | 펜 주석 켜기 또는 끄기 |
| `Z` | 마지막 펜 주석 되돌리기 |
| `C` | 현재 슬라이드의 주석 지우기 |
| `F` | 브라우저 전체 화면 시작 또는 종료 |

![펜 드로잉과 레이저 포인터를 사용 중인 발표 모드](docs/presentation-drawing-laser.png)

### Presenter View 사용하기

청중 화면에서 `P`를 누르면 Presenter View가 별도 팝업으로 열립니다. `?presenter=1`로 직접 열 수도 있습니다. 팝업은 발표자 모니터에, 원래 창은 청중 화면에 배치하세요. Presenter View는 청중 화면에 발표자 UI를 추가하지 않으면서 현재·다음 슬라이드, 선택적 발표자 노트, 경과 시간, 슬라이드 목록을 보여줍니다. 슬라이드 이동, 포인터 위치, 펜 획, 청중 화면 상태도 청중 창과 동기화합니다.

![현재 슬라이드, 발표 대본, 다음 슬라이드, 타이머, 청중 제어를 표시한 Presenter View](docs/presenter-view.png)

Presenter View 조작:

| 입력 | 동작 |
| --- | --- |
| `B` / `W` | 청중 화면을 검정 / 흰색으로 전환 |
| `R` | 동기화된 레이저 포인터 켜기 또는 끄기 |
| `D` | 동기화된 펜 주석 켜기 또는 끄기 |
| `Z` | 마지막 펜 주석 되돌리기 |
| `C` | 현재 슬라이드의 주석 지우기 |
| `F` | 청중 화면 동기화 고정 또는 재개 |

## PowerPoint로 내보내기

두 내보내기 경로 모두 브라우저 렌더러를 사용하므로 먼저 개발 서버를 실행하세요.

이미지 기반 export는 시각적 재현성이 가장 높습니다.

```bash
npm run export:pptx
npm run export:pptx -- exports/demo.pptx
```

기본 파일은 `exports/vibe-sliding.pptx`입니다. 각 슬라이드가 전체 화면 PNG로 들어가므로 PowerPoint에서 안정적으로 발표할 수 있지만 텍스트, 도형, 차트, 다이어그램을 개별 편집할 수는 없습니다.

실험적인 편집 가능 export는 `dom-to-pptx`로 스케일되지 않은 1920×1080 DOM을 변환합니다.

```bash
npm run export:pptx:editable
npm run export:pptx:editable -- exports/demo-editable.pptx
```

기본 파일은 `exports/vibe-sliding-editable.pptx`입니다. 편집 가능성이 중요할 때 사용하되, 일부 차트, Mermaid 다이어그램, SVG, 고급 CSS, 효과는 부분 변환되거나 이미지/SVG 객체로 보존될 수 있습니다.

다른 서버를 사용하거나 렌더링 대기 시간을 늘리려면 다음처럼 실행합니다.

```bash
SLIDE_BASE_URL=http://localhost:4173 npm run export:pptx
SLIDE_CAPTURE_SETTLE_MS=2000 npm run export:pptx:editable
```

## 작업공간 확장과 배포

### 재사용할 Basics 디자인 시스템 추가하기

어느 컬렉션에도 반복 사용할 만한 방향이 없을 때만 새 Basics leaf를 요청하세요.

```txt
Create a new Basics theme under designs/basics/ for executive product strategy reviews. Use a restrained, high-density style with strong chart readability.
```

Agent는 `.agents/skills/design-guide-authoring/assets/design-guide-template.md`를 구조로 사용하고 `.agents/skills/design-guide-authoring/assets/design-guide-example.md`를 완성 예시로 참고해야 합니다. Basics leaf는 여러 덱에서 재사용할 규칙을 정의해야 하며, 한 장짜리 슬라이드 개요나 외부 디자인의 중복 설명이어서는 안 됩니다.

### GitHub Pages에 배포하기

포함된 GitHub Actions 워크플로는 `main`에 push하면 `dist/`를 빌드하며 수동 실행도 지원합니다. GitHub에서 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 설정하세요.

워크플로는 `VITE_BASE_PATH`로 배포 base path를 제어합니다.

```txt
VITE_BASE_PATH=/vibe-sliding/
```

프로젝트를 fork하거나 저장소명을 변경하거나 커스텀 도메인을 사용한다면 `.github/workflows/deploy-pages.yml`의 값을 수정하세요. 도메인 루트에서 제공할 때는 `/`를 사용합니다. 로컬 예시는 `.env.example`을 참고하세요.

## 개발 참고

### 명령어

| 명령어 | 용도 |
| --- | --- |
| `npm run dev` | Vite 개발 서버 실행 |
| `npm run preview` | 프로덕션 빌드 미리보기 |
| `npm run typecheck` | TypeScript 검사 |
| `npm run lint` | ESLint 실행 |
| `npm run build` | 타입 검사 후 `dist/` 생성 |
| `npm run capture:slide -- N` | 등록된 슬라이드 하나 캡처 |
| `npm run capture:all` | 등록된 전체 슬라이드 캡처 |
| `npm run capture:demo-grid` | README 데모 그리드 갱신 |
| `npm run export:pptx` | 이미지 기반 PPTX 내보내기 |
| `npm run export:pptx:editable` | 실험적 편집 가능 PPTX 내보내기 |

### 프로젝트 구조

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
  pptx-design-styles/
skills/
scripts/
public/
screenshots/
exports/
```

- `src/runtime/`: 공용 뷰어, 스케일링, 내비게이션, 발표자 기능
- `src/edit-mode/`: 공용 요소 검사, 참조, 피드백 UI
- `src/styles/global.css`: 앱 전역 런타임 및 글꼴 스타일
- `src/slides/`: 덱별 React 컴포넌트
- `src/slides.ts`: 명시적인 슬라이드 레지스트리와 선택적 노트
- `designs/`: 디자인 시스템, 슬라이드 템플릿, 스타일 레퍼런스 컬렉션
- `screenshots/`: 생성된 검토 이미지
- `exports/`: 생성된 PPTX 파일

## 외부 프로젝트 출처

- [`yetone/kill-ai-slop`](https://github.com/yetone/kill-ai-slop) — [Apache-2.0](.agents/skills/kill-ai-slop/LICENSE), [`.agents/skills/kill-ai-slop/`](.agents/skills/kill-ai-slop/)에 보존
- [`zarazhangrui/beautiful-html-templates`](https://github.com/zarazhangrui/beautiful-html-templates) — [MIT](designs/beautiful-html-templates/LICENSE), [`designs/beautiful-html-templates/`](designs/beautiful-html-templates/)에 보존
- [`corazzon/pptx-design-styles`](https://github.com/corazzon/pptx-design-styles) — [MIT 선언](designs/pptx-design-styles/LICENSE), 분할된 스타일 레퍼런스로 [`designs/pptx-design-styles/`](designs/pptx-design-styles/)에 보존
