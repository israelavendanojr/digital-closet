import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CategoryTabs, { type Category } from '../../../components/ui/CategoryTabs'

const ALL_CATEGORIES: Category[] = ['All', 'Tops', 'Bottoms', 'Outerwear', 'Footwear', 'Headwear', 'Accessories']

describe('CategoryTabs', () => {
  // All 7 category buttons are present in the DOM
  it('renders all category buttons', () => {
    render(<CategoryTabs active="All" onChange={vi.fn()} />)
    for (const cat of ALL_CATEGORIES) {
      expect(screen.getByRole('button', { name: cat })).toBeInTheDocument()
    }
  })

  // Active tab gets text-ink class; inactive tabs get text-ink-soft
  it('applies active styles to the active category', () => {
    render(<CategoryTabs active="Tops" onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Tops' })).toHaveClass('text-ink')
    expect(screen.getByRole('button', { name: 'All' })).toHaveClass('text-ink-soft')
  })

  // Clicking a tab calls onChange with that category's name
  it('calls onChange with the clicked category', async () => {
    const handleChange = vi.fn()
    render(<CategoryTabs active="All" onChange={handleChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Bottoms' }))
    expect(handleChange).toHaveBeenCalledWith('Bottoms')
  })

  // Each of the 7 tabs fires onChange with its own correct category value
  it('calls onChange with correct category for each tab', async () => {
    const handleChange = vi.fn()
    render(<CategoryTabs active="All" onChange={handleChange} />)
    for (const cat of ALL_CATEGORIES) {
      await userEvent.click(screen.getByRole('button', { name: cat }))
      expect(handleChange).toHaveBeenCalledWith(cat)
    }
    expect(handleChange).toHaveBeenCalledTimes(ALL_CATEGORIES.length)
  })
})
