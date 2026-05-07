export type EditablePptxExportOptions = {
  fileName?: string
  settleMs?: number
}

export type EditablePptxExportResult = {
  base64: string
  slideCount: number
}

declare global {
  interface Window {
    __vibeSlidingExportEditablePptx?: (
      options?: EditablePptxExportOptions,
    ) => Promise<EditablePptxExportResult>
  }
}

export {}
