import { Check, FileText, Grid3X3, Type, Waypoints } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { DemoChrome } from './_shared/demo-chrome'
import { getDemoMotion } from './_shared/demo-motion'

const themeRules = [
  {
    icon: Grid3X3,
    label: 'LAYOUT',
    rule: 'A visible grid keeps hierarchy and diagram lanes aligned.',
    sample: <div className="grid h-12 w-32 grid-cols-6 gap-1">{Array.from({ length: 18 }, (_, index) => <span className={index === 1 || index === 7 || index === 13 ? 'bg-teal-200' : 'border border-slate-600'} key={index} />)}</div>,
  },
  {
    icon: Type,
    label: 'TYPE',
    rule: 'One large conclusion leads; supporting copy stays readable.',
    sample: <span className="text-[30px] font-semibold leading-none text-slate-100">01 claim</span>,
  },
  {
    icon: Waypoints,
    label: 'EVIDENCE',
    rule: 'Use source, diagrams, or captures—not decorative feature lists.',
    sample: <div className="flex items-center gap-2"><span className="h-3 w-3 bg-sky-300" /><span className="h-px w-20 bg-sky-300" /><span className="h-7 w-7 border border-sky-300" /></div>,
  },
  {
    icon: Check,
    label: 'REVIEW',
    rule: 'Capture the rendered slide before you call the work done.',
    sample: <div className="flex h-11 w-28 items-center justify-center border border-teal-200 text-teal-100"><Check className="h-6 w-6" aria-hidden /></div>,
  },
]

export default function Slide002Agenda() {
  const motionPreset = getDemoMotion(Boolean(useReducedMotion()))

  return (
    <motion.section
      animate="show"
      className="relative h-full w-full overflow-hidden bg-[#0b1020] px-24 py-20 text-slate-50 [word-break:keep-all]"
      initial="hidden"
      variants={motionPreset.root}
    >
      <DemoChrome page="02" section="THEME SELECTION" />

      <div className="relative z-10 grid h-full grid-cols-[0.76fr_1.24fr] gap-16 pt-14">
        <motion.div className="flex flex-col justify-between pb-12" variants={motionPreset.fromLeft}>
          <div>
            <p
              className="flex items-center gap-3 font-mono text-[20px] font-medium tracking-[0.13em] text-teal-100"
              data-ai-id="section-kicker"
            >
              <FileText className="h-6 w-6" aria-hidden />
              SELECTED THEME
            </p>
            <h1
              className="mt-8 max-w-[680px] text-[88px] font-semibold leading-[0.94] tracking-[-0.045em]"
              data-ai-id="main-title"
            >
              Taste becomes repeatable constraints.
            </h1>
            <p className="mt-8 max-w-[650px] text-[29px] leading-[1.38] text-slate-300" data-ai-id="summary">
              Choose one theme leaf; the agent applies its visual grammar
              across the deck.
            </p>
          </div>

          <div className="border-l-2 border-teal-200 pl-6">
            <p className="font-mono text-[19px] tracking-[0.1em] text-slate-500">SELECTED LEAF / BASICS</p>
            <p className="mt-3 break-all font-mono text-[23px] text-teal-100">designs/basics/themes/technical-grid.md</p>
            <div className="mt-5 flex flex-wrap gap-2 font-mono text-[15px] tracking-[0.08em]">
              <span className="border border-teal-200/35 px-3 py-2 text-teal-100">BASICS · 4 LEAVES</span>
              <span className="border border-sky-300/35 px-3 py-2 text-sky-200">BEAUTIFUL HTML · 34 LEAVES</span>
            </div>
            <p className="mt-4 text-[24px] leading-snug text-slate-400">
              Dark surfaces, strict lanes, direct labels, restrained motion.
            </p>
          </div>
        </motion.div>

        <motion.div
          className="self-center border-y border-slate-600"
          data-ai-id="theme-contract"
          variants={motionPreset.fromRight}
        >
          {themeRules.map((item, index) => {
            const Icon = item.icon

            return (
              <motion.div
                className="grid grid-cols-[104px_1fr_190px] items-center gap-7 border-b border-slate-700 py-8 last:border-b-0"
                key={item.label}
                variants={motionPreset.card}
              >
                <div className="flex flex-col gap-3">
                  <Icon className="h-8 w-8 text-teal-200" aria-hidden />
                  <span className="font-mono text-[18px] tracking-[0.1em] text-slate-500">0{index + 1}</span>
                </div>
                <div>
                  <p className="font-mono text-[18px] font-medium tracking-[0.12em] text-sky-200">{item.label}</p>
                  <p className="mt-3 max-w-[650px] text-[29px] leading-snug text-slate-100">{item.rule}</p>
                </div>
                <div className="flex justify-end">{item.sample}</div>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </motion.section>
  )
}
