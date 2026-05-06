const selectorForElement = (element: Element) => {
  const tag = element.tagName.toLowerCase()
  const id = element.id ? `#${CSS.escape(element.id)}` : ''
  const className = Array.from(element.classList)
    .filter((name) => !name.startsWith('edit-inspect-'))
    .slice(0, 2)
    .map((name) => `.${CSS.escape(name)}`)
    .join('')

  return `${tag}${id}${className}`
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
