import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { chromium } from 'playwright'

const BASE_URL = process.env.SLIDE_BASE_URL ?? 'http://localhost:5173'
const DEFAULT_OUTPUT_PATH = 'exports/vibe-sliding-editable.pptx'
const CAPTURE_SETTLE_MS = Number.parseInt(
  process.env.SLIDE_CAPTURE_SETTLE_MS ?? '1200',
  10,
)
const EXPORT_VIEWPORT = { width: 1920, height: 1080 }

type EditablePptxExportResult = {
  base64: string
  slideCount: number
}

type EditablePptxExportBridge = {
  __vibeSlidingExportEditablePptx?: (options: {
    fileName: string
    settleMs: number
  }) => Promise<EditablePptxExportResult>
}

function getOutputPath() {
  return process.argv[2] ?? DEFAULT_OUTPUT_PATH
}

async function exportEditablePptx(outputPath: string) {
  await mkdir(path.dirname(outputPath), { recursive: true })

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: EXPORT_VIEWPORT })

  try {
    await page.goto(`${BASE_URL}/?export=editable-pptx`, {
      waitUntil: 'networkidle',
      timeout: 8000,
    })
    await page.waitForFunction(
      "typeof globalThis.__vibeSlidingExportEditablePptx === 'function'",
      undefined,
      { timeout: 8000 },
    )

    const result = await page.evaluate(
      async ({ fileName, settleMs }) => {
        const bridge = globalThis as EditablePptxExportBridge

        if (!bridge.__vibeSlidingExportEditablePptx) {
          throw new Error('Editable PPTX export bridge was not registered.')
        }

        return bridge.__vibeSlidingExportEditablePptx({
          fileName,
          settleMs,
        })
      },
      {
        fileName: path.basename(outputPath),
        settleMs: CAPTURE_SETTLE_MS,
      },
    ) as EditablePptxExportResult

    await writeFile(outputPath, Buffer.from(result.base64, 'base64'))
    console.log(`Exported ${outputPath} with ${result.slideCount} editable slides`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    throw new Error(
      `Could not export editable PPTX from ${BASE_URL}.\nStart the dev server with: npm run dev\n${message}`,
      { cause: error },
    )
  } finally {
    await browser.close()
  }
}

exportEditablePptx(getOutputPath()).catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
