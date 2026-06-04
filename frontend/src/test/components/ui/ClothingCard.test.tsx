import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ClothingCard from '../../../components/ui/cards/ClothingCard'

describe('ClothingCard', () => {
  // The item name appears as text inside the card
  it('renders the label', () => {
    render(<ClothingCard label="Blue Jeans" />)
    expect(screen.getByText('Blue Jeans')).toBeInTheDocument()
  })

  // When imageUrl is given, an <img> is rendered with the correct src and alt
  it('renders an image when imageUrl is provided', () => {
    render(<ClothingCard label="Blue Jeans" imageUrl="https://example.com/jeans.jpg" />)
    const img = screen.getByRole('img', { name: 'Blue Jeans' })
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://example.com/jeans.jpg')
  })

  // Without imageUrl, no <img> is shown and the "+" placeholder text appears
  it('renders the placeholder when no imageUrl is provided', () => {
    render(<ClothingCard label="Blue Jeans" />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getByText('+')).toBeInTheDocument()
  })

  // Clicking anywhere on the card fires the onClick handler once
  it('calls onClick when the card is clicked', async () => {
    const handleClick = vi.fn()
    render(<ClothingCard label="Blue Jeans" onClick={handleClick} />)
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledOnce()
  })

  // The card root element is a <button> for keyboard accessibility
  it('renders as a button element', () => {
    render(<ClothingCard label="Blue Jeans" />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
