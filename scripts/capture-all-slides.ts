import { captureSlide } from './capture-slide'
import { readFile } from 'node:fs/promises'

async function getRegisteredSlideCount() {
  const source = await readFile('src/slides.ts', 'utf8')
  return source.match(/file:\s*['"]/g)?.length ?? 0
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
}

captureAllSlides().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
