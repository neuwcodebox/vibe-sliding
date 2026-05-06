const selectorForElement = (element: Element) => {
  const tag = element.tagName.toLowerCase()
  const id = element.id ? `#${CSS.escape(element.id)}` : ''
  const aiId = element.getAttribute('data-ai-id')
  const aiIdSelector = aiId ? `[data-ai-id="${CSS.escape(aiId)}"]` : ''
  const ariaLabel = element.getAttribute('aria-label')
  const ariaSelector = ariaLabel ? `[aria-label="${CSS.escape(ariaLabel)}"]` : ''
  const className = Array.from(element.classList)
    .filter((name) => !name.startsWith('edit-inspect-'))
    .slice(0, 2)
    .map((name) => `.${CSS.escape(name)}`)
    .join('')

  return `${tag}${id}${aiIdSelector}${ariaSelector}${className}`
}

export function getShortDomPath(element: Element, root: Element) {
  const segments: string[] = []
  let current: Element | null = element

  while (current && current !== root && segments.length < 4) {
    segments.unshift(selectorForElement(current))
    current = current.parentElement
  }

  return segments.join(' > ')
}

export function getAnchoredDomPath(element: Element, root: Element) {
  const segments: string[] = []
  let current: Element | null = element

  while (current && current !== root && segments.length < 5) {
    segments.unshift(selectorForElement(current))

    if (
      current !== element &&
      (current.hasAttribute('data-ai-id') || current.hasAttribute('aria-label') || current.id)
    ) {
      break
    }

    current = current.parentElement
  }

  return segments.join(' > ')
}
