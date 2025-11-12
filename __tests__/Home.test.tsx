import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Home from '../src/app/page'

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />)

    const heading = screen.getByRole('heading', {
      name: /flex living reviews dashboard/i,
    })

    expect(heading).toBeInTheDocument()
  })

  it('renders the link to the manager dashboard', () => {
    render(<Home />)

    const dashboardLink = screen.getByRole('link', {
      name: /go to manager dashboard/i,
    })

    expect(dashboardLink).toBeInTheDocument()
    expect(dashboardLink).toHaveAttribute('href', '/dashboard')
  })

  it('renders the link to the public reviews page', () => {
    render(<Home />)

    const publicLink = screen.getByRole('link', {
      name: /view public reviews/i,
    })

    expect(publicLink).toBeInTheDocument()
    expect(publicLink).toHaveAttribute('href', '/property-display')
  })
})
