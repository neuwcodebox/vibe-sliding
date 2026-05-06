import { Bot, MonitorPlay, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

const promiseCards = [
  ['01', 'Describe the deck', '사용자는 발표 목적, 청중, 톤을 Agent에게 설명합니다.'],
  ['02', 'Agent writes slides', 'Agent가 React 컴포넌트와 슬라이드 순서를 직접 수정합니다.'],
  ['03', 'Review in browser', '브라우저에서 발표 화면을 보고 수정 요청을 반복합니다.'],
]

export default function Slide001Title() {
  return (
    <section className="relative flex h-full w-full overflow-hidden bg-[#080b12] px-28 py-24 text-white [word-break:keep-all]">
      <div className="absolute inset-y-0 right-0 w-[38%] bg-[linear-gradient(135deg,rgba(20,184,166,0.22),rgba(59,130,246,0.13),transparent)]" />
      <div className="absolute bottom-0 right-0 h-[48%] w-[54%] border-l border-t border-white/10 bg-white/[0.025]" />
      <div className="absolute left-28 top-24 h-1 w-28 bg-teal-300" />

      <div className="relative z-10 flex w-full flex-col justify-between">
        <div className="max-w-[1280px]">
          <div
            className="mb-12 inline-flex items-center gap-4 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-2xl font-medium text-teal-100"
            data-ai-id="deck-label"
          >
            <Sparkles aria-label="AI slide workspace" className="h-7 w-7" />
            Vibe Sliding Demo
          </div>
          <motion.h1
            className="max-w-[1250px] text-[122px] font-semibold leading-[0.95] tracking-normal"
            data-ai-id="main-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            AI Agent에게 맡기는 로컬 슬라이드 제작
          </motion.h1>
          <p
            className="mt-10 max-w-[1000px] text-[36px] leading-snug text-slate-300"
            data-ai-id="subtitle"
          >
            사용자는 발표 자료를 요청하고, Agent는 React 슬라이드를 작성하며,
            브라우저는 바로 확인 가능한 발표 화면이 됩니다.
          </p>
        </div>

        <div className="grid grid-cols-[1.15fr_0.85fr] gap-7">
          <div
            className="grid grid-cols-3 gap-5"
            data-ai-id="promise-cards"
          >
            {promiseCards.map(([step, title, body]) => (
              <div
                className="min-h-[215px] border border-white/12 bg-white/[0.06] px-7 py-6"
                key={step}
              >
                <div className="mb-5 font-mono text-2xl text-teal-200">
                  {step}
                </div>
                <h2 className="text-[34px] font-semibold leading-tight tracking-normal">
                  {title}
                </h2>
                <p className="mt-4 text-[24px] leading-snug text-slate-300">
                  {body}
                </p>
              </div>
            ))}
          </div>

          <div
            className="flex items-center justify-between border border-teal-200/25 bg-slate-950/70 px-10 py-8"
            data-ai-id="agent-preview-card"
          >
            <div>
              <p className="font-mono text-2xl text-teal-200">LOCAL LOOP</p>
              <p className="mt-4 text-[42px] font-semibold leading-tight">
                Prompt to live slide preview
              </p>
            </div>
            <div className="flex gap-5 text-teal-200">
              <Bot className="h-14 w-14" aria-label="AI agent" />
              <MonitorPlay className="h-14 w-14" aria-label="browser preview" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
