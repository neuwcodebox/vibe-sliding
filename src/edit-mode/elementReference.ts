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
    const ariaLabel = current.getAttribute('aria-label')
    const text = compactText(getElementText(current), 48)

    if (aiId || ariaLabel || text) {
      return { aiId, ariaLabel, text, tag: current.tagName.toLowerCase() }
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
          : `path:${quote(fallbackPath)}`

  const parts = [
    `@slide:${slideNumber}`,
    `@file:${slideFile}`,
    `@target:${target}`,
  ]

  if (text) {
    parts.push(`@text:${quote(text)}`)
  } else if (ariaLabel) {
    parts.push(`@label:${quote(ariaLabel)}`)
  } else if (alt) {
    parts.push(`@alt:${quote(alt)}`)
  }

  if (!aiId && context) {
    if (context.aiId) {
      parts.push(`@within:data-ai-id=${context.aiId}`)
    } else if (context.ariaLabel) {
      parts.push(`@within:${context.tag}[aria-label=${quote(context.ariaLabel)}]`)
    } else if (context.text) {
      parts.push(`@within:${context.tag} @within-text:${quote(context.text)}`)
    }
  }

  return parts.join(' ')
}
