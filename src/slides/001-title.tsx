import { ArrowRight, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Slide001Title() {
  return (
    <section className="relative flex h-full w-full overflow-hidden bg-[#080b12] px-28 py-24 text-white [word-break:keep-all]">
      <div className="absolute inset-y-0 right-0 w-[34%] bg-[linear-gradient(135deg,rgba(20,184,166,0.18),rgba(59,130,246,0.12),transparent)]" />
      <div className="absolute left-28 top-24 h-1 w-28 bg-teal-300" />
      <div className="relative z-10 flex max-w-[1180px] flex-col justify-between">
        <div>
          <div
            className="mb-12 inline-flex items-center gap-4 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-2xl font-medium text-teal-100"
            data-ai-id="deck-label"
          >
            <Sparkles aria-label="AI slide workspace" className="h-7 w-7" />
            React AI Slides
          </div>
          <motion.h1
            className="max-w-[1120px] text-[118px] font-semibold leading-[0.96] tracking-normal"
            data-ai-id="main-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            AI가 수정하기 쉬운 로컬 슬라이드 작업공간
          </motion.h1>
          <p
            className="mt-10 max-w-[910px] text-[36px] leading-snug text-slate-300"
            data-ai-id="subtitle"
          >
            React components, explicit design guides, and screenshot review in a
            fast Vite preview loop.
          </p>
        </div>

        <div
          className="grid w-[1120px] grid-cols-3 gap-5"
          data-ai-id="workflow-summary"
        >
          {[
            ['01', 'Select design guide'],
            ['02', 'Edit plain TSX slides'],
            ['03', 'Review at 1920x1080'],
          ].map(([step, label]) => (
            <div
              className="border border-white/12 bg-white/[0.06] px-7 py-6"
              key={step}
            >
              <div className="mb-5 font-mono text-2xl text-teal-200">{step}</div>
              <div className="flex items-center justify-between text-3xl font-semibold">
                {label}
                <ArrowRight className="h-7 w-7 text-teal-200" aria-hidden />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
