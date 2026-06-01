import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TagInput from '../../../components/ui/TagInput'

describe('TagInput', () => {
  it('renders existing tags', () => {
    render(<TagInput tags={['red', 'casual']} onChange={vi.fn()} />)
    expect(screen.getByText('red')).toBeInTheDocument()
    expect(screen.getByText('casual')).toBeInTheDocument()
  })

  it('renders the text input', () => {
    render(<TagInput tags={[]} onChange={vi.fn()} />)
    expect(screen.getByPlaceholderText('Add your own...')).toBeInTheDocument()
  })

  it('renders a custom placeholder', () => {
    render(<TagInput tags={[]} onChange={vi.fn()} placeholder="Type a tag" />)
    expect(screen.getByPlaceholderText('Type a tag')).toBeInTheDocument()
  })

  it('adds a tag on Enter key', async () => {
    const handleChange = vi.fn()
    render(<TagInput tags={[]} onChange={handleChange} />)
    const input = screen.getByPlaceholderText('Add your own...')
    await userEvent.type(input, 'denim{Enter}')
    expect(handleChange).toHaveBeenCalledWith(['denim'])
  })

  it('adds a tag on comma key', async () => {
    const handleChange = vi.fn()
    render(<TagInput tags={[]} onChange={handleChange} />)
    const input = screen.getByPlaceholderText('Add your own...')
    await userEvent.type(input, 'vintage,')
    expect(handleChange).toHaveBeenCalledWith(['vintage'])
  })

  it('lowercases and trims the tag before adding', async () => {
    const handleChange = vi.fn()
    render(<TagInput tags={[]} onChange={handleChange} />)
    const input = screen.getByPlaceholderText('Add your own...')
    await userEvent.type(input, '  DENIM  {Enter}')
    expect(handleChange).toHaveBeenCalledWith(['denim'])
  })

  it('does not add a duplicate tag', async () => {
    const handleChange = vi.fn()
    render(<TagInput tags={['denim']} onChange={handleChange} />)
    const input = screen.getByPlaceholderText('Add your own...')
    await userEvent.type(input, 'denim{Enter}')
    expect(handleChange).not.toHaveBeenCalled()
  })

  it('calls onChange without the removed tag when remove is clicked', async () => {
    const handleChange = vi.fn()
    render(<TagInput tags={['red', 'blue']} onChange={handleChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Remove red' }))
    expect(handleChange).toHaveBeenCalledWith(['blue'])
  })

  it('shows unused suggestions', () => {
    render(<TagInput tags={['red']} onChange={vi.fn()} suggestions={['red', 'blue', 'green']} />)
    expect(screen.queryByText(/red \+/)).not.toBeInTheDocument()
    expect(screen.getByText('blue +')).toBeInTheDocument()
    expect(screen.getByText('green +')).toBeInTheDocument()
  })

  it('adds a tag when a suggestion is clicked', async () => {
    const handleChange = vi.fn()
    render(<TagInput tags={[]} onChange={handleChange} suggestions={['blue']} />)
    await userEvent.click(screen.getByText('blue +'))
    expect(handleChange).toHaveBeenCalledWith(['blue'])
  })
})
