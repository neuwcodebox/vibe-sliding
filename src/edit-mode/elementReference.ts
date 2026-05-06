import { getAnchoredDomPath, getShortDomPath } from './domPath'

type ElementReferenceInput = {
  element: Element
  root: HTMLElement
  slideFile: string
  slideNumber: number
}

const compactText = (text: string | null | undefined, maxLength = 80) => {
  const normalized = text?.replace(/\s+/g, ' ').trim() ?? ''

  if (normalized.length <= maxLength) {
    return normalized
  }

  return `${normalized.slice(0, maxLength - 1)}...`
}

const quote = (value: string) => `"${value.replace(/"/g, '\\"')}"`
const field = (name: string, value: string | number) => `${name}=${value}`

const getElementText = (element: Element) => {
  if (element instanceof HTMLElement) {
    return element.innerText
  }

  return element.textContent
}

const classHint = (element: Element) => {
  const hint = Array.from(element.classList)
    .filter((name) => !name.startsWith('edit-inspect-'))
    .slice(0, 2)
    .join('.')

  return hint ? `${element.tagName.toLowerCase()}.${hint}` : element.tagName.toLowerCase()
}

const findContextElement = (element: Element, root: HTMLElement) => {
  let current = element.parentElement

  while (current && current !== root) {
    const aiId = current.getAttribute('data-ai-id')

    if (aiId) {
      return { aiId }
    }

    current = current.parentElement
  }

  return null
}

export function getElementLabel(element: Element) {
  const aiId = element.getAttribute('data-ai-id')
  if (aiId) {
    return `${element.tagName.toLowerCase()}[data-ai-id=${aiId}]`
  }

  const text = compactText(getElementText(element), 40)
  if (text) {
    return `${element.tagName.toLowerCase()} ${quote(text)}`
  }

  const ariaLabel = element.getAttribute('aria-label')
  if (ariaLabel) {
    return `${element.tagName.toLowerCase()}[aria-label=${quote(ariaLabel)}]`
  }

  const alt = element.getAttribute('alt')
  if (alt) {
    return `${element.tagName.toLowerCase()}[alt=${quote(alt)}]`
  }

  return classHint(element)
}

export function createEditReference({
  element,
  root,
  slideFile,
  slideNumber,
}: ElementReferenceInput) {
  const aiId = element.getAttribute('data-ai-id')
  const text = compactText(getElementText(element))
  const ariaLabel = compactText(element.getAttribute('aria-label'))
  const alt = compactText(element.getAttribute('alt'))
  const context = findContextElement(element, root)
  const fallbackPath =
    getAnchoredDomPath(element, root) || classHint(element) || getShortDomPath(element, root)
  const target = aiId
    ? `data-ai-id=${aiId}`
    : text
      ? element.tagName.toLowerCase()
      : ariaLabel
        ? element.tagName.toLowerCase()
        : alt
          ? element.tagName.toLowerCase()
          : `path:${fallbackPath}`

  const fields = [
    field('slide', slideNumber),
    field('file', quote(slideFile)),
    field('target', quote(target)),
  ]

  if (text) {
    fields.push(field('text', quote(text)))
  } else if (ariaLabel) {
    fields.push(field('label', quote(ariaLabel)))
  } else if (alt) {
    fields.push(field('alt', quote(alt)))
  }

  if (!aiId && context) {
    fields.push(field('within', quote(`data-ai-id=${context.aiId}`)))
  }

  return `@element(${fields.join(' ')})`
}
