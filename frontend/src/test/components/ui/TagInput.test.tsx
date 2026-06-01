import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TagInput from '../../../components/ui/TagInput'

describe('TagInput', () => {
  // Pre-existing tags passed via props are each visible as chips
  it('renders existing tags', () => {
    render(<TagInput tags={['red', 'casual']} onChange={vi.fn()} />)
    expect(screen.getByText('red')).toBeInTheDocument()
    expect(screen.getByText('casual')).toBeInTheDocument()
  })

  // The text input field is present with the default placeholder
  it('renders the text input', () => {
    render(<TagInput tags={[]} onChange={vi.fn()} />)
    expect(screen.getByPlaceholderText('Add your own...')).toBeInTheDocument()
  })

  // Custom placeholder prop replaces the default text
  it('renders a custom placeholder', () => {
    render(<TagInput tags={[]} onChange={vi.fn()} placeholder="Type a tag" />)
    expect(screen.getByPlaceholderText('Type a tag')).toBeInTheDocument()
  })

  // Pressing Enter submits the typed text as a new tag via onChange
  it('adds a tag on Enter key', async () => {
    const handleChange = vi.fn()
    render(<TagInput tags={[]} onChange={handleChange} />)
    const input = screen.getByPlaceholderText('Add your own...')
    await userEvent.type(input, 'denim{Enter}')
    expect(handleChange).toHaveBeenCalledWith(['denim'])
  })

  // Typing a comma also submits the current input as a new tag
  it('adds a tag on comma key', async () => {
    const handleChange = vi.fn()
    render(<TagInput tags={[]} onChange={handleChange} />)
    const input = screen.getByPlaceholderText('Add your own...')
    await userEvent.type(input, 'vintage,')
    expect(handleChange).toHaveBeenCalledWith(['vintage'])
  })

  // Input is trimmed and lowercased before being added
  it('lowercases and trims the tag before adding', async () => {
    const handleChange = vi.fn()
    render(<TagInput tags={[]} onChange={handleChange} />)
    const input = screen.getByPlaceholderText('Add your own...')
    await userEvent.type(input, '  DENIM  {Enter}')
    expect(handleChange).toHaveBeenCalledWith(['denim'])
  })

  // Entering a tag that already exists does not call onChange
  it('does not add a duplicate tag', async () => {
    const handleChange = vi.fn()
    render(<TagInput tags={['denim']} onChange={handleChange} />)
    const input = screen.getByPlaceholderText('Add your own...')
    await userEvent.type(input, 'denim{Enter}')
    expect(handleChange).not.toHaveBeenCalled()
  })

  // Clicking the × button on a chip calls onChange with that tag removed
  it('calls onChange without the removed tag when remove is clicked', async () => {
    const handleChange = vi.fn()
    render(<TagInput tags={['red', 'blue']} onChange={handleChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Remove red' }))
    expect(handleChange).toHaveBeenCalledWith(['blue'])
  })

  // Suggestions already in tags are hidden; unused ones appear as clickable buttons
  it('shows unused suggestions', () => {
    render(<TagInput tags={['red']} onChange={vi.fn()} suggestions={['red', 'blue', 'green']} />)
    expect(screen.queryByText(/red \+/)).not.toBeInTheDocument()
    expect(screen.getByText('blue +')).toBeInTheDocument()
    expect(screen.getByText('green +')).toBeInTheDocument()
  })

  // Clicking a suggestion button adds it as a tag via onChange
  it('adds a tag when a suggestion is clicked', async () => {
    const handleChange = vi.fn()
    render(<TagInput tags={[]} onChange={handleChange} suggestions={['blue']} />)
    await userEvent.click(screen.getByText('blue +'))
    expect(handleChange).toHaveBeenCalledWith(['blue'])
  })
})
