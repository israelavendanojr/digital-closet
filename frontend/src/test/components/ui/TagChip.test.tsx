import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TagChip from '../../../components/ui/inputs/TagChip'

describe('TagChip', () => {
  // The label string is visible in the DOM
  it('renders the label text', () => {
    render(<TagChip label="casual" />)
    expect(screen.getByText('casual')).toBeInTheDocument()
  })

  // No remove button is rendered when onRemove is not supplied
  it('does not render a remove button when onRemove is not provided', () => {
    render(<TagChip label="casual" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  // An accessible "×" button appears when onRemove is provided
  it('renders a remove button when onRemove is provided', () => {
    render(<TagChip label="casual" onRemove={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Remove casual' })).toBeInTheDocument()
  })

  // Clicking the remove button calls onRemove exactly once
  it('calls onRemove when the remove button is clicked', async () => {
    const handleRemove = vi.fn()
    render(<TagChip label="casual" onRemove={handleRemove} />)
    await userEvent.click(screen.getByRole('button', { name: 'Remove casual' }))
    expect(handleRemove).toHaveBeenCalledOnce()
  })

  // Clicking anywhere on the chip span fires the onClick handler
  it('calls onClick when the chip span is clicked', async () => {
    const handleClick = vi.fn()
    render(<TagChip label="casual" onClick={handleClick} />)
    await userEvent.click(screen.getByText('casual'))
    expect(handleClick).toHaveBeenCalledOnce()
  })

  // Active chip gets the clay background class
  it('applies active styles when active is true', () => {
    render(<TagChip label="active-tag" active />)
    const chip = screen.getByText('active-tag').closest('span')
    expect(chip).toHaveClass('bg-clay')
  })

  // Inactive chip gets the soft background class
  it('applies inactive styles when active is false', () => {
    render(<TagChip label="inactive-tag" active={false} />)
    const chip = screen.getByText('inactive-tag').closest('span')
    expect(chip).toHaveClass('bg-bg-soft')
  })
})
