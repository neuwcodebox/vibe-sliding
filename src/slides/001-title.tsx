import { Sparkles } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { getDemoMotion } from './_shared/demo-motion'

const promiseCards = [
  ['01', 'Choose a guide', 'Pick a reusable design guide for the deck style.'],
  ['02', 'Ask the agent', 'Describe the audience, content, and slide count.'],
  ['03', 'Review locally', 'Preview, inspect, capture, and request revisions.'],
]

export default function Slide001Title() {
  const motionPreset = getDemoMotion(Boolean(useReducedMotion()))

  return (
    <motion.section
      animate="show"
      className="relative flex h-full w-full overflow-hidden bg-[#080b12] px-28 py-24 text-white [word-break:keep-all]"
      initial="hidden"
      variants={motionPreset.root}
    >
      <div className="absolute inset-y-0 right-0 w-[38%] bg-[linear-gradient(135deg,rgba(20,184,166,0.22),rgba(59,130,246,0.13),transparent)]" />
      <div className="absolute left-28 top-24 h-1 w-28 bg-teal-300" />

      <div className="relative z-10 flex w-full flex-col justify-between">
        <div className="max-w-[1060px]">
          <motion.div
            className="mb-12 inline-flex items-center gap-4 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-2xl font-medium text-teal-100"
            data-ai-id="deck-label"
            variants={motionPreset.rise}
          >
            <Sparkles aria-label="AI slide workspace" className="h-7 w-7" />
            Vibe Sliding Demo
          </motion.div>
          <motion.h1
            className="max-w-[1040px] text-[102px] font-semibold leading-[0.96] tracking-normal"
            data-ai-id="main-title"
            variants={motionPreset.rise}
          >
            Ask the agent for a deck, not code
          </motion.h1>
          <motion.p
            className="mt-10 max-w-[860px] text-[34px] leading-snug text-slate-300"
            data-ai-id="subtitle"
            variants={motionPreset.rise}
          >
            Vibe Sliding gives AI agents a local React slide workspace with
            design guides, edit inspect references, and screenshot review.
          </motion.p>
        </div>

        <motion.div
          className="grid w-[1010px] grid-cols-3 gap-5"
          data-ai-id="promise-cards"
          variants={motionPreset.root}
        >
          {promiseCards.map(([step, title, body]) => (
            <motion.div
              className="min-h-[215px] border border-white/12 bg-white/[0.06] px-7 py-6"
              key={step}
              variants={motionPreset.card}
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}
