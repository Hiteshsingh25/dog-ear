/**
 * DOG-EAR — the box sequence (browser side).
 *
 * A printed mailer box tumbles into frame, settles, its lid swings open on three
 * hardcovers, and the camera pushes in until the white inside of the lid fills
 * the frame (the backdrop for the "made by readers" copy). 120 frames, scrubbed
 * by scroll. Also renders the closed-box product still. Exposed as window.SCENE.
 */
import * as THREE from 'three'
import {
  PALETTE, makeRenderer, makeEnvironment, setHorizontalFov, canvasTexture, blobPath, dotPattern,
  mulberry, lerp, seg, easeOutCubic, easeInOutCubic, easeOutBack, easeOutExpo, roundRect, drawMark,
} from './common.js'

const FRAME_COUNT = 120
const HFOV = 46

// box dimensions (scene units)
const W = 3.4
const D = 2.4
const H = 0.78
const T = 0.06

let renderer, scene, camera, box, lid, flap, shadow, bookGroup

/* ------------------------------------------------------------ textures */

function printTexture() {
  const c = document.createElement('canvas')
  c.width = 2048
  c.height = 1024
  const ctx = c.getContext('2d')
  const rnd = mulberry(1234)
  ctx.fillStyle = PALETTE.softPink
  ctx.fillRect(0, 0, c.width, c.height)

  // a few big flowing ribbons — bold shapes read at box scale
  const colors = [PALETTE.magenta, PALETTE.cyan, PALETTE.periwinkle, PALETTE.yellow, PALETTE.wine, PALETTE.orange, PALETTE.violet, PALETTE.teal]
  for (let k = 0; k < 5; k++) {
    const y = 40 + k * 230 + rnd() * 60
    ctx.strokeStyle = colors[k % colors.length]
    ctx.lineWidth = 170 + rnd() * 120
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(-200, y)
    ctx.bezierCurveTo(500, y - 320 + rnd() * 200, 900, y + 380 - rnd() * 200, 1400, y + rnd() * 120 - 60)
    ctx.bezierCurveTo(1700, y - 260 + rnd() * 100, 1900, y + 260, 2300, y)
    ctx.stroke()
  }
  // a handful of large blobs on top
  for (let k = 0; k < 5; k++) {
    ctx.fillStyle = colors[(k * 3 + 1) % colors.length]
    blobPath(ctx, 200 + rnd() * 1650, 150 + rnd() * 720, 220 + rnd() * 200, 160 + rnd() * 160, 7, 0.2, rnd)
    ctx.fill()
  }
  // one halftone ribbon
  ctx.strokeStyle = dotPattern(ctx, 'rgba(17,17,17,0.8)', 26, 7.5)
  ctx.lineWidth = 170
  ctx.beginPath()
  ctx.moveTo(-200, 820)
  ctx.bezierCurveTo(400, 420, 800, 1150, 1300, 640)
  ctx.bezierCurveTo(1600, 380, 1900, 900, 2300, 560)
  ctx.stroke()
  // a single big mark
  drawMark(ctx, 1560, 300, 220, PALETTE.black, '#fff')
  return canvasTexture(c)
}

/** Print material showing a window (repeat/offset) of the artwork so each face gets big shapes. */
function printMaterial(tex, rx, ry, ox, oy) {
  const map = tex.clone()
  map.repeat.set(rx, ry)
  map.offset.set(ox, oy)
  map.needsUpdate = true
  return new THREE.MeshStandardMaterial({ map, roughness: 0.78 })
}

function lidInsideTexture() {
  const c = document.createElement('canvas')
  c.width = 1536
  c.height = 1024
  const ctx = c.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, c.width, c.height)
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.strokeStyle = dotPattern(ctx, 'rgba(17,17,17,0.9)', 16, 4.6)
  ctx.lineWidth = 92
  const squiggle = (pts) => {
    ctx.beginPath()
    ctx.moveTo(pts[0][0], pts[0][1])
    for (let i = 1; i < pts.length - 2; i += 3) ctx.bezierCurveTo(pts[i][0], pts[i][1], pts[i + 1][0], pts[i + 1][1], pts[i + 2][0], pts[i + 2][1])
    ctx.stroke()
  }
  squiggle([[80, 700], [120, 200], [520, 120], [560, 420], [600, 720], [980, 760], [1040, 420]])
  squiggle([[1180, 60], [1220, 480], [1500, 380], [1560, 200]])
  squiggle([[300, 980], [420, 780], [900, 1080], [1100, 900], [1260, 760], [1500, 1000], [1600, 940]])
  // a soft "thank you" badge, tucked in a corner so the overlay copy owns the centre
  ctx.fillStyle = PALETTE.paleYellow
  ctx.beginPath()
  ctx.arc(1330, 190, 118, 0, Math.PI * 2)
  ctx.fill()
  drawMark(ctx, 1330, 172, 116, PALETTE.black, '#fff')
  ctx.fillStyle = PALETTE.black
  ctx.font = '700 34px Figtree, Arial, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('happy reading', 1330, 278)
  return canvasTexture(c)
}

