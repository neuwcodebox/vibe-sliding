import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'

const BASE_URL = process.env.SLIDE_BASE_URL ?? 'http://localhost:5173'
const SCREENSHOTS_DIR = 'screenshots'
const CAPTURE_SETTLE_MS = Number.parseInt(
  process.env.SLIDE_CAPTURE_SETTLE_MS ?? '1200',
  10,
)

const parseSlideNumber = () => {
  const rawSlide = process.argv[2]
  const slideNumber = Number.parseInt(rawSlide ?? '', 10)

  if (!Number.isFinite(slideNumber) || slideNumber < 1) {
    throw new Error('Usage: npm run capture:slide -- <slide-number>')
  }

  return slideNumber
}

export async function captureSlide(slideNumber: number) {
  await mkdir(SCREENSHOTS_DIR, { recursive: true })

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
  const outputPath = path.join(
    SCREENSHOTS_DIR,
    `slide-${String(slideNumber).padStart(3, '0')}.png`,
  )

  try {
    await page.goto(`${BASE_URL}/?slide=${slideNumber}`, {
      waitUntil: 'networkidle',
      timeout: 8000,
    })
    await page.waitForTimeout(CAPTURE_SETTLE_MS)
    await page.screenshot({ path: outputPath, fullPage: false })
    console.log(`Captured ${outputPath}`)
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

if (import.meta.url === `file://${process.argv[1]}`) {
  captureSlide(parseSlideNumber()).catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
}
