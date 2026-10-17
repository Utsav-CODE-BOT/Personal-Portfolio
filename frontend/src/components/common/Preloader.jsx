import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

/**
 * CONFIGURATION SETTINGS
 * Edit word, colors, timings and dot matrix parameters here.
 */
export const CONFIG = {
  word: 'UTSAV',
  fontFamily: '"Russo One", "Black Ops One", "Arial Black", sans-serif',
  baseViewportWidth: 1825,
  baseDotPitch: 8,          // px at 1825px viewport width
  baseDotRadius: 2.5,       // px at 1825px viewport width
  baseTextHeight: 165,      // px text height at 1825px (~20 dot rows)
  letterSpacingRatio: 0.28, // letter spacing relative to font size
  sidePanel: {
    cols: 19,               // 19 columns
    rows: 9,                // 9 rows
    gap: 20,                // px gap between text block and side panel
    opacity: 0.12,          // 10-15% faint opacity for unlit LED look
    minViewportWidth: 640   // hidden on viewports below 640px
  },
  colors: {
    blue: '#00e5ff',        // Cyan/blue
    white: '#ffffff',       // White
    yellow: '#ffd600',      // Yellow
    bg: '#03050a'           // Dark near-black overlay background
  },
  timings: {
    wipeDuration: 0.5,      // s: column-by-column lighting up left-to-right
    blueHold: 0.5,          // s: hold blue after wipe completes (total blue ~1.0s)
    transition1: 0.1,       // s: cross-fade blue -> white
    whiteHold: 0.7,         // s: hold white
    transition2: 0.1,       // s: cross-fade white -> yellow
    yellowHold: 0.7,        // s: hold yellow
    dissolveDuration: 0.45, // s: dissolve / random scatter fade-out
    reducedMotionHold: 0.8, // s: static white hold when reduced motion is preferred
    reducedMotionFade: 0.35 // s: fade-out when reduced motion is preferred
  }
}

const SESSION_STORAGE_KEY = 'portfolio_preloader_seen'

export const hasSeenPreloader = () => {
  try {
    return typeof window !== 'undefined' && sessionStorage.getItem(SESSION_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

export const markPreloaderSeen = () => {
  try {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(SESSION_STORAGE_KEY, 'true')
    }
  } catch {
    // Ignore private browsing quota restrictions
  }
}

// Color interpolation helpers
function hexToRgb(hex) {
  const clean = hex.replace('#', '')
  const num = parseInt(clean, 16)
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  }
}

function interpolateColor(c1, c2, factor) {
  const rgb1 = hexToRgb(c1)
  const rgb2 = hexToRgb(c2)
  const f = Math.max(0, Math.min(1, factor))
  const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * f)
  const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * f)
  const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * f)
  return `rgb(${r}, ${g}, ${b})`
}

function rgbStringToRgba(colorStr, alpha) {
  const a = Math.max(0, Math.min(1, alpha))
  if (colorStr.startsWith('#')) {
    const { r, g, b } = hexToRgb(colorStr)
    return `rgba(${r}, ${g}, ${b}, ${a})`
  }
  return colorStr.replace('rgb(', 'rgba(').replace(')', `, ${a})`)
}

