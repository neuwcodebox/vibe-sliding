import { motion, useReducedMotion } from 'framer-motion'
import { Camera, CheckCircle2, Layers3, MonitorPlay } from 'lucide-react'
import { DemoChrome } from './_shared/demo-chrome'
import { getDemoMotion } from './_shared/demo-motion'

export default function Slide005ReviewLoop() {
  const motionPreset = getDemoMotion(Boolean(useReducedMotion()))

  return (
    <motion.section
      animate="show"
      className="relative h-full w-full overflow-hidden bg-[#0B1020] px-24 py-24 text-[#F8FAFC] [word-break:keep-all]"
      initial="hidden"
      variants={motionPreset.root}
    >
      <DemoChrome page="05" section="QUALITY GATE" />
      <div className="pointer-events-none absolute inset-x-24 top-[338px] h-px bg-[#334155]/70" />

      <div className="relative z-10 flex h-full flex-col">
        <motion.div
          className="grid grid-cols-[1.18fr_0.82fr] gap-16"
          variants={motionPreset.rise}
        >
          <div>
            <p
              className="mb-6 flex items-center gap-3 font-mono text-2xl font-semibold text-[#5EEAD4]"
              data-ai-id="section-kicker"
            >
              <Camera className="h-7 w-7" aria-hidden />
              QUALITY GATE / 05
            </p>
            <h1
              className="max-w-[1060px] text-[80px] font-semibold leading-[0.98] tracking-normal"
              data-ai-id="main-title"
            >
              Review before you call it done.
            </h1>
          </div>
          <p
            className="self-end pb-2 text-[29px] leading-snug text-[#CBD5E1]"
            data-ai-id="summary"
          >
            The final proof is the rendered 16:9 stage—and a shareable
            image-based PPTX handoff.
          </p>
        </motion.div>

        <motion.div
          className="mt-10 flex flex-1 flex-col"
          data-ai-id="qa-review-strip"
          variants={motionPreset.root}
        >
          <div className="grid flex-1 grid-cols-[0.94fr_1.08fr_0.98fr] border border-[#334155] bg-[#111827]">
            <motion.article
              className="flex min-w-0 flex-col p-8"
              data-ai-id="legibility-check"
              variants={motionPreset.card}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 font-mono text-lg font-semibold text-[#5EEAD4]">
                  <CheckCircle2 className="h-6 w-6" aria-hidden />
                  01 / LEGIBILITY
                </div>
                <span className="font-mono text-lg text-[#93C5FD]">SCAN</span>
              </div>

              <div className="mt-7 flex flex-1 flex-col border border-[#334155] bg-[#0B1020] p-6">
                <div className="mb-7 flex items-center gap-3 border-b border-[#334155] pb-4 font-mono text-base text-[#94A3B8]">
                  <MonitorPlay className="h-5 w-5 text-[#5EEAD4]" aria-hidden />
                  PRESENTATION VIEW
                </div>
                <p className="max-w-[340px] text-[39px] font-semibold leading-[1.04] tracking-normal">
                  The claim reads at a glance.
                </p>
                <p className="mt-auto text-[21px] leading-snug text-[#CBD5E1]">
                  Can a viewer understand the point before reading the detail?
                </p>
              </div>
            </motion.article>

            <motion.article
              className="flex min-w-0 flex-col border-l border-[#334155] p-8"
              data-ai-id="hierarchy-check"
              variants={motionPreset.card}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 font-mono text-lg font-semibold text-[#5EEAD4]">
                  <Layers3 className="h-6 w-6" aria-hidden />
                  02 / HIERARCHY
                </div>
                <span className="font-mono text-lg text-[#93C5FD]">ORDER</span>
              </div>

              <div className="mt-7 flex flex-1 flex-col justify-center border-l-2 border-[#5EEAD4] pl-7">
                <div>
                  <p className="font-mono text-base uppercase tracking-[0.14em] text-[#5EEAD4]">
                    Claim
                  </p>
                  <p className="mt-2 text-[42px] font-semibold leading-tight tracking-normal">
                    Lead with the answer.
                  </p>
                </div>
                <div className="my-6 h-px w-24 bg-[#334155]" />
                <div>
                  <p className="font-mono text-base uppercase tracking-[0.14em] text-[#93C5FD]">
                    Evidence
                  </p>
                  <p className="mt-2 text-[28px] leading-snug text-[#E2E8F0]">
                    Let one visual earn its space.
                  </p>
                </div>
                <div className="my-6 h-px w-16 bg-[#334155]" />
                <div>
                  <p className="font-mono text-base uppercase tracking-[0.14em] text-[#94A3B8]">
                    Detail
                  </p>
                  <p className="mt-2 text-[21px] leading-snug text-[#CBD5E1]">
                    Keep supporting context quiet and useful.
                  </p>
                </div>
              </div>
            </motion.article>

            <motion.article
              className="flex min-w-0 flex-col border-l border-[#334155] p-8"
              data-ai-id="overflow-check"
              variants={motionPreset.card}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 font-mono text-lg font-semibold text-[#5EEAD4]">
                  <CheckCircle2 className="h-6 w-6" aria-hidden />
                  03 / OVERFLOW
                </div>
                <span className="font-mono text-lg text-[#93C5FD]">FRAME</span>
              </div>

              <div className="relative mt-7 flex flex-1 items-center justify-center border border-[#334155] bg-[#0B1020] p-8">
                <div
                  aria-label="1920 by 1080 presentation safe frame"
                  className="relative aspect-video w-full overflow-hidden border border-[#93C5FD] bg-[#0B1020]"
                  data-ai-id="stage-safe-frame"
                >
                  <div className="absolute inset-x-0 top-0 flex h-9 items-center justify-between border-b border-[#334155] bg-[#111827] px-4 font-mono text-[13px] tracking-[0.1em]">
                    <span className="font-semibold text-[#5EEAD4]">SAFE FRAME</span>
                    <span className="text-[#93C5FD]">1920 × 1080 / 16:9</span>
                  </div>
                  <div className="absolute inset-x-5 top-14 bottom-5 border border-dashed border-[#5EEAD4]/80">
                    <span className="absolute left-3 top-3 font-mono text-[10px] tracking-[0.1em] text-[#5EEAD4]">
                      SAFE CONTENT AREA
                    </span>
                  </div>
                  <div className="absolute left-9 right-9 top-[6rem]">
                    <div className="h-3 w-[54%] bg-[#5EEAD4]" />
                    <div className="mt-4 h-2 w-[78%] bg-[#334155]" />
                    <div className="mt-2 h-2 w-[48%] bg-[#334155]" />
                  </div>
                  <div className="absolute bottom-8 left-9 right-9 flex items-center justify-between font-mono text-[11px] tracking-[0.08em] text-[#93C5FD]">
                    <span>CAPTURED STAGE</span>
                    <span>ALL EDGES CLEAR</span>
                  </div>
                </div>
              </div>
              <p className="mt-7 text-[21px] leading-snug text-[#CBD5E1]">
                Capture at 1920 × 1080 and confirm every label stays inside the
                fixed stage.
              </p>
            </motion.article>
          </div>

          <motion.div
            className="mt-6 grid grid-cols-[auto_1fr] items-center gap-7 border border-[#5EEAD4]/75 bg-[#111827] px-8 py-4"
            data-ai-id="final-prompt"
            variants={motionPreset.rise}
          >
            <div className="border-r border-[#334155] pr-7 font-mono text-lg font-semibold uppercase tracking-[0.14em] text-[#5EEAD4]">
              Rendered handoff
            </div>
            <p className="font-mono text-[22px] leading-snug text-[#D5FFF8]">
              npm run capture:all → review screenshots → npm run export:pptx
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}
