import { Code2, GalleryHorizontalEnd, MousePointerClick, ScanEye } from 'lucide-react'

const agendaItems = [
  {
    icon: GalleryHorizontalEnd,
    title: 'Slide source',
    body: 'Slides live as editable React components under src/slides/.',
  },
  {
    icon: Code2,
    title: 'Design guides',
    body: 'Each new deck starts from an explicitly selected designs/*.md file.',
  },
  {
    icon: ScanEye,
    title: 'Visual review',
    body: 'Screenshots preserve the same 1920x1080 rendering path as preview.',
  },
  {
    icon: MousePointerClick,
    title: 'Edit inspect',
    body: 'Users can copy precise one-line element references for AI edits.',
  },
]

export default function Slide002Agenda() {
  return (
    <section className="flex h-full w-full flex-col bg-[#f8fafc] px-28 py-24 text-slate-950">
      <div className="flex items-end justify-between border-b border-slate-200 pb-12">
        <div>
          <p
            className="mb-6 font-mono text-2xl font-semibold uppercase tracking-normal text-teal-700"
            data-ai-id="section-kicker"
          >
            Agenda
          </p>
          <h1
            className="max-w-[900px] text-[86px] font-semibold leading-none tracking-normal"
            data-ai-id="main-title"
          >
            What this workspace provides
          </h1>
        </div>
        <p
          className="max-w-[520px] text-right text-[30px] leading-snug text-slate-600"
          data-ai-id="summary"
        >
          작고 명시적인 구조로 슬라이드 생성, 수정, 검토를 빠르게 반복합니다.
        </p>
      </div>

      <div className="mt-16 grid flex-1 grid-cols-2 gap-8">
        {agendaItems.map((item, index) => {
          const Icon = item.icon

          return (
            <article
              className="flex border border-slate-200 bg-white p-9 shadow-sm"
              data-ai-id={`agenda-card-${index + 1}`}
              key={item.title}
            >
              <div className="mr-8 flex h-20 w-20 items-center justify-center bg-teal-50 text-teal-700">
                <Icon className="h-10 w-10" aria-hidden />
              </div>
              <div>
                <div className="mb-5 font-mono text-2xl text-slate-400">
                  0{index + 1}
                </div>
                <h2 className="text-[42px] font-semibold leading-tight tracking-normal">
                  {item.title}
                </h2>
                <p className="mt-5 max-w-[560px] text-[28px] leading-snug text-slate-600">
                  {item.body}
                </p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