function cardMaterial(color = PALETTE.card) {
  return new THREE.MeshStandardMaterial({ color, roughness: 0.95 })
}

function shadowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 512
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(256, 256, 40, 256, 256, 250)
  g.addColorStop(0, 'rgba(20,10,30,0.42)')
  g.addColorStop(1, 'rgba(20,10,30,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 512, 512)
  return canvasTexture(c, { srgb: false })
}

/* -------------------------------------------------------------- build */

function buildBox() {
  const print = printTexture()
  const inside = lidInsideTexture()
  // each face shows a different window of the artwork, at a scale where the shapes stay big
  const lidTopMat = printMaterial(print, 0.62, 0.86, 0.02, 0.07)
  const frontMat = printMaterial(print, 0.62, 0.2, 0.3, 0.02)
  const backMat = printMaterial(print, 0.62, 0.2, 0.05, 0.6)
  const leftMat = printMaterial(print, 0.44, 0.2, 0.5, 0.35)
  const rightMat = printMaterial(print, 0.44, 0.2, 0.0, 0.78)
  const bottomMat = printMaterial(print, 0.62, 0.86, 0.36, 0.1)
  const flapMat = printMaterial(print, 0.62, 0.16, 0.3, 0.22)
  const innerMat = new THREE.MeshStandardMaterial({ color: PALETTE.cyan, roughness: 0.85 })
  const insideLidMat = new THREE.MeshStandardMaterial({ map: inside, roughness: 0.82 })
  const whiteMat = new THREE.MeshStandardMaterial({ color: '#f6f2ee', roughness: 0.9 })
  const edge = cardMaterial()

  box = new THREE.Group()

  // base (top face cyan interior)
  const base = new THREE.Mesh(new THREE.BoxGeometry(W, T, D), [edge, edge, innerMat, bottomMat, edge, edge])
  base.position.y = T / 2
  box.add(base)

  // walls — outside print, inside cyan; cut edges cardboard
  const wallY = H / 2
  const front = new THREE.Mesh(new THREE.BoxGeometry(W, H, T), [edge, edge, edge, edge, frontMat, innerMat])
  front.position.set(0, wallY, D / 2 - T / 2)
  const back = new THREE.Mesh(new THREE.BoxGeometry(W, H, T), [edge, edge, edge, edge, innerMat, backMat])
  back.position.set(0, wallY, -D / 2 + T / 2)
  const left = new THREE.Mesh(new THREE.BoxGeometry(T, H, D - T * 2), [innerMat, leftMat, edge, edge, edge, edge])
  left.position.set(-W / 2 + T / 2, wallY, 0)
  const right = new THREE.Mesh(new THREE.BoxGeometry(T, H, D - T * 2), [rightMat, innerMat, edge, edge, edge, edge])
  right.position.set(W / 2 - T / 2, wallY, 0)
  box.add(front, back, left, right)

  // lid: pivot on the back-top edge
  lid = new THREE.Group()
  lid.position.set(0, H, -D / 2)
  const plate = new THREE.Mesh(new THREE.BoxGeometry(W, T, D), [edge, edge, lidTopMat, insideLidMat, edge, edge])
  plate.position.set(0, T / 2, D / 2)
  lid.add(plate)
  // front flap hinged on the lid's front edge, hangs down when closed
  flap = new THREE.Group()
  flap.position.set(0, 0, D)
  const flapH = 0.62
  const flapPlate = new THREE.Mesh(new THREE.BoxGeometry(W - T * 2.2, flapH, T), [edge, edge, edge, edge, flapMat, whiteMat])
  flapPlate.position.set(0, -flapH / 2, -T / 2 - T)
  flap.add(flapPlate)
  lid.add(flap)
  box.add(lid)

  // books inside — three flat hardcovers + bookmark + postcard
  bookGroup = new THREE.Group()
  const specs = [
    { x: -1.08, color: PALETTE.teal, band: PALETTE.paleBlue, rot: 0.04 },
    { x: 0.0, color: PALETTE.magenta, band: PALETTE.yellow, rot: -0.03 },
    { x: 1.08, color: PALETTE.yellow, band: PALETTE.violet, rot: 0.05 },
  ]
  for (const s of specs) {
    const cover = new THREE.MeshStandardMaterial({ color: s.color, roughness: 0.6 })
    const band = new THREE.MeshStandardMaterial({ color: s.band, roughness: 0.6 })
    const pages = new THREE.MeshStandardMaterial({ color: PALETTE.cream, roughness: 0.95 })
    const g = new THREE.Group()
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.98, 0.24, 1.5), [pages, band, cover, cover, pages, pages])
    g.add(body)
    // sticker on the top cover
    const st = document.createElement('canvas')
    st.width = st.height = 128
    const sx = st.getContext('2d')
    sx.clearRect(0, 0, 128, 128)
    drawMark(sx, 64, 64, 96, PALETTE.black, '#fff')
    const stickerMat = new THREE.MeshStandardMaterial({ map: canvasTexture(st), transparent: true, roughness: 0.6 })
    const sticker = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.22), stickerMat)
    sticker.rotation.x = -Math.PI / 2
    sticker.position.set(0.3, 0.121, -0.5)
    g.add(sticker)
    g.position.set(s.x, T + 0.12, 0)
    g.rotation.y = s.rot
    bookGroup.add(g)
  }
  // bookmark (orange strip) and postcard (white card)
  const bm = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.01, 0.9), new THREE.MeshStandardMaterial({ color: PALETTE.orange, roughness: 0.8 }))
  bm.position.set(-0.7, T + 0.25, 0.25)
  bm.rotation.y = 0.25
  const pc = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.01, 0.42), new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.85 }))
  pc.position.set(0.55, T + 0.25, 0.32)
  pc.rotation.y = -0.18
  bookGroup.add(bm, pc)
  box.add(bookGroup)

  // contact shadow
  shadow = new THREE.Mesh(new THREE.PlaneGeometry(W * 1.9, D * 2.2), new THREE.MeshBasicMaterial({ map: shadowTexture(), transparent: true, depthWrite: false }))
  shadow.rotation.x = -Math.PI / 2
  shadow.position.y = -0.02
  scene.add(shadow)

  scene.add(box)
}

