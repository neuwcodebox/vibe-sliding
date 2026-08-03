import { readFile, readdir, rm } from 'node:fs/promises'
import path from 'node:path'
import { captureSlide } from './capture-slide'

const SCREENSHOTS_DIR = 'screenshots'
const slideCaptureName = /^slide-(\d+)\.png$/

async function getRegisteredSlideCount() {
  const source = await readFile('src/slides.ts', 'utf8')
  return source.match(/file:\s*['"]/g)?.length ?? 0
}

async function removeStaleSlideCaptures(slideCount: number) {
  let captureNames: string[]

  try {
    captureNames = await readdir(SCREENSHOTS_DIR)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return
    }

    throw error
  }

  const staleCapturePaths = captureNames.flatMap((captureName) => {
    const match = slideCaptureName.exec(captureName)
    const slideNumber = Number.parseInt(match?.[1] ?? '', 10)

    return Number.isFinite(slideNumber) && slideNumber > slideCount
      ? [path.join(SCREENSHOTS_DIR, captureName)]
      : []
  })

  await Promise.all(staleCapturePaths.map((capturePath) => rm(capturePath)))

  if (staleCapturePaths.length > 0) {
    console.log(`Removed ${staleCapturePaths.length} stale slide capture(s).`)
  }
}

async function captureAllSlides() {
  const slideCount = await getRegisteredSlideCount()

  if (slideCount < 1) {
    console.error('No slides registered in src/slides.ts.')
    process.exitCode = 1
    return
  }

  for (let index = 0; index < slideCount; index += 1) {
    await captureSlide(index + 1)
  }

  await removeStaleSlideCaptures(slideCount)
}

captureAllSlides().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
