import { BarChart3, CheckCircle2, Route } from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const reviewData = [
  { name: 'Draft', clarity: 38 },
  { name: 'Guide', clarity: 58 },
  { name: 'Inspect', clarity: 74 },
  { name: 'Capture', clarity: 91 },
]

export default function Slide003Content() {
  return (
    <section className="grid h-full w-full grid-cols-[0.95fr_1.05fr] bg-[#0b1020] px-24 py-20 text-white [word-break:keep-all]">
      <div className="flex flex-col justify-between pr-16">
        <div>
          <p
            className="mb-8 inline-flex items-center gap-3 font-mono text-2xl font-semibold text-teal-200"
            data-ai-id="section-kicker"
          >
            <Route className="h-7 w-7" aria-hidden />
            MVP Loop
          </p>
          <h1
            className="text-[88px] font-semibold leading-[0.98] tracking-normal"
            data-ai-id="main-title"
          >
            Create, inspect, revise, capture
          </h1>
          <p
            className="mt-9 text-[32px] leading-snug text-slate-300"
            data-ai-id="body-summary"
          >
            The browser stays the presentation surface while source code remains
            the editing surface. 사용자는 보이는 요소를 정확히 지정하고, 에이전트는
            TSX를 직접 수정합니다.
          </p>
        </div>

        <div
          className="grid grid-cols-2 gap-5 text-[26px] text-slate-200"
          data-ai-id="principles"
        >
          {['No slide DSL', 'Manual registration', 'Fixed 16:9 stage', 'npm-only workflow'].map(
            (item) => (
              <div className="flex items-center gap-4 border border-white/10 bg-white/[0.05] px-6 py-5" key={item}>
                <CheckCircle2 className="h-8 w-8 text-teal-200" aria-hidden />
                {item}
              </div>
            ),
          )}
        </div>
      </div>

      <div className="grid grid-rows-[0.72fr_1fr] gap-7">
        <div
          className="border border-white/10 bg-white/[0.06] p-8"
          data-ai-id="runtime-flow-card"
        >
          <div className="mb-8 flex items-center justify-between">
            <h2
              className="text-[44px] font-semibold tracking-normal"
              data-ai-id="runtime-flow-title"
            >
              Runtime flow
            </h2>
            <BarChart3 className="h-10 w-10 text-teal-200" aria-label="workflow chart" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {['slides.ts', '?slide=N', 'SlideStage', 'React slide'].map((step, index) => (
              <div
                className="min-h-[155px] border border-teal-200/20 bg-slate-950/70 p-5"
                data-ai-id={`runtime-step-${index + 1}`}
                key={step}
              >
                <div className="mb-6 font-mono text-2xl text-teal-200">
                  0{index + 1}
                </div>
                <div className="text-[30px] font-semibold leading-tight">
                  {step}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="border border-white/10 bg-white/[0.06] p-8"
          data-ai-id="review-chart"
        >
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="text-[42px] font-semibold tracking-normal">
                Review confidence
              </h2>
              <p className="mt-2 text-[24px] text-slate-400">
                Qualitative score across the authoring loop
              </p>
            </div>
            <div className="font-mono text-[34px] text-teal-200">91%</div>
          </div>
          <div className="h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={reviewData} margin={{ left: 0, right: 16, top: 24, bottom: 0 }}>
                <defs>
                  <linearGradient id="clarity" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#5eead4" stopOpacity={0.75} />
                    <stop offset="95%" stopColor="#5eead4" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(148,163,184,0.22)" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" tick={{ fontSize: 20 }} />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 20 }} width={46} />
                <Tooltip
                  contentStyle={{
                    background: '#0f172a',
                    border: '1px solid rgba(94,234,212,0.3)',
                    color: '#f8fafc',
                  }}
                />
                <Area
                  dataKey="clarity"
                  fill="url(#clarity)"
                  stroke="#5eead4"
                  strokeWidth={4}
                  type="monotone"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  )
}
