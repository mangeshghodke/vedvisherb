/**
 * Test environment setup.
 *
 * jsdom has no canvas, FileReader-driven image decode, or blob URLs, so we stub
 * the pieces the dashboard's upload path relies on.
 */
import { vi } from 'vitest'

process.env.VITE_SUPABASE_URL = 'https://test.supabase.co'
process.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key'

globalThis.IS_REACT_ACT_ENVIRONMENT = true

// Record canvas usage so tests can assert compression actually ran.
export const canvasCalls = { toDataURL: 0, quality: null, fillRect: 0, drawImage: 0 }
globalThis.__canvasCalls = canvasCalls

if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = () => ({
    set fillStyle(_v) {},
    get fillStyle() {
      return '#fff'
    },
    fillRect() {
      canvasCalls.fillRect++
    },
    drawImage() {
      canvasCalls.drawImage++
    },
  })
  HTMLCanvasElement.prototype.toDataURL = function (_type, quality) {
    canvasCalls.toDataURL++
    canvasCalls.quality = quality
    return 'data:image/jpeg;base64,' + 'A'.repeat(400)
  }
}

class FakeImage {
  set src(_v) {
    this.width = 1600
    this.height = 1200
    setTimeout(() => this.onload?.(), 0)
  }
  get src() {
    return ''
  }
}
globalThis.Image = FakeImage
if (typeof window !== 'undefined') window.Image = FakeImage

class FakeFileReader {
  readAsDataURL(blob) {
    this.result = `data:${blob.type};base64,${btoa(blob.content || 'x')}`
    setTimeout(() => this.onload?.(), 0)
  }
}
globalThis.FileReader = FakeFileReader
if (typeof window !== 'undefined') window.FileReader = FakeFileReader

if (typeof URL !== 'undefined') {
  URL.createObjectURL = vi.fn(() => 'blob:mock')
  URL.revokeObjectURL = vi.fn()
}

// DataTransfer is absent in jsdom; tests attach files via defineProperty instead.
if (typeof window !== 'undefined' && !window.DataTransfer) {
  window.DataTransfer = class {
    constructor() {
      this.items = { add() {} }
      this.files = []
    }
  }
}

window.confirm = vi.fn(() => true)