declare module 'dom-to-pptx' {
  type FontConfig = {
    name: string
    url: string
  }

  type ExportToPptxOptions = {
    autoEmbedFonts?: boolean
    fileName?: string
    fonts?: FontConfig[]
    height?: number
    layout?: string
    skipDownload?: boolean
    svgAsVector?: boolean
    width?: number
  }

  export function exportToPptx(
    elementOrSelector: string | HTMLElement | Array<string | HTMLElement>,
    options?: ExportToPptxOptions,
  ): Promise<Blob>
}
