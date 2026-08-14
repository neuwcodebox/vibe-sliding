export const PRESENTER_CHANNEL = 'vibe-sliding-presenter'
const STORAGE_KEY = 'vibe-sliding-presenter-slide'

type SlideChangeMessage = {
  type: 'slide-change'
  index: number
}

const isSlideChangeMessage = (value: unknown): value is SlideChangeMessage =>
  typeof value === 'object' &&
  value !== null &&
  'type' in value &&
  'index' in value &&
  value.type === 'slide-change' &&
  typeof value.index === 'number'

export const publishSlideChange = (index: number) => {
  const message: SlideChangeMessage = { type: 'slide-change', index }

  if (typeof BroadcastChannel !== 'undefined') {
    const channel = new BroadcastChannel(PRESENTER_CHANNEL)
    channel.postMessage(message)
    channel.close()
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(message))
  } catch {
    // BroadcastChannel is the preferred transport; storage can be unavailable.
  }
}

export const subscribeToSlideChanges = (onSlideChange: (index: number) => void) => {
  const channel =
    typeof BroadcastChannel !== 'undefined'
      ? new BroadcastChannel(PRESENTER_CHANNEL)
      : null

  const onMessage = (event: MessageEvent<unknown>) => {
    if (isSlideChangeMessage(event.data)) {
      onSlideChange(event.data.index)
    }
  }
  const onStorage = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY || !event.newValue) {
      return
    }

    try {
      const message: unknown = JSON.parse(event.newValue)
      if (isSlideChangeMessage(message)) {
        onSlideChange(message.index)
      }
    } catch {
      // Ignore malformed values from other pages sharing this origin.
    }
  }

  channel?.addEventListener('message', onMessage)
  window.addEventListener('storage', onStorage)

  return () => {
    channel?.removeEventListener('message', onMessage)
    channel?.close()
    window.removeEventListener('storage', onStorage)
  }
}
