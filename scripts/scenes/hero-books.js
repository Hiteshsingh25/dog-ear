/**
 * DOG-EAR — hero sequence (browser side).
 *
 * Three floating hardcovers drifting on a seamless 120-frame loop (24 fps = 5 s).
 * Rendered to alpha WebP by scripts/render-sequences.mjs; the yellow hero and its
 * blob background show through. Exposed as window.SCENE.
 */
import * as THREE from 'three'
import { PALETTE, makeRenderer, makeEnvironment, setHorizontalFov, makeBook } from './common.js'

const FRAME_COUNT = 120
const HFOV = 42

let renderer, scene, camera
const books = []

const SPECS = [
  // top-left, cut by the frame edge, strongly tilted
  { pos: [-2.4, 3.9, 0.4], rot: [-0.32, 0.38, 0.62], jacket: { main: PALETTE.teal, band: PALETTE.paleBlue }, phase: 0.0, seed: 3 },
  // right, hero book with sticker (sits left of the handwritten note)
  { pos: [2.35, 0.35, 0.0], rot: [-0.22, -0.34, -0.16], jacket: { main: PALETTE.navy, band: PALETTE.palePink, sticker: { ink: PALETTE.magenta, paper: '#fff' } }, phase: 0.33, seed: 7 },
  // bottom-left, cut by the frame edge
  { pos: [-1.35, -3.45, 0.25], rot: [-0.28, 0.22, 0.58], jacket: { main: PALETTE.red, band: PALETTE.orange, sticker: { ink: PALETTE.wine, paper: '#fff' } }, phase: 0.66, seed: 11 },
]

function init(width, height) {
  renderer = makeRenderer(width, height)
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 100)
  setHorizontalFov(camera, HFOV, width / height)
  camera.position.set(0, 0, 14)
  camera.lookAt(0, 0, 0)
  makeEnvironment(renderer, scene, 0.85)

  const key = new THREE.DirectionalLight(0xffffff, 1.6)
  key.position.set(-6, 9, 8)
  scene.add(key)
  const fill = new THREE.DirectionalLight(0xfff1d6, 0.5)
  fill.position.set(7, -3, 6)
  scene.add(fill)

  for (const s of SPECS) {
    const b = makeBook({ jacket: s.jacket, seed: s.seed })
    b.position.set(...s.pos)
    b.rotation.set(...s.rot)
    scene.add(b)
    books.push({ mesh: b, spec: s })
  }
  window.__sceneReady = true
}

function setSize(width, height) {
  renderer.setSize(width, height)
  setHorizontalFov(camera, HFOV, width / height)
}

function renderFrame(i) {
  const t = (i % FRAME_COUNT) / FRAME_COUNT // 0..1, loop-safe
  const TAU = Math.PI * 2
  for (const { mesh, spec } of books) {
    const p = spec.phase * TAU
    mesh.position.set(
      spec.pos[0] + Math.sin(t * TAU + p + 1.2) * 0.06,
      spec.pos[1] + Math.sin(t * TAU + p) * 0.16,
      spec.pos[2] + Math.cos(t * TAU + p) * 0.1,
    )
    mesh.rotation.set(
      spec.rot[0] + Math.sin(t * TAU + p + 0.7) * 0.05,
      spec.rot[1] + Math.sin(t * TAU + p + 2.1) * 0.07,
      spec.rot[2] + Math.sin(t * TAU + p) * 0.035,
    )
  }
  renderer.render(scene, camera)
}

function exportFrame(quality = 0.82) {
  return renderer.domElement.toDataURL('image/webp', quality)
}

window.SCENE = { init, setSize, renderFrame, export: exportFrame, FRAME_COUNT }
