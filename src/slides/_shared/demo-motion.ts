import type { Transition, Variants } from 'framer-motion'

type DemoMotion = {
  card: Variants
  fade: Variants
  fromLeft: Variants
  fromRight: Variants
  root: Variants
  rise: Variants
}

const noMotionTransition: Transition = { duration: 0 }
const childTransition: Transition = { duration: 0.42, ease: 'easeOut' }

export const getDemoMotion = (reduceMotion: boolean): DemoMotion => {
  const hiddenOpacity = reduceMotion ? 1 : 0
  const rootTransition: Transition = reduceMotion
    ? noMotionTransition
    : {
        duration: 0.18,
        ease: 'easeOut',
        staggerChildren: 0.07,
        when: 'beforeChildren',
      }

  return {
    root: {
      hidden: { opacity: hiddenOpacity },
      show: { opacity: 1, transition: rootTransition },
    },
    fade: {
      hidden: { opacity: hiddenOpacity },
      show: {
        opacity: 1,
        transition: reduceMotion ? noMotionTransition : childTransition,
      },
    },
    rise: {
      hidden: { opacity: hiddenOpacity, y: reduceMotion ? 0 : 28 },
      show: {
        opacity: 1,
        transition: reduceMotion ? noMotionTransition : childTransition,
        y: 0,
      },
    },
    card: {
      hidden: {
        opacity: hiddenOpacity,
        scale: reduceMotion ? 1 : 0.985,
        y: reduceMotion ? 0 : 24,
      },
      show: {
        opacity: 1,
        scale: 1,
        transition: reduceMotion ? noMotionTransition : childTransition,
        y: 0,
      },
    },
    fromLeft: {
      hidden: { opacity: hiddenOpacity, x: reduceMotion ? 0 : -32 },
      show: {
        opacity: 1,
        transition: reduceMotion ? noMotionTransition : childTransition,
        x: 0,
      },
    },
    fromRight: {
      hidden: { opacity: hiddenOpacity, x: reduceMotion ? 0 : 32 },
      show: {
        opacity: 1,
        transition: reduceMotion ? noMotionTransition : childTransition,
        x: 0,
      },
    },
  }
}