export const Preloader = ({ onComplete }) => {
  // If already seen in this session, do not render at all
  const [shouldRender, setShouldRender] = useState(() => !hasSeenPreloader())
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!shouldRender) return

    // 1. Lock body scrolling while preloader is visible
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    // 2. Check prefers-reduced-motion
    let isReducedMotion = false
    try {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
      isReducedMotion = mediaQuery.matches
    } catch {
      isReducedMotion = false
    }

    // 3. Track page and font readiness
    let isPageReady = typeof document !== 'undefined' && document.readyState === 'complete'
    const checkPageReadiness = async () => {
      try {
        if (document.fonts) {
          await document.fonts.ready
        }
      } catch {
        // Fallback if fonts API is unavailable
      }
      isPageReady = true
      if (typeof document !== 'undefined' && document.readyState !== 'complete') {
        const handleLoad = () => {
          isPageReady = true
        }
        window.addEventListener('load', handleLoad, { once: true })
      }
    }
    checkPageReadiness()

    const canvas = canvasRef.current
    if (!canvas) return
    let ctx = null
    try {
      ctx = canvas.getContext('2d')
    } catch {
      // jsdom fallback
    }
    if (!ctx) return

    let animFrameId = null
    let resizeTimer = null
    let litDots = []
    let sideDots = []
    let maxCol = 1
    let dotRadius = CONFIG.baseDotRadius
    let startTime = null

    // 4. Sample letters to LED grid
    const computeGrid = () => {
      const vw = window.innerWidth
      const vh = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      // Set canvas physical buffer size vs CSS display size
      canvas.width = Math.round(vw * dpr)
      canvas.height = Math.round(vh * dpr)
      canvas.style.width = `${vw}px`
      canvas.style.height = `${vh}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Calculate proportional scale
      let scale = vw / CONFIG.baseViewportWidth

      // Measure unscaled text width
      const measureCanvas = document.createElement('canvas')
      const measureCtx = measureCanvas.getContext('2d')
      measureCtx.font = `bold ${CONFIG.baseTextHeight}px ${CONFIG.fontFamily}`
      const chars = CONFIG.word.split('')
      const unscaledCharWidths = chars.map(c => measureCtx.measureText(c).width)
      const unscaledLetterSpacing = CONFIG.baseTextHeight * CONFIG.letterSpacingRatio
      const unscaledTotalWidth = unscaledCharWidths.reduce((a, b) => a + b, 0) + (chars.length - 1) * unscaledLetterSpacing

      // Max word width: 90% of viewport width on mobile, 70% on desktop
      const maxWordWidth = vw < CONFIG.sidePanel.minViewportWidth
        ? vw * 0.90
        : Math.min(vw * 0.70, unscaledTotalWidth * scale)

      if (unscaledTotalWidth * scale > maxWordWidth) {
        scale = maxWordWidth / unscaledTotalWidth
      }
      if (CONFIG.baseTextHeight * scale > vh * 0.40) {
        scale = (vh * 0.40) / CONFIG.baseTextHeight
      }

      const pitch = Math.max(2.5, CONFIG.baseDotPitch * scale)
      dotRadius = Math.max(0.8, pitch * (CONFIG.baseDotRadius / CONFIG.baseDotPitch))
      const textHeight = CONFIG.baseTextHeight * scale
      const fontSize = textHeight

      // Render to offscreen canvas
      const offCanvas = document.createElement('canvas')
      const offCtx = offCanvas.getContext('2d', { willReadFrequently: true })

      offCtx.font = `bold ${fontSize}px ${CONFIG.fontFamily}`
      const charWidths = chars.map(c => offCtx.measureText(c).width)
      const letterSpacing = fontSize * CONFIG.letterSpacingRatio
      const totalTextWidth = charWidths.reduce((a, b) => a + b, 0) + (chars.length - 1) * letterSpacing

      const pad = Math.ceil(pitch * 2)
      const offW = Math.ceil(totalTextWidth + pad * 2)
      const offH = Math.ceil(textHeight * 1.4 + pad * 2)
      offCanvas.width = offW
      offCanvas.height = offH

      offCtx.fillStyle = '#000000'
      offCtx.fillRect(0, 0, offW, offH)
      offCtx.font = `bold ${fontSize}px ${CONFIG.fontFamily}`
      offCtx.fillStyle = '#ffffff'
      offCtx.textBaseline = 'middle'

      let currX = pad
      const textCenterY = offH / 2
      for (let i = 0; i < chars.length; i++) {
        offCtx.fillText(chars[i], currX, textCenterY)
        currX += charWidths[i] + letterSpacing
      }

      // Sample pixels
      const imgData = offCtx.getImageData(0, 0, offW, offH)
      const pixels = imgData.data

      const wordLeft = (vw - totalTextWidth) / 2
      const wordTop = (vh - textHeight) / 2

      const cols = Math.floor(totalTextWidth / pitch) + 2
      const rows = Math.floor((textHeight * 1.3) / pitch) + 2

      const newLit = []
      let highestCol = 1

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const offX = Math.round(pad + c * pitch + pitch / 2)
          const offY = Math.round(pad + r * pitch + pitch / 2)
          if (offX < offW && offY < offH) {
            const idx = (offY * offW + offX) * 4
            // Sample red or alpha channel (text was drawn in white)
            if (pixels[idx] > 120) {
              const x = wordLeft + c * pitch + pitch / 2
              const y = wordTop + r * pitch + pitch / 2
              if (c > highestCol) highestCol = c
              newLit.push({
                x,
                y,
                origX: x,
                origY: y,
                col: c,
                vx: (Math.random() - 0.5) * 40,
                vy: (Math.random() - 0.5) * 40,
                scatterDelay: Math.random()
              })
            }
          }
        }
      }

      litDots = newLit
      maxCol = Math.max(1, highestCol)

      // Compute Side Panels (hidden below 640px)
      const newSideDots = []
      if (vw >= CONFIG.sidePanel.minViewportWidth) {
        const panelCols = CONFIG.sidePanel.cols
        const panelRows = CONFIG.sidePanel.rows
        const gap = CONFIG.sidePanel.gap * scale
        const panelWidth = panelCols * pitch
        const panelHeight = panelRows * pitch
        const panelTop = (vh / 2) - (panelHeight / 2)

        const leftPanelLeft = (wordLeft - gap) - panelWidth
        const rightPanelLeft = (wordLeft + totalTextWidth) + gap

        for (let r = 0; r < panelRows; r++) {
          for (let c = 0; c < panelCols; c++) {
            newSideDots.push({
              x: leftPanelLeft + c * pitch + pitch / 2,
              y: panelTop + r * pitch + pitch / 2
            })
            newSideDots.push({
              x: rightPanelLeft + c * pitch + pitch / 2,
              y: panelTop + r * pitch + pitch / 2
            })
          }
        }
      }

      sideDots = newSideDots
    }

    computeGrid()

    // Resample on window resize (debounced)
    const handleResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        computeGrid()
      }, 100)
    }
    window.addEventListener('resize', handleResize)

    // Re-sample when fonts finish loading if necessary
    if (document.fonts) {
      document.fonts.ready.then(() => {
        computeGrid()
      }).catch(() => {})
    }

    // 5. Animation Render Loop
    const { timings, colors } = CONFIG
    const tWipeEnd = timings.wipeDuration
    const tBlueEnd = tWipeEnd + timings.blueHold
    const tTrans1End = tBlueEnd + timings.transition1
    const tWhiteEnd = tTrans1End + timings.whiteHold
    const tTrans2End = tWhiteEnd + timings.transition2
    const tYellowEnd = tTrans2End + timings.yellowHold
    const tDissolveEnd = tYellowEnd + timings.dissolveDuration

    const tReducedHold = timings.reducedMotionHold
    const tReducedEnd = tReducedHold + timings.reducedMotionFade

    const render = (timestamp) => {
      if (startTime === null) startTime = timestamp
      const elapsed = (timestamp - startTime) / 1000

      const vw = window.innerWidth
      const vh = window.innerHeight

      let currentColor = colors.blue
      let alpha = 1
      let wipeProgress = 1
      let sequenceFinished = false

      if (isReducedMotion) {
        // Reduced Motion Mode: Static white, hold, then fade out
        currentColor = colors.white
        wipeProgress = 1
        if (elapsed < tReducedHold) {
          alpha = 1
        } else if (elapsed < tReducedEnd) {
          alpha = 1 - (elapsed - tReducedHold) / timings.reducedMotionFade
        } else {
          alpha = 0
          sequenceFinished = true
        }
      } else {
        // Normal Sequence:
        // Wipe phase (0 -> tWipeEnd)
        if (elapsed < tWipeEnd) {
          wipeProgress = Math.min(1, elapsed / tWipeEnd)
          currentColor = colors.blue
        } else if (elapsed < tBlueEnd) {
          // Blue hold
          wipeProgress = 1
          currentColor = colors.blue
        } else if (elapsed < tTrans1End) {
          // Cross-fade Blue -> White
          wipeProgress = 1
          const factor = (elapsed - tBlueEnd) / timings.transition1
          currentColor = interpolateColor(colors.blue, colors.white, factor)
        } else if (elapsed < tWhiteEnd) {
          // White hold
          wipeProgress = 1
          currentColor = colors.white
        } else if (elapsed < tTrans2End) {
          // Cross-fade White -> Yellow
          wipeProgress = 1
          const factor = (elapsed - tWhiteEnd) / timings.transition2
          currentColor = interpolateColor(colors.white, colors.yellow, factor)
        } else if (elapsed < tYellowEnd) {
          // Yellow hold
          wipeProgress = 1
          currentColor = colors.yellow
        } else if (elapsed < tDissolveEnd) {
          // Dissolve / Random Scatter Fade-Out
          wipeProgress = 1
          currentColor = colors.yellow
          const exitProgress = (elapsed - tYellowEnd) / timings.dissolveDuration
          alpha = Math.max(0, 1 - exitProgress)

          // Scatter dots
          for (let i = 0; i < litDots.length; i++) {
            const dot = litDots[i]
            if (exitProgress > dot.scatterDelay * 0.3) {
              const p = (exitProgress - dot.scatterDelay * 0.3) / (1 - dot.scatterDelay * 0.3)
              dot.x = dot.origX + dot.vx * p * 12
              dot.y = dot.origY + dot.vy * p * 12
            }
          }
        } else {
          // Sequence completed
          alpha = 0
          sequenceFinished = true
        }
      }

      // Clear full canvas with overlay background
      ctx.fillStyle = colors.bg
      ctx.fillRect(0, 0, vw, vh)

      // Draw faint side panel dots (LED module outline look)
      if (sideDots.length > 0 && alpha > 0) {
        ctx.fillStyle = rgbStringToRgba(currentColor, CONFIG.sidePanel.opacity * alpha)
        ctx.beginPath()
        for (let i = 0; i < sideDots.length; i++) {
          const dot = sideDots[i]
          ctx.moveTo(dot.x + dotRadius, dot.y)
          ctx.arc(dot.x, dot.y, dotRadius, 0, Math.PI * 2)
        }
        ctx.fill()
      }

      // Draw active lit dots forming "UTSAV"
      if (litDots.length > 0 && alpha > 0) {
        ctx.fillStyle = rgbStringToRgba(currentColor, alpha)
        ctx.beginPath()
        for (let i = 0; i < litDots.length; i++) {
          const dot = litDots[i]
          if (isReducedMotion || (dot.col / maxCol) <= wipeProgress) {
            ctx.moveTo(dot.x + dotRadius, dot.y)
            ctx.arc(dot.x, dot.y, dotRadius, 0, Math.PI * 2)
          }
        }
        ctx.fill()
      }

      // Exit condition: sequence has finished AND page is ready
      if (sequenceFinished && isPageReady) {
        markPreloaderSeen()
        setShouldRender(false)
        if (onComplete) onComplete()
        return
      }

      // If sequence finished but page not yet ready (e.g. slow 3G), hold at end until ready
      animFrameId = requestAnimationFrame(render)
    }

    animFrameId = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(animFrameId)
      clearTimeout(resizeTimer)
      window.removeEventListener('resize', handleResize)
      document.body.style.overflow = prevOverflow
    }
  }, [shouldRender, onComplete])

  if (!shouldRender) return null

  return (
    <div
      className="fixed inset-0 z-[9999] bg-[#03050a] flex items-center justify-center overflow-hidden pointer-events-auto"
      role="presentation"
    >
      {/* Visually hidden screen reader status */}
      <div className="sr-only" role="status" aria-live="polite">
        Loading Utsav&apos;s portfolio
      </div>

      {/* LED Dot-Matrix Canvas */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="block w-full h-full"
      />
    </div>
  )
}

Preloader.propTypes = {
  onComplete: PropTypes.func
}
