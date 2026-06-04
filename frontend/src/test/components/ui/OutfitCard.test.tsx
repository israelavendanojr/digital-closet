import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import OutfitCard from '../../../components/ui/cards/OutfitCard'

describe('OutfitCard', () => {
  // The outfit name appears as text inside the card
  it('renders the outfit name', () => {
    render(<OutfitCard name="Summer Fit" />)
    expect(screen.getByText('Summer Fit')).toBeInTheDocument()
  })

  // With no items, all 4 grid slots show the "+" empty placeholder
  it('renders 4 empty slot placeholders when no items are given', () => {
    render(<OutfitCard name="Empty Fit" />)
    const plusSigns = screen.getAllByText('+')
    expect(plusSigns).toHaveLength(4)
  })

  // An item with imageUrl renders an <img> with the correct src and alt
  it('renders an image when an item has imageUrl', () => {
    const items = [{ label: 'Blue Jeans', imageUrl: 'https://example.com/jeans.jpg' }]
    render(<OutfitCard name="Fit" items={items} />)
    const img = screen.getByRole('img', { name: 'Blue Jeans' })
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://example.com/jeans.jpg')
  })

  // An item without imageUrl shows the first letter of its label as a placeholder
  it('renders a letter placeholder when an item has no imageUrl', () => {
    const items = [{ label: 'Jeans' }]
    render(<OutfitCard name="Fit" items={items} />)
    expect(screen.getByText('J')).toBeInTheDocument()
  })

  // Clicking the card fires the onClick handler once
  it('calls onClick when the card is clicked', async () => {
    const handleClick = vi.fn()
    render(<OutfitCard name="Summer Fit" onClick={handleClick} />)
    await userEvent.click(screen.getByRole('button', { name: /Summer Fit/ }))
    expect(handleClick).toHaveBeenCalledOnce()
  })

  // The edit button fires onEdit and does not bubble up to onClick
  it('edit button calls onEdit without triggering onClick', async () => {
    const handleClick = vi.fn()
    const handleEdit = vi.fn()
    render(<OutfitCard name="Summer Fit" onClick={handleClick} onEdit={handleEdit} />)
    await userEvent.click(screen.getByRole('button', { name: 'Edit outfit' }))
    expect(handleEdit).toHaveBeenCalledOnce()
    expect(handleClick).not.toHaveBeenCalled()
  })

  // The delete button fires onDelete and does not bubble up to onClick
  it('delete button calls onDelete without triggering onClick', async () => {
    const handleClick = vi.fn()
    const handleDelete = vi.fn()
    render(<OutfitCard name="Summer Fit" onClick={handleClick} onDelete={handleDelete} />)
    await userEvent.click(screen.getByRole('button', { name: 'Delete outfit' }))
    expect(handleDelete).toHaveBeenCalledOnce()
    expect(handleClick).not.toHaveBeenCalled()
  })
})
