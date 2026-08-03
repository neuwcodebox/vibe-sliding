import { ArrowRight, Braces, FolderTree, MonitorPlay } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { DemoChrome } from './_shared/demo-chrome'
import { getDemoMotion } from './_shared/demo-motion'

const fileTree = [
  ['src/', 'folder'],
  ['  slides/', 'folder'],
  ['    001-title.tsx', 'file'],
  ['    002-agenda.tsx', 'file'],
  ['  slides.ts', 'file'],
  ['designs/', 'folder'],
  ['  basics/', 'folder'],
  ['    technical-grid.md', 'theme'],
  ['  beautiful-html-templates/', 'folder'],
  ['    templates/cobalt-grid/', 'theme'],
]

const codeLines = [
  '<section className="h-full w-full">',
  '  <h1 data-ai-id="main-title">',
  '    Tell the story.',
  '  </h1>',
  '</section>',
]

export default function Slide003Content() {
  const motionPreset = getDemoMotion(Boolean(useReducedMotion()))

  return (
    <motion.section
      animate="show"
      className="relative h-full w-full overflow-hidden bg-[#0b1020] px-24 py-20 text-slate-50 [word-break:keep-all]"
      initial="hidden"
      variants={motionPreset.root}
    >
      <DemoChrome page="03" section="LOCAL SOURCE SURFACE" />

      <div className="relative z-10 flex h-full flex-col pt-14">
        <motion.div className="flex items-end justify-between" variants={motionPreset.rise}>
          <div>
            <p className="flex items-center gap-3 font-mono text-[20px] font-medium tracking-[0.13em] text-teal-100" data-ai-id="section-kicker">
              <Braces className="h-6 w-6" aria-hidden />
              OPEN, LOCAL, REVISION-READY
            </p>
            <h1 className="mt-7 text-[86px] font-semibold leading-[0.94] tracking-[-0.045em]" data-ai-id="main-title">
              The deck stays in React.
            </h1>
          </div>
          <p className="max-w-[610px] pb-2 text-[28px] leading-snug text-slate-300" data-ai-id="summary">
            The agent edits ordinary TSX in your repo. You keep the source,
            version it, and revise it later.
          </p>
        </motion.div>

        <motion.div
          className="mt-12 grid flex-1 grid-cols-[0.88fr_52px_1.16fr_52px_0.86fr] items-center"
          data-ai-id="source-flow"
          variants={motionPreset.root}
        >
          <motion.article className="min-h-[500px] border border-slate-600 bg-[#111827] p-8" variants={motionPreset.card}>
            <div className="flex items-center justify-between border-b border-slate-700 pb-5">
              <div className="flex items-center gap-3 font-mono text-[20px] tracking-[0.12em] text-teal-100">
                <FolderTree className="h-6 w-6" aria-hidden />
                FILE TREE
              </div>
              <span className="font-mono text-[17px] text-slate-500">LOCAL</span>
            </div>
            <div className="mt-6 space-y-2 font-mono text-[21px] leading-snug">
              {fileTree.map(([name, kind]) => (
                <p className={`whitespace-pre ${kind === 'theme' ? 'text-sky-200' : kind === 'folder' ? 'text-teal-100' : 'text-slate-300'}`} key={name}>
                  {name}
                </p>
              ))}
            </div>
            <p className="mt-7 border-t border-slate-700 pt-4 text-[20px] leading-snug text-slate-400">
              Every slide is a normal component—not a proprietary canvas.
            </p>
          </motion.article>

          <div className="flex justify-center">
            <ArrowRight className="h-9 w-9 text-teal-200" aria-hidden />
          </div>

          <motion.article className="min-h-[500px] border border-teal-200/45 bg-[#111827] p-8" variants={motionPreset.card}>
            <div className="flex items-center justify-between border-b border-slate-700 pb-5">
              <div className="flex items-center gap-3 font-mono text-[20px] tracking-[0.12em] text-teal-100">
                <Braces className="h-6 w-6" aria-hidden />
                TSX SOURCE
              </div>
              <span className="font-mono text-[17px] text-slate-500">EDITABLE</span>
            </div>
            <div className="mt-9 bg-[#080d18] p-7 font-mono text-[23px] leading-[1.7] text-slate-300">
              {codeLines.map((line, index) => (
                <p className={index === 1 ? 'text-teal-100' : index === 2 ? 'text-white' : ''} key={`${line}-${index}`}>
                  {line}
                </p>
              ))}
            </div>
            <div className="mt-8 flex items-center gap-4 border-l-2 border-sky-300 pl-5 text-[23px] leading-snug text-sky-100">
              <span className="font-mono">data-ai-id</span>
              <span className="text-slate-400">makes the next edit precise.</span>
            </div>
          </motion.article>

          <div className="flex justify-center">
            <ArrowRight className="h-9 w-9 text-sky-200" aria-hidden />
          </div>

          <motion.article className="min-h-[500px] border border-slate-600 bg-[#111827] p-8" variants={motionPreset.card}>
            <div className="flex items-center justify-between border-b border-slate-700 pb-5">
              <div className="flex items-center gap-3 font-mono text-[20px] tracking-[0.12em] text-teal-100">
                <MonitorPlay className="h-6 w-6" aria-hidden />
                BROWSER
              </div>
              <span className="font-mono text-[17px] text-slate-500">RENDERED</span>
            </div>
            <div className="mt-9 border border-slate-600 bg-[#0b1020] p-6">
              <div className="flex gap-2">
                <span className="h-3 w-3 bg-rose-300" />
                <span className="h-3 w-3 bg-amber-200" />
                <span className="h-3 w-3 bg-teal-200" />
              </div>
              <p className="mt-10 font-mono text-[17px] tracking-[0.12em] text-teal-100">SLIDE 01 / THE BRIEF</p>
              <p className="mt-5 text-[47px] font-semibold leading-[0.95] tracking-[-0.04em] text-white">Tell the story.</p>
              <div className="mt-7 h-2 w-32 bg-teal-200" />
              <p className="mt-7 text-[22px] leading-snug text-slate-400">A fixed 16:9 stage keeps the composition intact on every screen.</p>
            </div>
            <p className="mt-8 border-t border-slate-700 pt-5 text-[23px] leading-snug text-slate-400">
              Preview live · present with keys · jump to ?slide=N.
            </p>
          </motion.article>
        </motion.div>
      </div>
    </motion.section>
  )
}
