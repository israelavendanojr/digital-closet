import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TagChip from '../../../components/ui/TagChip'

describe('TagChip', () => {
  it('renders the label text', () => {
    render(<TagChip label="casual" />)
    expect(screen.getByText('casual')).toBeInTheDocument()
  })

  it('does not render a remove button when onRemove is not provided', () => {
    render(<TagChip label="casual" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('renders a remove button when onRemove is provided', () => {
    render(<TagChip label="casual" onRemove={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Remove casual' })).toBeInTheDocument()
  })

  it('calls onRemove when the remove button is clicked', async () => {
    const handleRemove = vi.fn()
    render(<TagChip label="casual" onRemove={handleRemove} />)
    await userEvent.click(screen.getByRole('button', { name: 'Remove casual' }))
    expect(handleRemove).toHaveBeenCalledOnce()
  })

  it('calls onClick when the chip span is clicked', async () => {
    const handleClick = vi.fn()
    render(<TagChip label="casual" onClick={handleClick} />)
    await userEvent.click(screen.getByText('casual'))
    expect(handleClick).toHaveBeenCalledOnce()
  })

  it('applies active styles when active is true', () => {
    render(<TagChip label="active-tag" active />)
    const chip = screen.getByText('active-tag').closest('span')
    expect(chip).toHaveClass('bg-text')
  })

  it('applies inactive styles when active is false', () => {
    render(<TagChip label="inactive-tag" active={false} />)
    const chip = screen.getByText('inactive-tag').closest('span')
    expect(chip).toHaveClass('bg-transparent')
  })
})
