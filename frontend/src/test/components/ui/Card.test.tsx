import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Card from '../../../components/ui/cards/Card'

describe('Card', () => {
  // Child content appears inside the rendered card
  it('renders children', () => {
    render(<Card>Hello card</Card>)
    expect(screen.getByText('Hello card')).toBeInTheDocument()
  })

  // Omitting the padding prop falls back to p-5 (medium)
  it('applies default md padding class', () => {
    const { container } = render(<Card>content</Card>)
    expect(container.firstChild).toHaveClass('p-5')
  })

  // padding="sm" applies p-3
  it('applies sm padding class', () => {
    const { container } = render(<Card padding="sm">content</Card>)
    expect(container.firstChild).toHaveClass('p-3')
  })

  // padding="none" applies p-0 (no padding)
  it('applies none padding class', () => {
    const { container } = render(<Card padding="none">content</Card>)
    expect(container.firstChild).toHaveClass('p-0')
  })

  // padding="lg" applies p-7
  it('applies lg padding class', () => {
    const { container } = render(<Card padding="lg">content</Card>)
    expect(container.firstChild).toHaveClass('p-7')
  })

  // Extra className is added alongside the built-in card classes
  it('merges extra className', () => {
    const { container } = render(<Card className="custom">content</Card>)
    expect(container.firstChild).toHaveClass('custom')
  })

  // Card always has background, rounded corners, and shadow regardless of props
  it('renders base card styles', () => {
    const { container } = render(<Card>content</Card>)
    expect(container.firstChild).toHaveClass('bg-bg-card', 'rounded', 'shadow-card')
  })
})
