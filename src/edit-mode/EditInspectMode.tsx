import { Check, Copy, ListChecks, MessageSquare, MousePointer2, PanelBottomClose, PanelBottomOpen, Pencil, Trash2, X } from 'lucide-react'
import { type RefObject, useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { createEditReference, getElementLabel } from './elementReference'

type Props = { active: boolean; onGoToSlide: (index: number) => void; slideFile: string; slideNumber: number; stageRef: RefObject<HTMLDivElement | null> }
type Tool = 'copy' | 'comment'
type Hover = { element: Element; label: string; rect: DOMRect }
type Comment = { id: number; locator: number[]; reference: string; slideFile: string; slideNumber: number; text: string }
type Draft = Omit<Comment, 'id'> & { commentId?: number }
type Rect = { height: number; left: number; top: number; width: number }
type Toast = { content?: string; message: string }

const isInspectable = (element: Element, root: HTMLElement) => {
  if (!root.contains(element) || element.closest('[data-edit-inspect-ui="true"]')) return false
  const style = window.getComputedStyle(element)
  return style.display !== 'none' && style.visibility !== 'hidden' && style.pointerEvents !== 'none'
}

const depth = (element: Element, root: HTMLElement) => {
  let value = 0
  let current: Element | null = element
  while (current && current !== root) { value += 1; current = current.parentElement }
  return value
}

const elementAtPoint = (event: PointerEvent | MouseEvent, root: HTMLElement) => {
  const rootRect = root.getBoundingClientRect()
  const scaleX = rootRect.width / root.offsetWidth
  const scaleY = rootRect.height / root.offsetHeight
  if (scaleX <= 0 || scaleY <= 0) return null
  const x = (event.clientX - rootRect.left) / scaleX
  const y = (event.clientY - rootRect.top) / scaleY
  if (x < 0 || y < 0 || x > root.offsetWidth || y > root.offsetHeight) return null

  return Array.from(root.querySelectorAll('*'))
    .filter((element) => {
      if (!isInspectable(element, root)) return false
      const rect = element.getBoundingClientRect()
      const left = (rect.left - rootRect.left) / scaleX
      const top = (rect.top - rootRect.top) / scaleY
      return rect.width > 0 && rect.height > 0 && x >= left && x <= left + rect.width / scaleX && y >= top && y <= top + rect.height / scaleY
    })
    .reduce<Element | null>((best, element) => {
      if (!best) return element
      const depthDifference = depth(element, root) - depth(best, root)
      if (depthDifference) return depthDifference > 0 ? element : best
      const bestRect = best.getBoundingClientRect()
      const rect = element.getBoundingClientRect()
      return rect.width * rect.height < bestRect.width * bestRect.height ? element : best
    }, null)
}

const createLocator = (element: Element, root: HTMLElement) => {
  const locator: number[] = []
  let current: Element | null = element
  while (current && current !== root) {
    const parentElement: Element | null = current.parentElement
    if (!parentElement) return []
    locator.unshift(Array.from(parentElement.children).indexOf(current))
    current = parentElement
  }
  return current === root ? locator : []
}

const resolveLocator = (locator: number[], root: HTMLElement) => {
  let current: Element = root
  for (const index of locator) {
    const child = current.children.item(index)
    if (!child) return null
    current = child
  }
  return current === root ? null : current
}

const sameLocator = (left: number[], right: number[]) => left.length === right.length && left.every((value, index) => value === right[index])
const formatPrompt = (comments: Comment[]) => comments.map((comment, index) => `${index + 1}. ${comment.reference}\n${comment.text}`).join('\n\n---\n\n')

export function EditInspectMode({ active, onGoToSlide, slideFile, slideNumber, stageRef }: Props) {
  const [tool, setTool] = useState<Tool>('copy')
  const [hover, setHover] = useState<Hover | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [bubbleRects, setBubbleRects] = useState<Record<number, Rect>>({})
  const [hoveredBubbleId, setHoveredBubbleId] = useState<number | null>(null)
  const [draft, setDraft] = useState<Draft | null>(null)
  const [listOpen, setListOpen] = useState(false)
  const [toolbarOpen, setToolbarOpen] = useState(false)
  const [locatedCommentId, setLocatedCommentId] = useState<number | null>(null)
  const [toast, setToast] = useState<Toast | null>(null)
  const nextId = useRef(1)
  const locateTimer = useRef<number | null>(null)
  const suppressPointerFocus = useRef(false)
  const toastTimer = useRef<number | null>(null)

  const showToast = useCallback((value: Toast) => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current)
    setToast(value)
    toastTimer.current = window.setTimeout(() => setToast(null), 2600)
  }, [])

  const copyText = useCallback(async (content: string, message: string) => {
    try { await navigator.clipboard.writeText(content); showToast({ message }) }
    catch { showToast({ content, message: '클립보드를 사용할 수 없습니다. 아래 내용을 직접 복사하세요.' }) }
  }, [showToast])

  const selectToolbarAction = (action: () => void) => {
    action()
    setToolbarOpen(false)
  }

  const editComment = useCallback((comment: Comment) => setDraft({ ...comment, commentId: comment.id }), [])
  const deleteComment = useCallback((id: number) => {
    setComments((current) => current.filter((comment) => comment.id !== id))
    setDraft((current) => current?.commentId === id ? null : current)
  }, [])

  const locateComment = useCallback((comment: Comment) => {
    if (locateTimer.current !== null) window.clearTimeout(locateTimer.current)
    setListOpen(false)
    setLocatedCommentId(comment.id)
    onGoToSlide(comment.slideNumber - 1)
    locateTimer.current = window.setTimeout(() => setLocatedCommentId(null), 1800)
  }, [onGoToSlide])

  const openDraft = useCallback((element: Element, root: HTMLElement) => {
    const locator = createLocator(element, root)
    const existing = comments.find((comment) => comment.slideNumber === slideNumber && comment.slideFile === slideFile && sameLocator(comment.locator, locator))
    if (existing) { editComment(existing); return }
    setDraft({ locator, reference: createEditReference({ element, root, slideFile, slideNumber }), slideFile, slideNumber, text: '' })
  }, [comments, editComment, slideFile, slideNumber])

  const saveDraft = useCallback(() => {
    if (!draft?.text.trim()) return
    if (draft.commentId !== undefined) {
      setComments((current) => current.map((comment) => comment.id === draft.commentId ? { ...comment, text: draft.text.trim() } : comment))
      showToast({ message: '피드백을 수정했습니다.' })
    } else {
      setComments((current) => [...current, { id: nextId.current++, locator: draft.locator, reference: draft.reference, slideFile: draft.slideFile, slideNumber: draft.slideNumber, text: draft.text.trim() }])
      showToast({ message: '피드백을 추가했습니다.' })
    }
    setDraft(null)
  }, [draft, showToast])

  useEffect(() => () => {
    if (toastTimer.current !== null) window.clearTimeout(toastTimer.current)
    if (locateTimer.current !== null) window.clearTimeout(locateTimer.current)
  }, [])
  useEffect(() => {
    const removePointerFocus = (event: FocusEvent) => {
      if (!suppressPointerFocus.current || !(event.target instanceof HTMLButtonElement) || !event.target.closest('.audience-quick-controls')) return
      event.target.blur()
      suppressPointerFocus.current = false
    }
    window.addEventListener('focusin', removePointerFocus, true)
    return () => window.removeEventListener('focusin', removePointerFocus, true)
  }, [])
  useEffect(() => {
    if (active) return
    const frame = window.requestAnimationFrame(() => { setHover(null); setHoveredBubbleId(null); setDraft(null); setListOpen(false); setToolbarOpen(false) })
    return () => window.cancelAnimationFrame(frame)
  }, [active])
  useEffect(() => {
    const frame = window.requestAnimationFrame(() => { setHover(null); setHoveredBubbleId(null); setDraft(null) })
    return () => window.cancelAnimationFrame(frame)
  }, [slideFile, slideNumber])

  useEffect(() => {
    if (!active) return
    const root = stageRef.current
    if (!root) return
    const update = () => {
      const next: Record<number, Rect> = {}
      comments.forEach((comment) => {
        if (comment.slideNumber !== slideNumber || comment.slideFile !== slideFile) return
        const element = resolveLocator(comment.locator, root)
        if (!element) return
        const rect = element.getBoundingClientRect()
        next[comment.id] = { height: rect.height, left: rect.left, top: rect.top, width: rect.width }
      })
      setBubbleRects((current) => {
        const currentIds = Object.keys(current)
        const nextIds = Object.keys(next)
        const unchanged = currentIds.length === nextIds.length && nextIds.every((id) => {
          const currentRect = current[Number(id)]
          const nextRect = next[Number(id)]
          return currentRect?.height === nextRect.height && currentRect.left === nextRect.left && currentRect.top === nextRect.top && currentRect.width === nextRect.width
        })
        return unchanged ? current : next
      })
    }
    let frame = window.requestAnimationFrame(function trackElements() {
      update()
      frame = window.requestAnimationFrame(trackElements)
    })
    return () => window.cancelAnimationFrame(frame)
  }, [active, comments, slideFile, slideNumber, stageRef])

  useEffect(() => {
    if (locatedCommentId === null || !bubbleRects[locatedCommentId]) return
    const frame = window.requestAnimationFrame(() => {
      const bubble = document.querySelector(`[data-edit-comment-id="${locatedCommentId}"]`)
      if (bubble instanceof HTMLButtonElement) bubble.focus({ preventScroll: true })
    })
    return () => window.cancelAnimationFrame(frame)
  }, [bubbleRects, locatedCommentId])

  useEffect(() => {
    if (!active) return
    const root = stageRef.current
    if (!root) return
    const onMove = (event: PointerEvent) => {
      const element = elementAtPoint(event, root)
      setHover(element ? { element, label: getElementLabel(element), rect: element.getBoundingClientRect() } : null)
    }
    const onClick = (event: MouseEvent) => {
      const element = elementAtPoint(event, root)
      if (!element) return
      event.preventDefault(); event.stopPropagation()
      if (tool === 'comment') { openDraft(element, root); return }
      const reference = createEditReference({ element, root, slideFile, slideNumber })
      void copyText(reference, '요소 참조를 복사했습니다.')
    }
    const onLeave = () => setHover(null)
    root.addEventListener('pointermove', onMove, true)
    root.addEventListener('pointerleave', onLeave, true)
    root.addEventListener('click', onClick, true)
    return () => { root.removeEventListener('pointermove', onMove, true); root.removeEventListener('pointerleave', onLeave, true); root.removeEventListener('click', onClick, true) }
  }, [active, copyText, openDraft, slideFile, slideNumber, stageRef, tool])

  useEffect(() => {
    if (!active) return
    const onKeyDown = (event: KeyboardEvent) => {
      const editing = event.target instanceof Element && Boolean(event.target.closest('input, textarea, select, [contenteditable="true"]'))
      if (event.key === 'Escape' && (draft || listOpen)) {
        event.preventDefault(); event.stopImmediatePropagation()
        if (draft) setDraft(null); else setListOpen(false)
        return
      }
      if (editing || event.metaKey || event.ctrlKey || event.altKey) return
      if (event.key.toLowerCase() === 'r') { event.preventDefault(); setTool('copy') }
      if (event.key.toLowerCase() === 'f') { event.preventDefault(); setTool('comment') }
      if (event.key.toLowerCase() === 'v') { event.preventDefault(); setListOpen((open) => !open) }
    }
    window.addEventListener('keydown', onKeyDown, true)
    return () => window.removeEventListener('keydown', onKeyDown, true)
  }, [active, draft, listOpen])

  if (!active) return null
  const currentComments = comments.filter((comment) => comment.slideNumber === slideNumber && comment.slideFile === slideFile)

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-50 font-sans" data-edit-inspect-ui="true">
      {hover && !draft && <>
        <div className="absolute rounded-sm border-2 border-cyan-300 bg-cyan-300/10 shadow-[0_0_0_1px_rgba(8,145,178,0.35)]" style={{ left: hover.rect.left, top: hover.rect.top, width: hover.rect.width, height: hover.rect.height }} />
        <div className="absolute max-w-[520px] truncate rounded bg-cyan-300 px-2.5 py-1 font-mono text-sm font-semibold text-slate-950 shadow-lg" style={{ left: Math.max(8, hover.rect.left), top: Math.max(8, hover.rect.top - 30) }}>{hover.label}</div>
      </>}

      {hoveredBubbleId !== null && bubbleRects[hoveredBubbleId] && <div
        className="absolute rounded-sm border-2 border-cyan-300 bg-cyan-300/10 shadow-[0_0_0_1px_rgba(8,145,178,0.35)]"
        style={{
          height: bubbleRects[hoveredBubbleId].height,
          left: bubbleRects[hoveredBubbleId].left,
          top: bubbleRects[hoveredBubbleId].top,
          width: bubbleRects[hoveredBubbleId].width,
        }}
      />}

      {currentComments.map((comment) => {
        const rect = bubbleRects[comment.id]
        if (!rect) return null
        const number = comments.findIndex((item) => item.id === comment.id) + 1
        return <button key={comment.id} type="button" data-edit-comment-id={comment.id} className={`pointer-events-auto absolute grid h-8 min-w-8 place-items-center rounded-full border-2 border-white bg-amber-400 px-2 text-sm font-bold text-slate-950 shadow-lg transition-transform hover:scale-110 focus-visible:outline-none ${locatedCommentId === comment.id ? 'scale-125 ring-4 ring-amber-300/50' : ''}`} style={{ left: rect.left + rect.width, top: rect.top, translate: '-50% -50%' }} onPointerEnter={() => { setHover(null); setHoveredBubbleId(comment.id) }} onPointerLeave={() => setHoveredBubbleId(null)} onClick={() => editComment(comment)} aria-label={`${number}번 피드백 편집`} title={`${number}. ${comment.text}`}>{number}</button>
      })}

      <div className="absolute left-5 top-5 rounded bg-cyan-300 px-3 py-1.5 font-mono text-sm font-semibold text-slate-950 shadow-lg">Edit Mode</div>

      {listOpen && <section className="pointer-events-auto absolute bottom-20 right-5 flex max-h-[min(680px,calc(100vh-120px))] w-[min(460px,calc(100vw-40px))] flex-col overflow-hidden rounded-xl border border-slate-600 bg-slate-950 text-white shadow-2xl" aria-label="피드백 목록">
        <header className="flex items-center justify-between border-b border-slate-700 px-4 py-3"><div><h2 className="m-0 text-base font-semibold">피드백</h2><p className="m-0 mt-0.5 text-xs text-slate-400">전체 {comments.length}개 · 현재 슬라이드 {currentComments.length}개</p></div><button type="button" className="grid h-8 w-8 place-items-center rounded-md text-slate-400 hover:bg-slate-800 hover:text-white" onClick={() => setListOpen(false)} aria-label="목록 닫기"><X size={18} /></button></header>
        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          {comments.length === 0 ? <div className="px-6 py-12 text-center text-sm text-slate-400">말풍선 도구로 요소를 선택해 첫 피드백을 추가하세요.</div> : comments.map((comment, index) => <article key={comment.id} className="mb-2 grid grid-cols-[32px_minmax(0,1fr)_auto] gap-2 rounded-lg border border-slate-800 bg-slate-900/70 p-3 last:mb-0">
            <button type="button" className="grid h-7 w-7 place-items-center rounded-full bg-amber-400 text-xs font-bold text-slate-950 transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300" onClick={() => locateComment(comment)} aria-label={`${index + 1}번 피드백 위치로 이동`} title="피드백 위치로 이동">{index + 1}</button>
            <button type="button" className="min-w-0 text-left" onClick={() => editComment(comment)}><span className="block text-[11px] font-semibold text-cyan-300">슬라이드 {comment.slideNumber}</span><code className="mt-1 block truncate text-[11px] text-slate-400">{comment.reference}</code><span className="mt-2 block whitespace-pre-wrap text-sm leading-5 text-slate-100">{comment.text}</span></button>
            <div className="flex items-start gap-1"><button type="button" className="grid h-7 w-7 place-items-center rounded text-slate-400 hover:bg-slate-700 hover:text-white" onClick={() => editComment(comment)} aria-label={`${index + 1}번 피드백 편집`}><Pencil size={14} /></button><button type="button" className="grid h-7 w-7 place-items-center rounded text-slate-400 hover:bg-red-950 hover:text-red-300" onClick={() => deleteComment(comment.id)} aria-label={`${index + 1}번 피드백 삭제`}><Trash2 size={14} /></button></div>
          </article>)}
        </div>
        <footer className="flex items-center justify-between gap-2 border-t border-slate-700 p-3"><button type="button" className="inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm text-red-300 hover:bg-red-950 disabled:opacity-40" onClick={() => { if (comments.length && window.confirm('모든 피드백을 삭제할까요?')) { setComments([]); setDraft(null); showToast({ message: '모든 피드백을 삭제했습니다.' }) } }} disabled={!comments.length}><Trash2 size={15} />전체 삭제</button><button type="button" className="inline-flex h-9 items-center gap-2 rounded-md bg-cyan-300 px-4 text-sm font-semibold text-slate-950 hover:bg-cyan-200 disabled:opacity-40" onClick={() => comments.length && void copyText(formatPrompt(comments), `피드백 ${comments.length}개를 복사했습니다.`)} disabled={!comments.length}><Copy size={15} />전체 복사</button></footer>
      </section>}

      {draft && <div className="pointer-events-auto absolute inset-0 grid place-items-center bg-slate-950/45 p-5 backdrop-blur-[2px]" onMouseDown={(event) => { if (event.target === event.currentTarget) setDraft(null) }}>
        <section className="w-[min(560px,calc(100vw-40px))] overflow-hidden rounded-xl border border-slate-600 bg-slate-950 text-white shadow-2xl" role="dialog" aria-modal="true" aria-label={draft.commentId === undefined ? '피드백 추가' : '피드백 편집'}>
          <header className="flex items-start justify-between border-b border-slate-700 px-5 py-4"><div className="min-w-0"><h2 className="m-0 text-lg font-semibold">{draft.commentId === undefined ? '피드백 추가' : '피드백 편집'}</h2><code className="mt-2 block truncate text-xs text-cyan-300">{draft.reference}</code></div><button type="button" className="ml-4 grid h-8 w-8 shrink-0 place-items-center rounded-md text-slate-400 hover:bg-slate-800" onClick={() => setDraft(null)} aria-label="닫기"><X size={18} /></button></header>
          <div className="p-5"><textarea id="edit-comment-text" aria-label="피드백" autoFocus className="min-h-36 w-full resize-y rounded-lg border border-slate-600 bg-slate-900 px-3 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-500 focus:border-cyan-300" value={draft.text} onChange={(event) => setDraft((current) => current ? { ...current, text: event.target.value } : current)} placeholder="예: 이 제목을 더 짧고 단정한 문장으로 바꿔주세요." /></div>
          <footer className="flex items-center justify-between border-t border-slate-700 px-5 py-3"><div>{draft.commentId !== undefined && <button type="button" className="inline-flex h-9 items-center gap-2 rounded-md px-3 text-sm text-red-300 hover:bg-red-950" onClick={() => deleteComment(draft.commentId!)}><Trash2 size={15} />삭제</button>}</div><div className="flex gap-2"><button type="button" className="h-9 rounded-md px-4 text-sm text-slate-300 hover:bg-slate-800" onClick={() => setDraft(null)}>취소</button><button type="button" className="inline-flex h-9 items-center gap-2 rounded-md bg-cyan-300 px-4 text-sm font-semibold text-slate-950 hover:bg-cyan-200 disabled:opacity-40" onClick={saveDraft} disabled={!draft.text.trim()}><Check size={16} />저장</button></div></footer>
        </section>
      </div>}

      <nav
        className={`audience-quick-controls pointer-events-auto${toolbarOpen ? ' is-open' : ''}`}
        aria-label="편집 도구"
        onPointerDownCapture={(event) => {
          const button = event.target instanceof Element ? event.target.closest('button') : null
          if (button instanceof HTMLButtonElement) suppressPointerFocus.current = true
        }}
        onMouseDownCapture={(event) => {
          const button = event.target instanceof Element ? event.target.closest('button') : null
          if (button instanceof HTMLButtonElement) suppressPointerFocus.current = true
        }}
        onClickCapture={(event) => {
          const button = event.target instanceof Element ? event.target.closest('button') : null
          if (button instanceof HTMLButtonElement) window.setTimeout(() => document.activeElement instanceof HTMLElement && document.activeElement.blur(), 0)
        }}
      >
        {!toolbarOpen && <div className="audience-quick-statuses" aria-live="polite">
          <div className="audience-quick-status edit-tool-status" aria-label={`현재 편집 도구: ${tool === 'copy' ? '요소 참조 복사' : '피드백 추가'}`} title={tool === 'copy' ? '요소 참조 복사' : '피드백 추가'}>
            {tool === 'copy' ? <MousePointer2 size={14} aria-hidden /> : <MessageSquare size={14} aria-hidden />}
          </div>
        </div>}
        {toolbarOpen && <div className="audience-quick-menu" aria-label="편집 도구 메뉴">
          <button type="button" className={tool === 'copy' ? 'is-active' : undefined} onClick={() => selectToolbarAction(() => setTool('copy'))} aria-label="요소 참조 복사 도구" title="요소 참조 복사 (R)"><MousePointer2 size={18} aria-hidden /></button>
          <div className="audience-quick-tool-group" aria-label="피드백">
            <button type="button" className={tool === 'comment' ? 'is-active' : undefined} onClick={() => selectToolbarAction(() => setTool('comment'))} aria-label="피드백 추가" title="피드백 추가 (F)"><MessageSquare size={18} aria-hidden /></button>
            <button type="button" className={listOpen ? 'is-active' : undefined} onClick={() => selectToolbarAction(() => setListOpen((open) => !open))} aria-label="피드백 목록" title="피드백 목록 (V)"><ListChecks size={18} aria-hidden />{comments.length > 0 && <span className="sr-only">{comments.length}개</span>}</button>
          </div>
        </div>}
        <button className="audience-quick-toggle" onClick={() => setToolbarOpen((open) => !open)} aria-label={toolbarOpen ? '편집 도구 접기' : '편집 도구 펼치기'} aria-expanded={toolbarOpen} title={toolbarOpen ? '편집 도구 접기' : '편집 도구 펼치기'}>
          {toolbarOpen ? <PanelBottomClose size={18} aria-hidden /> : <PanelBottomOpen size={18} aria-hidden />}
        </button>
      </nav>

      {toast && <div className="pointer-events-auto absolute bottom-20 left-1/2 max-w-[min(920px,calc(100vw-40px))] -translate-x-1/2 rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white shadow-2xl"><span className="inline-flex items-center gap-2 font-semibold"><Check size={16} className="text-cyan-300" />{toast.message}</span>{toast.content && <code className="mt-2 block max-h-28 overflow-auto whitespace-pre-wrap text-xs text-cyan-200">{toast.content}</code>}</div>}
    </div>,
    document.body,
  )
}
