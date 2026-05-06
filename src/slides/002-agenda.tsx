import { Code2, FileText, MonitorPlay, UserRoundCog } from 'lucide-react'

const roles = [
  {
    icon: UserRoundCog,
    title: 'User intent',
    body: '주제, 청중, 슬라이드 수, 포함할 메시지를 자연어로 요청합니다.',
  },
  {
    icon: FileText,
    title: 'Design guide',
    body: 'designs/*.md가 톤, 색상, 밀도, 차트 표현 규칙을 제공합니다.',
  },
  {
    icon: Code2,
    title: 'React source',
    body: 'Agent가 src/slides/의 TSX와 src/slides.ts 등록 순서를 수정합니다.',
  },
  {
    icon: MonitorPlay,
    title: 'Browser review',
    body: '사용자는 실제 발표 화면을 보고 다음 수정 요청을 결정합니다.',
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
            사람은 요청하고 Agent가 구현합니다
          </h1>
        </div>
        <p
          className="self-end text-[32px] leading-snug text-slate-600"
          data-ai-id="summary"
        >
          이 프로젝트의 핵심은 사람이 슬라이드 코드를 직접 작성하는 것이 아니라,
          Agent가 편집하기 좋은 React 작업공간을 제공하는 것입니다.
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
