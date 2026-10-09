/**
 * resolveImage() must handle every image form that can exist in the database:
 * a Supabase Storage URL, a legacy filename served from /images, and an
 * inline data URL from rows created before Storage existed.
 */
import { describe, it, expect } from 'vitest'

process.env.VITE_SUPABASE_URL = 'https://test.supabase.co'
process.env.VITE_SUPABASE_ANON_KEY = 'test-key'

const { resolveImage, isStorageUrl, BUCKET } = await import('../src/data/supabase.js')

const STORAGE = `https://test.supabase.co/storage/v1/object/public/${BUCKET}/products/17-soap.jpg`

describe('resolveImage', () => {
  it('passes Storage URLs through untouched', () => {
    expect(resolveImage(STORAGE)).toBe(STORAGE)
  })

  it('resolves a legacy filename against the site images path', () => {
    // BASE_URL is '/' under Vitest but '/vedvisherb/' in a real build, so assert
    // the shape rather than a hardcoded deploy path.
    const out = resolveImage('IMG-20260713-WA0009.jpg')
    expect(out).toMatch(/\/images\/IMG-20260713-WA0009\.jpg$/)
    expect(out.startsWith('http')).toBe(false)
    expect(out.startsWith('data:')).toBe(false)
  })

  it('passes inline data URLs through', () => {
    const d = 'data:image/jpeg;base64,AAAA'
    expect(resolveImage(d)).toBe(d)
  })

  it('returns empty string for a missing image', () => {
    expect(resolveImage('')).toBe('')
    expect(resolveImage(null)).toBe('')
    expect(resolveImage(undefined)).toBe('')
  })
})

describe('isStorageUrl', () => {
  it('recognises our bucket', () => {
    expect(isStorageUrl(STORAGE)).toBe(true)
  })

  it('rejects legacy filenames and foreign URLs', () => {
    expect(isStorageUrl('IMG-20260713-WA0009.jpg')).toBe(false)
    expect(isStorageUrl('data:image/jpeg;base64,AAAA')).toBe(false)
    expect(isStorageUrl('https://example.com/photo.jpg')).toBe(false)
    expect(isStorageUrl(null)).toBe(false)
  })
})