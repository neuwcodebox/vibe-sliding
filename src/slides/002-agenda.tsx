import { Code2, FileText, MonitorPlay, UserRoundCog } from 'lucide-react'

const roles = [
  {
    icon: UserRoundCog,
    title: 'User intent',
    body: 'Describe the topic, audience, slide count, and required message.',
  },
  {
    icon: FileText,
    title: 'Design guide',
    body: 'A designs/*.md file defines tone, color, density, and chart rules.',
  },
  {
    icon: Code2,
    title: 'React source',
    body: 'The agent edits TSX files under src/slides/ and updates slides.ts.',
  },
  {
    icon: MonitorPlay,
    title: 'Browser review',
    body: 'Review the live presentation surface and request the next change.',
  },
]

export default function Slide002Agenda() {
  return (
    <section className="flex h-full w-full flex-col bg-[#f8fafc] px-28 py-24 text-slate-950 [word-break:keep-all]">
      <div className="grid grid-cols-[0.92fr_1.08fr] gap-14 border-b border-slate-200 pb-12">
        <div>
          <p
            className="mb-6 font-mono text-2xl font-semibold uppercase tracking-normal text-teal-700"
            data-ai-id="section-kicker"
          >
            Authoring model
          </p>
          <h1
            className="text-[86px] font-semibold leading-none tracking-normal"
            data-ai-id="main-title"
          >
            You request the deck. The agent builds it.
          </h1>
        </div>
        <p
          className="self-end text-[32px] leading-snug text-slate-600"
          data-ai-id="summary"
        >
          Vibe Sliding is not about hand-authoring slide code. It gives AI
          agents a clear React workspace they can edit reliably.
        </p>
      </div>

      <div className="mt-14 grid flex-1 grid-cols-4 gap-6">
        {roles.map((item, index) => {
          const Icon = item.icon

          return (
            <article
              className="flex flex-col justify-between border border-slate-200 bg-white p-8 shadow-sm"
              data-ai-id={`workflow-card-${index + 1}`}
              key={item.title}
            >
              <div>
                <div className="mb-9 flex items-center justify-between">
                  <div className="flex h-20 w-20 items-center justify-center bg-teal-50 text-teal-700">
                    <Icon className="h-10 w-10" aria-hidden />
                  </div>
                  <div className="font-mono text-2xl text-slate-400">
                    0{index + 1}
                  </div>
                </div>
                <h2 className="text-[42px] font-semibold leading-tight tracking-normal">
                  {item.title}
                </h2>
                <p className="mt-6 text-[27px] leading-snug text-slate-600">
                  {item.body}
                </p>
              </div>
              <div className="mt-10 h-1 w-20 bg-teal-600" />
            </article>
          )
        })}
      </div>
    </section>
  )
}
