type DemoChromeProps = {
  page: string
  section: string
}

export function DemoChrome({ page, section }: DemoChromeProps) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(rgba(148,163,184,0.075)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.075)_1px,transparent_1px)] [background-size:80px_80px]" />
      <div className="absolute inset-x-24 top-12 border-t border-slate-600/80" />
      <div className="absolute inset-x-24 bottom-12 border-t border-slate-700/80" />
      <div className="absolute left-24 top-6 font-mono text-[17px] font-medium tracking-[0.14em] text-slate-500">
        VIBE SLIDING / {section}
      </div>
      <div className="absolute right-24 top-6 font-mono text-[17px] font-medium tracking-[0.14em] text-teal-200">
        {page} / 05
      </div>
      <div className="absolute bottom-6 left-24 font-mono text-[16px] tracking-[0.12em] text-slate-600">
        LOCAL · REACT · 16:9
      </div>
      <div className="absolute bottom-6 right-24 font-mono text-[16px] tracking-[0.12em] text-slate-600">
        REVIEW THE RENDER
      </div>
    </div>
  )
}
