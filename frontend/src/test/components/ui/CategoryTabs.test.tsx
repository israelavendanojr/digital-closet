import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CategoryTabs, { type Category } from '../../../components/ui/CategoryTabs'

const ALL_CATEGORIES: Category[] = ['All', 'Tops', 'Bottoms', 'Outerwear', 'Footwear', 'Headwear', 'Accessories']

describe('CategoryTabs', () => {
  it('renders all category buttons', () => {
    render(<CategoryTabs active="All" onChange={vi.fn()} />)
    for (const cat of ALL_CATEGORIES) {
      expect(screen.getByRole('button', { name: cat })).toBeInTheDocument()
    }
  })

  it('applies active styles to the active category', () => {
    render(<CategoryTabs active="Tops" onChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Tops' })).toHaveClass('text-text')
    expect(screen.getByRole('button', { name: 'All' })).toHaveClass('text-text-muted')
  })

  it('calls onChange with the clicked category', async () => {
    const handleChange = vi.fn()
    render(<CategoryTabs active="All" onChange={handleChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Bottoms' }))
    expect(handleChange).toHaveBeenCalledWith('Bottoms')
  })

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
