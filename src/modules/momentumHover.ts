import { gsap } from '@/lib/gsap'
import { defineModule } from './types'

/**
 * Cursor-velocity throw: entering a chip hands it the pointer's velocity as an
 * InertiaPlugin tween. Torque is the cross product of the entry offset and the
 * velocity, normalised by lever length; `end: 0` so it always settles home.
 */
export const momentumHover = defineModule({
  name: 'momentum-hover',
  selector: '[data-momentum-hover]',
  init(root, ctx) {
    if (ctx.reducedMotion) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const xyMultiplier = 25
    const rotationMultiplier = 15
    const inertiaResistance = 160
    const clampXY = gsap.utils.clamp(-1080, 1080)
    const clampRot = gsap.utils.clamp(-60, 60)

    let prevX = 0
    let prevY = 0
    let velX = 0
    let velY = 0
    let rafId: number | null = null
    const onMove = (e: MouseEvent) => {
      if (rafId) return
      rafId = requestAnimationFrame(() => {
        velX = e.clientX - prevX
        velY = e.clientY - prevY
        prevX = e.clientX
        prevY = e.clientY
        rafId = null
      })
    }
    root.addEventListener('mousemove', onMove)

    const cleanups: Array<() => void> = []
    root.querySelectorAll<HTMLElement>('[data-momentum-hover-element]').forEach((el) => {
      const target = el.querySelector<HTMLElement>('[data-momentum-hover-target]')
      if (!target) return
      const onEnter = (e: MouseEvent) => {
        const { left, top, width, height } = target.getBoundingClientRect()
        const offsetX = e.clientX - (left + width / 2)
        const offsetY = e.clientY - (top + height / 2)
        const rawTorque = offsetX * velY - offsetY * velX
        const leverDist = Math.hypot(offsetX, offsetY) || 1
        const angularForce = rawTorque / leverDist
        gsap.to(target, {
          inertia: {
            x: { velocity: clampXY(velX * xyMultiplier), end: 0 },
            y: { velocity: clampXY(velY * xyMultiplier), end: 0 },
            rotation: { velocity: clampRot(angularForce * rotationMultiplier), end: 0 },
            resistance: inertiaResistance,
          },
        })
      }
      el.addEventListener('mouseenter', onEnter)
      cleanups.push(() => {
        el.removeEventListener('mouseenter', onEnter)
        gsap.killTweensOf(target)
      })
    })
    return () => {
      root.removeEventListener('mousemove', onMove)
      if (rafId) cancelAnimationFrame(rafId)
      cleanups.forEach((fn) => fn())
    }
  },
})
