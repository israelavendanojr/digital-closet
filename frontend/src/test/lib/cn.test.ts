import { describe, it, expect } from 'vitest'
import { cn } from '../../lib/cn'

describe('cn', () => {
  // Joins multiple class strings into a single space-separated string
  it('joins class strings', () => {
    expect(cn('a', 'b', 'c')).toBe('a b c')
  })

  // Strips out false, null, and undefined — only truthy strings appear in output
  it('filters out falsy values', () => {
    expect(cn('a', false, null, undefined, 'b')).toBe('a b')
  })

  // Returns an empty string when every argument is falsy
  it('returns empty string when all values are falsy', () => {
    expect(cn(false, null, undefined)).toBe('')
  })

  // Returns the single class unchanged with no extra spaces
  it('handles a single class', () => {
    expect(cn('only')).toBe('only')
  })

  // Returns an empty string when called with no arguments
  it('handles empty call', () => {
    expect(cn()).toBe('')
  })
})
