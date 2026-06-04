import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '../../../components/ui/Button'

describe('Button', () => {
  // The button is present in the DOM with the correct label text
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  // The onClick handler fires exactly once after a user click
  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Submit</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledOnce()
  })

  // Clicking a disabled button never invokes the handler
  it('does not call onClick when disabled', async () => {
    const handleClick = vi.fn()
    render(<Button disabled onClick={handleClick}>Disabled</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  // Default variant applies the clay background class
  it('applies the primary variant class by default', () => {
    render(<Button>Primary</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-clay')
  })

  // Ghost variant applies the soft background class
  it('applies the ghost variant class', () => {
    render(<Button variant="ghost">Ghost</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-bg-soft')
  })

  // Small size applies the 14px text class
  it('applies the sm size class', () => {
    render(<Button size="sm">Small</Button>)
    expect(screen.getByRole('button')).toHaveClass('text-[14px]')
  })

  // Large size applies the wider horizontal padding class
  it('applies the lg size class', () => {
    render(<Button size="lg">Large</Button>)
    expect(screen.getByRole('button')).toHaveClass('px-[26px]')
  })

  // Custom className is merged alongside built-in classes
  it('merges extra className', () => {
    render(<Button className="extra-class">Styled</Button>)
    expect(screen.getByRole('button')).toHaveClass('extra-class')
  })

  // Extra HTML attributes like type are passed through to the element
  it('forwards additional HTML attributes', () => {
    render(<Button type="submit">Save</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })
})