/* ---------------------------------------------------------------- init */

function init(width, height) {
  renderer = makeRenderer(width, height)
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 100)
  setHorizontalFov(camera, HFOV, width / height)
  makeEnvironment(renderer, scene, 0.9)
  const key = new THREE.DirectionalLight(0xffffff, 1.7)
  key.position.set(-4, 9, 6)
  scene.add(key)
  const rim = new THREE.DirectionalLight(0xfff0e0, 0.6)
  rim.position.set(5, 4, -6)
  scene.add(rim)
  buildBox()
  renderFrame(0)
  window.__sceneReady = true
}

function setSize(width, height) {
  renderer.setSize(width, height)
  setHorizontalFov(camera, HFOV, width / height)
}

/* ---------------------------------------------------------- choreography */

const v = new THREE.Vector3()
function lerp3(a, b, t, out = v) {
  return out.set(lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t))
}

function pose(t) {
  // Phase A — tumble in and settle (0 → 0.32)
  const a = easeOutCubic(seg(t, 0, 0.32))
  const land = easeOutBack(seg(t, 0.04, 0.34), 1.1)
  box.rotation.set(lerp(0.42, 0, a), lerp(-1.48, -0.42, a), lerp(-0.28, 0, a))
  box.position.y = lerp(0.75, 0, land)
  const s = lerp(0.7, 1, a)
  box.scale.setScalar(s)
  shadow.material.opacity = lerp(0.2, 1, land)
  shadow.scale.setScalar(lerp(0.75, 1, land))

  // Phase B — lid + flap open (0.3 → 0.72)
  const open = easeInOutCubic(seg(t, 0.3, 0.72))
  lid.rotation.x = -open * 1.78 // ~102°, leans just past vertical
  const fl = easeOutExpo(seg(t, 0.42, 0.8))
  flap.rotation.x = -fl * 1.25
  // books lift a touch as the lid clears them
  bookGroup.position.y = easeOutBack(seg(t, 0.5, 0.75), 1.6) * 0.05

  // Phase C — square up and push into the lid interior (0.7 → 1)
  const push = easeInOutCubic(seg(t, 0.7, 1))
  box.rotation.y = lerp(box.rotation.y, -0.03, push)

  // camera
  const camA = [1.1, 3.3, 8.6], lookA = [0, 0.15, 0]
  const camB = [0.45, 2.5, 6.6], lookB = [0, 0.55, -0.2]
  // portrait (mobile tier) pushes in closer so the lid interior still fills the frame
  const portrait = camera.aspect < 1
  const camC = portrait ? [0.0, 1.75, 2.0] : [0.0, 1.3, 2.75]
  const lookC = portrait ? [0, 1.95, -1.45] : [0, 1.62, -1.45]
  const b = easeInOutCubic(seg(t, 0.28, 0.7))
  const posAB = lerp3(camA, camB, b, new THREE.Vector3())
  const lookAB = lerp3(lookA, lookB, b, new THREE.Vector3())
  const pos = posAB.lerp(new THREE.Vector3(...camC), push)
  const look = lookAB.lerp(new THREE.Vector3(...lookC), push)
  camera.position.copy(pos)
  camera.lookAt(look)
}

function renderFrame(i) {
  const t = Math.min(1, Math.max(0, i / (FRAME_COUNT - 1)))
  pose(t)
  renderer.render(scene, camera)
}

/** Closed box, floating at a 3/4 angle — the product still (alpha). */
function renderStill() {
  pose(0.33) // settled + closed (lid open starts after 0.3, negligible here)
  lid.rotation.x = 0
  flap.rotation.x = 0
  shadow.material.opacity = 0
  box.position.y = 0
  box.rotation.set(0.62, -0.72, 0.28)
  box.scale.setScalar(1)
  camera.position.set(0, 0.5, 5.7)
  camera.lookAt(0, 0.2, 0)
  renderer.render(scene, camera)
}

function exportFrame(quality = 0.82) {
  return renderer.domElement.toDataURL('image/webp', quality)
}

window.SCENE = { init, setSize, renderFrame, renderStill, export: exportFrame, FRAME_COUNT }
