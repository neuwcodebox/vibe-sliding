import { motion, useReducedMotion } from 'framer-motion'
import { Camera, CheckCircle2, MousePointerClick, Route } from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { getDemoMotion } from './_shared/demo-motion'

const iterationData = [
  { name: 'Prompt', confidence: 42 },
  { name: 'Preview', confidence: 63 },
  { name: 'Inspect', confidence: 78 },
  { name: 'Capture', confidence: 92 },
]

const inspectSteps = [
  'Open ?edit=1',
  'Click a visible element',
  'Paste @element(...) into the prompt',
]

export default function Slide003Content() {
  const motionPreset = getDemoMotion(Boolean(useReducedMotion()))

  return (
    <motion.section
      animate="show"
      className="grid h-full w-full grid-cols-[0.92fr_1.08fr] bg-[#0b1020] px-24 py-20 text-white [word-break:keep-all]"
      initial="hidden"
      variants={motionPreset.root}
    >
      <motion.div
        className="flex flex-col justify-between pr-14"
        variants={motionPreset.fromLeft}
      >
        <div>
          <p
            className="mb-8 inline-flex items-center gap-3 font-mono text-2xl font-semibold text-teal-200"
            data-ai-id="section-kicker"
          >
            <Route className="h-7 w-7" aria-hidden />
            Revision loop
          </p>
          <h1
            className="text-[88px] font-semibold leading-[0.98] tracking-normal"
            data-ai-id="main-title"
          >
            Point at what should change
          </h1>
          <p
            className="mt-9 text-[32px] leading-snug text-slate-300"
            data-ai-id="body-summary"
          >
            Edit Inspect Mode turns a clicked browser element into a one-line
            source reference you can paste into the next agent prompt.
          </p>
        </div>

        <div
          className="space-y-4 text-[27px] text-slate-200"
          data-ai-id="inspect-steps"
        >
          {inspectSteps.map((item, index) => (
            <motion.div
              className="flex items-center gap-4 border border-white/10 bg-white/[0.05] px-6 py-5"
              key={item}
              variants={motionPreset.card}
            >
              <CheckCircle2 className="h-8 w-8 text-teal-200" aria-hidden />
              <span className="font-mono text-teal-200">0{index + 1}</span>
              {item}
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="grid grid-rows-[0.58fr_1fr] gap-7"
        variants={motionPreset.fromRight}
      >
        <motion.div
          className="border border-white/10 bg-white/[0.06] p-8"
          data-ai-id="inspect-reference-card"
          variants={motionPreset.card}
        >
          <div className="mb-7 flex items-center justify-between">
            <h2 className="text-[44px] font-semibold tracking-normal">
              Copied reference
            </h2>
            <MousePointerClick
              className="h-10 w-10 text-teal-200"
              aria-label="edit inspect pointer"
            />
          </div>
          <div className="border border-teal-200/20 bg-slate-950/80 p-6 font-mono text-[24px] leading-snug text-teal-100">
            @element(slide=3 file=&quot;src/slides/003-content.tsx&quot;
            target=&quot;data-ai-id=main-title&quot; text=&quot;Point at what should change&quot;)
          </div>
        </motion.div>

        <motion.div
          className="border border-white/10 bg-white/[0.06] p-8"
          data-ai-id="capture-chart"
          variants={motionPreset.card}
        >
          <div className="mb-5 flex items-end justify-between">
            <div>
              <h2 className="text-[42px] font-semibold tracking-normal">
                Review confidence
              </h2>
              <p className="mt-2 flex items-center gap-3 text-[24px] text-slate-400">
                <Camera className="h-7 w-7" aria-hidden />
                Screenshots make visual regressions visible
              </p>
            </div>
            <div className="font-mono text-[34px] text-teal-200">92%</div>
          </div>
          <AreaChart
            data={iterationData}
            height={350}
            margin={{ left: 0, right: 16, top: 24, bottom: 0 }}
            width={860}
          >
            <defs>
              <linearGradient id="confidence" x1="0" x2="0" y1="0" y2="1">
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
              dataKey="confidence"
              fill="url(#confidence)"
              stroke="#5eead4"
              strokeWidth={4}
              type="monotone"
            />
          </AreaChart>
        </motion.div>
      </motion.div>
    </motion.section>
  )
}
