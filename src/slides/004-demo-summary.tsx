import { ArrowDown, BadgeCheck, Keyboard, Layers3, Presentation } from 'lucide-react'

const demoItems = [
  {
    icon: Layers3,
    title: 'Guided generation',
    detail: 'Agent가 designs/*.md를 읽고 일관된 비주얼 규칙으로 덱을 만듭니다.',
  },
  {
    icon: Presentation,
    title: 'Browser presentation',
    detail: '고정 16:9 스테이지를 브라우저에서 그대로 발표하고 캡처합니다.',
  },
  {
    icon: Keyboard,
    title: 'Keyboard navigation',
    detail: '좌/우, 상/하, Space, Home, End로 발표 흐름을 제어합니다.',
  },
]

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
              이 프로젝트가 보여주는 기능
            </h1>
            <p
              className="mt-9 max-w-[900px] text-[34px] leading-snug text-slate-600"
              data-ai-id="summary"
            >
              Vibe Sliding은 Agent가 슬라이드를 만들고, 사용자가 브라우저에서
              검토하며, 정확한 참조로 다시 수정시키는 로컬 제작 루프입니다.
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
              사용자는 발표 의도와 피드백을 제공하고, Agent는 슬라이드 소스를
              계속 개선합니다.
            </p>
          </div>

          <div className="border border-slate-200 bg-slate-950 p-7 text-white">
            <p className="mb-4 font-mono text-2xl text-teal-200">TRY THIS</p>
            <p className="text-[28px] leading-snug">
              Use designs/technical-grid.md. Create a four page demo deck
              introducing Vibe Sliding.
            </p>
          </div>

          <div className="flex items-center gap-4 text-[26px] font-semibold text-teal-800">
            <ArrowDown className="h-8 w-8" aria-hidden />
            아래 방향키로 종료 화면까지 진행
          </div>
        </div>
      </div>
    </section>
  )
}
