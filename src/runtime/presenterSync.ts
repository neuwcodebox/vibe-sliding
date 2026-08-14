export const PRESENTER_CHANNEL = 'vibe-sliding-presenter'
const STORAGE_KEY = 'vibe-sliding-presenter-event'

export type AudienceScreenMode = 'visible' | 'black' | 'white'
export type LaserPointerPosition = { x: number; y: number } | null
export type InkStroke = { points: { x: number; y: number }[] }

type SlideChangeMessage = { type: 'slide-change'; index: number }
type AudienceScreenMessage = { type: 'audience-screen'; mode: AudienceScreenMode }
type LaserPointerMessage = { type: 'laser-pointer'; position: LaserPointerPosition }
type InkMessage = { type: 'ink-strokes'; index: number; strokes: InkStroke[] }
type AudienceHeartbeatMessage = { type: 'audience-heartbeat'; timestamp: number }
type PresenterMessage = SlideChangeMessage | AudienceScreenMessage | LaserPointerMessage | InkMessage | AudienceHeartbeatMessage

const isPresenterMessage = (value: unknown): value is PresenterMessage => {
  if (typeof value !== 'object' || value === null || !('type' in value)) return false
  if (value.type === 'slide-change') return 'index' in value && typeof value.index === 'number'
  if (value.type === 'audience-screen') return 'mode' in value && ['visible', 'black', 'white'].includes(String(value.mode))
  if (value.type === 'ink-strokes') return 'index' in value && typeof value.index === 'number' && 'strokes' in value && Array.isArray(value.strokes)
  if (value.type === 'audience-heartbeat') return 'timestamp' in value && typeof value.timestamp === 'number'
  return value.type === 'laser-pointer' && 'position' in value
}

let publisherChannel: BroadcastChannel | null | undefined

const publish = (message: PresenterMessage) => {
  if (publisherChannel === undefined) {
    publisherChannel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(PRESENTER_CHANNEL) : null
  }
  publisherChannel?.postMessage(message)
  if (window.opener && !window.opener.closed) {
    window.opener.postMessage({ source: PRESENTER_CHANNEL, message }, window.location.origin)
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(message))
  } catch {
    // BroadcastChannel is the preferred transport; storage can be unavailable.
  }
}

const subscribe = (onMessage: (message: PresenterMessage) => void) => {
  const channel = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel(PRESENTER_CHANNEL) : null
  const handleMessage = (message: unknown) => {
    if (isPresenterMessage(message)) onMessage(message)
  }
  const onChannelMessage = (event: MessageEvent<unknown>) => handleMessage(event.data)
  const onWindowMessage = (event: MessageEvent<unknown>) => {
    if (event.origin !== window.location.origin || typeof event.data !== 'object' || event.data === null) return
    const { message, source } = event.data as { message?: unknown; source?: unknown }
    if (source === PRESENTER_CHANNEL) handleMessage(message)
  }
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY || !event.newValue) return
    try { handleMessage(JSON.parse(event.newValue) as unknown) } catch { /* Ignore malformed values. */ }
  }
  channel?.addEventListener('message', onChannelMessage)
  window.addEventListener('message', onWindowMessage)
  window.addEventListener('storage', onStorage)
  return () => {
    channel?.removeEventListener('message', onChannelMessage)
    channel?.close()
    window.removeEventListener('message', onWindowMessage)
    window.removeEventListener('storage', onStorage)
  }
}

export const publishSlideChange = (index: number) => publish({ type: 'slide-change', index })
export const publishAudienceScreenMode = (mode: AudienceScreenMode) => publish({ type: 'audience-screen', mode })
export const publishLaserPointer = (position: LaserPointerPosition) => publish({ type: 'laser-pointer', position })
export const publishInkStrokes = (index: number, strokes: InkStroke[]) => publish({ type: 'ink-strokes', index, strokes })
export const publishAudienceHeartbeat = () => publish({ type: 'audience-heartbeat', timestamp: Date.now() })

export const subscribeToSlideChanges = (callback: (index: number) => void) =>
  subscribe((message) => { if (message.type === 'slide-change') callback(message.index) })

export const subscribeToAudienceScreenMode = (callback: (mode: AudienceScreenMode) => void) =>
  subscribe((message) => { if (message.type === 'audience-screen') callback(message.mode) })

export const subscribeToLaserPointer = (callback: (position: LaserPointerPosition) => void) =>
  subscribe((message) => { if (message.type === 'laser-pointer') callback(message.position) })

export const subscribeToInkStrokes = (callback: (index: number, strokes: InkStroke[]) => void) =>
  subscribe((message) => { if (message.type === 'ink-strokes') callback(message.index, message.strokes) })

export const subscribeToAudienceHeartbeat = (callback: () => void) =>
  subscribe((message) => { if (message.type === 'audience-heartbeat') callback() })
