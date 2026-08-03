import { ArrowDownRight, Braces, FileText, MonitorCheck, Sparkles } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { DemoChrome } from './_shared/demo-chrome'
import { getDemoMotion } from './_shared/demo-motion'

const briefFields = [
  ['Topic', 'Vibe Sliding'],
  ['Audience', 'Product teams'],
  ['Theme', 'Technical grid'],
  ['Delivery', 'Browser + PPTX'],
]

const outputSlides = [
  ['01', 'Story'],
  ['02', 'Theme'],
  ['03', 'Source'],
  ['04', 'Inspect'],
  ['05', 'Review'],
]

export default function Slide001Title() {
  const motionPreset = getDemoMotion(Boolean(useReducedMotion()))

  return (
    <motion.section
      animate="show"
      className="relative h-full w-full overflow-hidden bg-[#0b1020] px-24 py-20 text-slate-50 [word-break:keep-all]"
      initial="hidden"
      variants={motionPreset.root}
    >
      <DemoChrome page="01" section="THE BRIEF" />

      <div className="relative z-10 grid h-full grid-cols-[1.04fr_0.96fr] gap-16 pt-14">
        <motion.div className="flex flex-col" variants={motionPreset.fromLeft}>
          <div>
            <div
              className="inline-flex items-center gap-3 border border-teal-200/35 bg-teal-200/8 px-4 py-2 font-mono text-[20px] text-teal-100"
              data-ai-id="deck-label"
            >
              <Sparkles className="h-5 w-5" aria-hidden />
              A LOCAL SLIDE STUDIO FOR AGENTS
            </div>
            <h1
              className="mt-10 max-w-[850px] text-[102px] font-semibold leading-[0.91] tracking-[-0.055em]"
              data-ai-id="main-title"
            >
              Tell the story.
              <br />
              The agent builds the deck.
            </h1>
            <p
              className="mt-9 max-w-[780px] text-[31px] leading-[1.35] text-slate-300"
              data-ai-id="subtitle"
            >
              Vibe Sliding turns a clear brief into editable React slides, then
              makes every visual decision reviewable in the browser.
            </p>
          </div>

          <div className="mt-auto grid grid-cols-2 gap-x-12 border-t border-slate-700 pt-7">
            <div>
              <p className="font-mono text-[18px] tracking-[0.12em] text-slate-500">
                SOURCE OF TRUTH
              </p>
              <p className="mt-2 text-[25px] font-medium text-slate-100">
                Files your agent can revise
              </p>
            </div>
            <div>
              <p className="font-mono text-[18px] tracking-[0.12em] text-slate-500">
                PRODUCT PROMISE
              </p>
              <p className="mt-2 text-[25px] font-medium text-slate-100">
                Ask for the deck, not the code
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="relative flex items-center"
          data-ai-id="intent-spec"
          variants={motionPreset.fromRight}
        >
          <div className="w-full border border-slate-600 bg-[#111827]/95 p-8">
            <div className="flex items-center justify-between border-b border-slate-700 pb-5">
              <div className="flex items-center gap-3 font-mono text-[21px] font-medium tracking-[0.12em] text-teal-100">
                <FileText className="h-6 w-6" aria-hidden />
                DECK BRIEF
              </div>
              <span className="font-mono text-[18px] text-slate-500">INPUT</span>
            </div>

            <div className="grid grid-cols-2 gap-x-9">
              {briefFields.map(([label, value]) => (
                <div className="border-b border-slate-700 py-6" key={label}>
                  <p className="font-mono text-[17px] tracking-[0.12em] text-slate-500">
                    {label.toUpperCase()}
                  </p>
                  <p className="mt-2 text-[27px] font-medium text-slate-100">{value}</p>
                </div>
              ))}
            </div>

            <div className="my-5 flex items-center gap-5">
              <div className="h-px flex-1 bg-slate-600" />
              <ArrowDownRight className="h-10 w-10 text-teal-200" aria-hidden />
              <div className="h-px flex-1 bg-slate-600" />
            </div>

            <div>
              <div className="flex items-baseline justify-between gap-6">
                <p className="font-mono text-[17px] tracking-[0.12em] text-sky-200">
                  RENDERED DECK
                </p>
                <p className="shrink-0 font-mono text-[15px] tracking-[0.08em] text-slate-500">
                  05 SLIDES · ONE SOURCE
                </p>
              </div>

              <div className="mt-4 grid grid-cols-5 gap-2">
                {outputSlides.map(([number, label], index) => (
                  <div
                    className={`flex h-20 min-w-0 flex-col justify-between border px-3 py-2.5 ${
                      index === 0
                        ? 'border-teal-200 bg-teal-200/15'
                        : 'border-slate-600 bg-slate-900'
                    }`}
                    key={number}
                  >
                    <span className="font-mono text-[15px] text-teal-100">{number}</span>
                    <span className="whitespace-nowrap text-[15px] font-medium leading-none text-slate-200">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute -right-8 bottom-[-0.5rem] flex items-center gap-3 border border-sky-300/30 bg-[#0b1020] px-5 py-4 font-mono text-[19px] text-sky-100">
            <Braces className="h-6 w-6" aria-hidden />
            <span>React source</span>
            <span className="text-slate-500">→</span>
            <MonitorCheck className="h-6 w-6" aria-hidden />
            <span>browser proof</span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}
