import { mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'
import PptxGenJSModule from 'pptxgenjs'

const BASE_URL = process.env.SLIDE_BASE_URL ?? 'http://localhost:5173'
const DEFAULT_OUTPUT_PATH = 'exports/vibe-sliding.pptx'
const CAPTURE_SETTLE_MS = Number.parseInt(
  process.env.SLIDE_CAPTURE_SETTLE_MS ?? '1200',
  10,
)
const CAPTURE_VIEWPORT = { width: 1920, height: 1080 }
const PPTX_SLIDE_WIDTH = 13.333333
const PPTX_SLIDE_HEIGHT = 7.5
const PptxGenJS =
  (PptxGenJSModule as unknown as { default?: typeof PptxGenJSModule })
    .default ?? PptxGenJSModule

async function getRegisteredSlideCount() {
  const source = await readFile('src/slides.ts', 'utf8')
  return source.match(/file:\s*['"]/g)?.length ?? 0
}

function getOutputPath() {
  return process.argv[2] ?? DEFAULT_OUTPUT_PATH
}

async function exportPptx(outputPath: string) {
  const slideCount = await getRegisteredSlideCount()

  if (slideCount < 1) {
    console.error('No slides registered in src/slides.ts.')
    process.exitCode = 1
    return
  }

  await mkdir(path.dirname(outputPath), { recursive: true })

  const pptx = new PptxGenJS()
  pptx.layout = 'LAYOUT_WIDE'
  pptx.author = 'Vibe Sliding'
  pptx.company = 'Vibe Sliding'
  pptx.subject = 'Image-based export from Vibe Sliding'
  pptx.title = path.basename(outputPath, path.extname(outputPath))

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: CAPTURE_VIEWPORT })

  try {
    for (let index = 0; index < slideCount; index += 1) {
      const slideNumber = index + 1

      await page.goto(`${BASE_URL}/?slide=${slideNumber}`, {
        waitUntil: 'networkidle',
        timeout: 8000,
      })
      await page.waitForTimeout(CAPTURE_SETTLE_MS)

      const screenshot = await page.screenshot({ fullPage: false })
      const pptxSlide = pptx.addSlide()

      pptxSlide.addImage({
        data: `image/png;base64,${screenshot.toString('base64')}`,
        x: 0,
        y: 0,
        w: PPTX_SLIDE_WIDTH,
        h: PPTX_SLIDE_HEIGHT,
        altText: `Slide ${slideNumber}`,
      })

      console.log(`Added slide ${slideNumber}/${slideCount}`)
    }

    await pptx.writeFile({ fileName: outputPath })
    console.log(`Exported ${outputPath}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(
      `Could not connect to ${BASE_URL}.\nStart the dev server with: npm run dev\n${message}`,
      { cause: error },
    )
  } finally {
    await browser.close()
  }
}

exportPptx(getOutputPath()).catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
