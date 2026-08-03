import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Code2, MonitorPlay, MousePointerClick } from 'lucide-react'
import { DemoChrome } from './_shared/demo-chrome'
import { getDemoMotion } from './_shared/demo-motion'

const elementReference =
  '@element(slide=4 file="src/slides/004-demo-summary.tsx" target="data-ai-id=main-title" text="Click the exact element you want changed.")'

export default function Slide004DemoSummary() {
  const motionPreset = getDemoMotion(Boolean(useReducedMotion()))

  return (
    <motion.section
      animate="show"
      className="relative h-full w-full overflow-hidden bg-[#0B1020] px-24 py-24 text-[#F8FAFC] [word-break:keep-all]"
      initial="hidden"
      variants={motionPreset.root}
    >
      <DemoChrome page="04" section="EDIT INSPECT" />
      <div className="pointer-events-none absolute inset-x-24 top-[338px] h-px bg-[#334155]/70" />

      <div className="relative z-10 flex h-full flex-col">
        <motion.div
          className="grid grid-cols-[1.2fr_0.8fr] gap-16"
          variants={motionPreset.rise}
        >
          <div>
            <p
              className="mb-6 flex items-center gap-3 font-mono text-2xl font-semibold text-[#5EEAD4]"
              data-ai-id="section-kicker"
            >
              <MousePointerClick className="h-7 w-7" aria-hidden />
              EDIT INSPECT MODE
            </p>
            <h1
              className="max-w-[1060px] text-[80px] font-semibold leading-[0.98] tracking-normal"
              data-ai-id="main-title"
            >
              Click the exact element you want changed.
            </h1>
          </div>
          <p
            className="self-end pb-2 text-[29px] leading-snug text-[#CBD5E1]"
            data-ai-id="summary"
          >
            A rendered selection becomes a precise source target the agent can
            act on.
          </p>
        </motion.div>

        <motion.div
          className="mt-14 flex flex-1 flex-col"
          data-ai-id="causal-flow"
          variants={motionPreset.root}
        >
          <p className="font-mono text-xl font-medium uppercase tracking-[0.16em] text-[#93C5FD]">
            Rendered feedback → copyable instruction → source edit
          </p>

          <div className="mt-5 grid flex-1 grid-cols-[1fr_88px_1.2fr_88px_1fr] items-stretch">
            <motion.article
              className="flex min-w-0 flex-col border border-[#334155] bg-[#111827] p-7"
              data-ai-id="rendered-selection"
              variants={motionPreset.card}
            >
              <div className="mb-7 flex items-center justify-between">
                <div className="flex items-center gap-3 text-[22px] font-semibold text-[#F8FAFC]">
                  <MonitorPlay className="h-7 w-7 text-[#5EEAD4]" aria-hidden />
                  Browser
                </div>
                <span className="font-mono text-lg text-[#93C5FD]">01</span>
              </div>

              <div className="flex flex-1 flex-col border border-[#334155] bg-[#0B1020] p-5">
                <div className="mb-7 flex items-center justify-between border-b border-[#334155] pb-4 font-mono text-base text-[#94A3B8]">
                  <span>localhost:5173/?edit=1</span>
                  <span className="text-[#5EEAD4]">ACTIVE</span>
                </div>
                <p className="font-mono text-lg text-[#93C5FD]">DEMO SLIDE</p>
                <div className="relative mt-5 border-2 border-[#5EEAD4] bg-[#5EEAD4]/10 px-5 py-6">
                  <MousePointerClick
                    className="absolute -right-4 -top-5 h-10 w-10 bg-[#0B1020] p-1 text-[#5EEAD4]"
                    aria-hidden
                  />
                  <p className="text-[35px] font-semibold leading-tight tracking-normal">
                    Point at what should change
                  </p>
                </div>
                <p className="mt-auto pt-6 text-[20px] leading-snug text-[#CBD5E1]">
                  Open ?edit=1, click the visible element, then paste the
                  reference into your next prompt.
                </p>
              </div>
            </motion.article>

            <motion.div
              className="flex items-center justify-center"
              variants={motionPreset.fade}
            >
              <ArrowRight className="h-11 w-11 text-[#5EEAD4]" aria-hidden />
            </motion.div>

            <motion.article
              className="flex min-w-0 flex-col border border-[#5EEAD4]/75 bg-[#111827] p-8"
              data-ai-id="element-reference"
              variants={motionPreset.card}
            >
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="font-mono text-lg font-semibold uppercase tracking-[0.14em] text-[#5EEAD4]">
                    Copied reference
                  </p>
                  <h2 className="mt-3 text-[42px] font-semibold leading-tight tracking-normal">
                    One precise reference
                  </h2>
                </div>
                <span className="font-mono text-xl text-[#93C5FD]">02</span>
              </div>

              <div className="flex flex-1 items-center border border-[#334155] bg-[#0B1020] px-7 py-8 font-mono text-[19px] leading-[1.65] text-[#D5FFF8]">
                <code className="[overflow-wrap:anywhere]">{elementReference}</code>
              </div>

              <p className="mt-6 text-[21px] leading-snug text-[#CBD5E1]">
                One copyable instruction preserves both the intended change and
                its source location.
              </p>
            </motion.article>

            <motion.div
              className="flex items-center justify-center"
              variants={motionPreset.fade}
            >
              <ArrowRight className="h-11 w-11 text-[#5EEAD4]" aria-hidden />
            </motion.div>

            <motion.article
              className="flex min-w-0 flex-col border border-[#334155] bg-[#111827] p-7"
              data-ai-id="source-target"
              variants={motionPreset.card}
            >
              <div className="mb-7 flex items-center justify-between">
                <div className="flex items-center gap-3 text-[22px] font-semibold text-[#F8FAFC]">
                  <Code2 className="h-7 w-7 text-[#5EEAD4]" aria-hidden />
                  React source
                </div>
                <span className="font-mono text-lg text-[#93C5FD]">03</span>
              </div>

              <div className="flex flex-1 flex-col border border-[#334155] bg-[#0B1020] p-5 font-mono">
                <p className="border-b border-[#334155] pb-4 text-[17px] text-[#93C5FD]">
                  src/slides/004-demo-summary.tsx
                </p>
                <div className="mt-7 space-y-2 text-[20px] leading-[1.55] text-[#CBD5E1]">
                  <p>&lt;h1</p>
                  <p className="border-l-2 border-[#5EEAD4] bg-[#5EEAD4]/10 px-3 py-2 text-[#D5FFF8]">
                    data-ai-id=&quot;main-title&quot;
                  </p>
                  <p className="pl-4">&gt;Click the exact element</p>
                  <p className="pl-4">you want changed.&lt;/h1&gt;</p>
                </div>
                <p className="mt-auto pt-6 text-[20px] leading-snug text-[#CBD5E1]">
                  The agent can locate the exact JSX region and revise it
                  safely.
                </p>
              </div>
            </motion.article>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}
