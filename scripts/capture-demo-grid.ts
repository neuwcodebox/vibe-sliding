import { mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'

const CANVAS_WIDTH = 1920
const CANVAS_HEIGHT = 1080
const GRID_GAP = 32
const GRID_PADDING = 48
const SCREENSHOTS_DIR = 'screenshots'
const OUTPUT_PATH = 'docs/demo-slides-grid.png'

async function getRegisteredSlideCount() {
  const source = await readFile('src/slides.ts', 'utf8')
  return source.match(/file:\s*['"]/g)?.length ?? 0
}

function getTileSize(slideCount: number) {
  const columns = Math.ceil(Math.sqrt(slideCount))
  const rows = Math.ceil(slideCount / columns)
  const widthFromColumns =
    (CANVAS_WIDTH - GRID_PADDING * 2 - GRID_GAP * (columns - 1)) / columns
  const widthFromRows =
    ((CANVAS_HEIGHT - GRID_PADDING * 2 - GRID_GAP * (rows - 1)) / rows) *
    (16 / 9)
  const width = Math.floor(Math.min(widthFromColumns, widthFromRows))

  return { columns, width, height: Math.floor((width * 9) / 16) }
}

async function readSlideImages(slideCount: number) {
  return Promise.all(
    Array.from({ length: slideCount }, async (_, index) => {
      const slideNumber = String(index + 1).padStart(3, '0')
      const capturePath = path.join(SCREENSHOTS_DIR, `slide-${slideNumber}.png`)

      try {
        const image = await readFile(capturePath)
        return image.toString('base64')
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
          throw new Error(
            `Missing ${capturePath}. Run npm run capture:all before generating the demo grid.`,
            { cause: error },
          )
        }

        throw error
      }
    }),
  )
}

function buildGridDocument(images: string[], columns: number, width: number, height: number) {
  const tiles = images
    .map(
      (image, index) => `
        <figure class="slide">
          <img alt="Demo slide ${index + 1}" src="data:image/png;base64,${image}" />
        </figure>`,
    )
    .join('')

  return `<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <style>
          * { box-sizing: border-box; }
          html, body { width: ${CANVAS_WIDTH}px; height: ${CANVAS_HEIGHT}px; margin: 0; }
          body { display: grid; place-items: center; overflow: hidden; background: #080d18; }
          main {
            display: flex;
            width: ${width * columns + GRID_GAP * (columns - 1)}px;
            flex-wrap: wrap;
            justify-content: center;
            gap: ${GRID_GAP}px;
          }
          .slide {
            width: ${width}px;
            height: ${height}px;
            margin: 0;
            overflow: hidden;
            outline: 1px solid rgba(148, 163, 184, 0.38);
            background: #0b1020;
          }
          img { display: block; width: 100%; height: 100%; }
        </style>
      </head>
      <body><main>${tiles}</main></body>
    </html>`
}

async function captureDemoGrid() {
  const slideCount = await getRegisteredSlideCount()

  if (slideCount < 1) {
    throw new Error('No slides registered in src/slides.ts.')
  }

  const images = await readSlideImages(slideCount)
  const { columns, width, height } = getTileSize(slideCount)
  const browser = await chromium.launch()
  const page = await browser.newPage({
    viewport: { width: CANVAS_WIDTH, height: CANVAS_HEIGHT },
  })

  try {
    await page.setContent(buildGridDocument(images, columns, width, height))
    await page.waitForFunction(
      'Array.from(document.images).every((image) => image.complete && image.naturalWidth > 0)',
    )
    await mkdir(path.dirname(OUTPUT_PATH), { recursive: true })
    await page.screenshot({ path: OUTPUT_PATH, fullPage: false })
    console.log(`Captured ${OUTPUT_PATH}`)
  } finally {
    await browser.close()
  }
}

captureDemoGrid().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
