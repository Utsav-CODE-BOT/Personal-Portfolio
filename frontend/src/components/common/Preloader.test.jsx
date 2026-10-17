import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { Preloader, CONFIG, hasSeenPreloader, markPreloaderSeen } from './Preloader'

describe('Preloader Component', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.restoreAllMocks()

    // Mock HTMLCanvasElement.getContext
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue({
      setTransform: vi.fn(),
      fillRect: vi.fn(),
      fillText: vi.fn(),
      measureText: vi.fn().mockReturnValue({ width: 50 }),
      getImageData: vi.fn().mockReturnValue({
        data: new Uint8ClampedArray(400 * 400 * 4).fill(255)
      }),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn()
    })
  })

  afterEach(() => {
    sessionStorage.clear()
    document.body.style.overflow = ''
  })

  it('exposes a configurable CONFIG object with word, colors, timings and pitch', () => {
    expect(CONFIG.word).toBe('UTSAV')
    expect(CONFIG.colors.blue).toBe('#00e5ff')
    expect(CONFIG.colors.white).toBe('#ffffff')
    expect(CONFIG.colors.yellow).toBe('#ffd600')
    expect(CONFIG.colors.bg).toBe('#03050a')
    expect(CONFIG.baseDotPitch).toBe(8)
    expect(CONFIG.baseDotRadius).toBe(2.5)
    expect(CONFIG.baseTextHeight).toBe(165)
    expect(CONFIG.sidePanel.cols).toBe(19)
    expect(CONFIG.sidePanel.rows).toBe(9)
  })

  it('renders the preloader with accessible loading status on first session load', () => {
    render(<Preloader />)
    const status = screen.getByRole('status')
    expect(status).toBeInTheDocument()
    expect(status).toHaveTextContent("Loading Utsav's portfolio")
  })

  it('locks body scroll while visible and restores it on unmount', () => {
    document.body.style.overflow = 'auto'
    const { unmount } = render(<Preloader />)
    expect(document.body.style.overflow).toBe('hidden')
    unmount()
    expect(document.body.style.overflow).toBe('auto')
  })

  it('does NOT render when sessionStorage marks preloader as already seen', () => {
    sessionStorage.setItem('portfolio_preloader_seen', 'true')
    render(<Preloader />)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  it('correctly reports hasSeenPreloader and markPreloaderSeen', () => {
    expect(hasSeenPreloader()).toBe(false)
    markPreloaderSeen()
    expect(hasSeenPreloader()).toBe(true)
  })

  it('handles reduced-motion media query preference', () => {
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }))

    render(<Preloader />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('handles mobile viewport width (375px) without crashing', () => {
    window.innerWidth = 375
    window.innerHeight = 667

    render(<Preloader />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('triggers onComplete when animation sequence and page readiness complete', () => {
    const onComplete = vi.fn()
    let rafCallback = null
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      rafCallback = cb
      return 1
    })

    render(<Preloader onComplete={onComplete} />)

    // Simulate page ready via load event
    window.dispatchEvent(new Event('load'))

    // Advance animation time past exit duration
    act(() => {
      if (rafCallback) {
        rafCallback(0)
      }
    })
    act(() => {
      if (rafCallback) {
        rafCallback(3600)
      }
    })

    expect(onComplete).toHaveBeenCalled()
    expect(hasSeenPreloader()).toBe(true)
  })
})
