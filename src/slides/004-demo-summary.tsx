import { BadgeCheck, Keyboard, Layers3, Presentation } from 'lucide-react'
import { MermaidDiagram } from '../runtime/MermaidDiagram'

const demoItems = [
  {
    icon: Layers3,
    title: 'Guided generation',
    detail: 'The agent reads designs/*.md and follows consistent visual rules.',
  },
  {
    icon: Presentation,
    title: 'Browser presentation',
    detail: 'A fixed 16:9 stage previews, presents, and captures the deck.',
  },
  {
    icon: Keyboard,
    title: 'Keyboard navigation',
    detail: 'Use arrows, Space, Home, and End to control the presentation.',
  },
]

const demoSequenceChart = `---
config:
  theme: base
  sequence:
    actorMargin: 94
    boxMargin: 14
    messageMargin: 38
    diagramMarginX: 12
    diagramMarginY: 8
    width: 142
  themeVariables:
    background: '#FFFFFF'
    primaryColor: '#F8FAFC'
    primaryTextColor: '#020617'
    primaryBorderColor: '#0F766E'
    lineColor: '#0F766E'
    actorBkg: '#F8FAFC'
    actorBorder: '#0F766E'
    actorTextColor: '#020617'
    signalColor: '#334155'
    signalTextColor: '#334155'
    fontFamily: 'Inter, Noto Sans KR, sans-serif'
    fontSize: 22px
---
sequenceDiagram
  participant User
  participant Agent
  participant Browser
  User->>Agent: Request deck
  Agent->>Browser: Render slides
  Browser-->>User: Review
  User->>Agent: Precise edit
`

export default function Slide004DemoSummary() {
  return (
    <section className="relative flex h-full w-full overflow-hidden bg-[#f8fafc] px-28 py-24 text-slate-950 [word-break:keep-all]">
      <div className="absolute inset-y-0 right-0 w-[36%] bg-teal-50" />
      <div className="relative z-10 grid w-full grid-cols-[1fr_0.78fr] gap-14">
        <div className="flex flex-col justify-between">
          <div>
            <p
              className="mb-6 font-mono text-2xl font-semibold uppercase tracking-normal text-teal-700"
              data-ai-id="section-kicker"
            >
              Demo recap
            </p>
            <h1
              className="max-w-[980px] text-[92px] font-semibold leading-none tracking-normal"
              data-ai-id="main-title"
            >
              What this demo shows
            </h1>
            <p
              className="mt-9 max-w-[900px] text-[34px] leading-snug text-slate-600"
              data-ai-id="summary"
            >
              Vibe Sliding creates a local loop where agents build the deck,
              users review in the browser, and precise references drive edits.
            </p>
          </div>

          <div
            className="grid grid-cols-3 gap-5"
            data-ai-id="demo-summary-cards"
          >
            {demoItems.map((item, index) => {
              const Icon = item.icon

              return (
                <article
                  className="min-h-[245px] border border-slate-200 bg-white p-7 shadow-sm"
                  data-ai-id={`demo-card-${index + 1}`}
                  key={item.title}
                >
                  <div className="mb-6 flex items-center justify-between">
                    <Icon className="h-10 w-10 text-teal-700" aria-hidden />
                    <span className="font-mono text-2xl text-slate-400">
                      0{index + 1}
                    </span>
                  </div>
                  <h2 className="text-[31px] font-semibold leading-tight tracking-normal">
                    {item.title}
                  </h2>
                  <p className="mt-4 text-[23px] leading-snug text-slate-600">
                    {item.detail}
                  </p>
                </article>
              )
            })}
          </div>
        </div>

        <div
          className="flex flex-col justify-between border border-teal-200 bg-white p-10 shadow-sm"
          data-ai-id="closing-prompt-card"
        >
          <div>
            <div className="mb-8 flex h-20 w-20 items-center justify-center bg-teal-50 text-teal-700">
              <BadgeCheck className="h-11 w-11" aria-hidden />
            </div>
            <h2 className="text-[58px] font-semibold leading-tight tracking-normal">
              Ask for the deck, not the code
            </h2>
            <p className="mt-7 text-[30px] leading-snug text-slate-600">
              You provide the presentation intent and feedback. The agent keeps
              improving the slide source.
            </p>
          </div>

          <div className="bg-white text-slate-950">
            <p className="mb-4 font-mono text-2xl text-teal-700">TRY THIS</p>
            <p
              className="mb-4 border-b border-slate-200 pb-4 text-[18px] leading-snug text-slate-600"
              data-ai-id="demo-prompt-example"
            >
              Use designs/technical-grid.md. Create a four page demo deck
              introducing Vibe Sliding.
            </p>
            <MermaidDiagram
              ariaLabel="Mermaid sequence diagram showing the user, agent, and browser loop"
              chart={demoSequenceChart}
              className="h-[255px] bg-white"
              data-ai-id="mermaid-demo-sequence"
            />
          </div>

        </div>
      </div>
    </section>
  )
}
