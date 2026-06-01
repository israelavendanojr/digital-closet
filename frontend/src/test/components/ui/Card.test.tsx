import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Card from '../../../components/ui/Card'

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Hello card</Card>)
    expect(screen.getByText('Hello card')).toBeInTheDocument()
  })

  it('applies default md padding class', () => {
    const { container } = render(<Card>content</Card>)
    expect(container.firstChild).toHaveClass('p-5')
  })

  it('applies sm padding class', () => {
    const { container } = render(<Card padding="sm">content</Card>)
    expect(container.firstChild).toHaveClass('p-3')
  })

  it('applies none padding class', () => {
    const { container } = render(<Card padding="none">content</Card>)
    expect(container.firstChild).toHaveClass('p-0')
  })

  it('applies lg padding class', () => {
    const { container } = render(<Card padding="lg">content</Card>)
    expect(container.firstChild).toHaveClass('p-7')
  })

  it('merges extra className', () => {
    const { container } = render(<Card className="custom">content</Card>)
    expect(container.firstChild).toHaveClass('custom')
  })

  it('renders base card styles', () => {
    const { container } = render(<Card>content</Card>)
    expect(container.firstChild).toHaveClass('bg-bg-card', 'rounded', 'shadow-card')
  })
})
