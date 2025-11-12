import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import DashboardPage from '../src/app/dashboard/page'
import mockReviews from '../src/data/mock-reviews.json'

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockReviews),
  })
) as jest.Mock;

describe('Dashboard Page', () => {
  beforeEach(() => {
    // Clear mock history before each test
    (fetch as jest.Mock).mockClear();
  });

  it('renders reviews correctly on initial load', async () => {
    render(<DashboardPage />);

    // Wait for the component to finish fetching and rendering
    // We expect to see 4 reviews in the table
    const rows = await screen.findAllByRole('row');
    // The first row is the header, so we expect 4 review rows + 1 header row
    expect(rows).toHaveLength(5);

    // Check for a specific review
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
  });

  it('filters reviews by listing name', async () => {
    render(<DashboardPage />);

    // Wait for initial data to load
    await screen.findByText('Alice Johnson');

    // Find the filter dropdown
    const filterSelect = screen.getByLabelText(/filter by listing/i);

    // Simulate user selecting "Modern Downtown Loft"
    fireEvent.change(filterSelect, { target: { value: 'Modern Downtown Loft' } });

    // After filtering, we expect to see only one review row + header
    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      expect(rows).toHaveLength(2); // Header + 1 row
    });

    // Check that only the correct review is visible
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.queryByText('Bob Williams')).not.toBeInTheDocument();
  });

  it('sorts reviews by rating in descending order', async () => {
    render(<DashboardPage />);

    // Wait for initial data to load
    await screen.findByText('Alice Johnson');

    // Find the sort button
    const sortByRatingButton = screen.getByRole('button', { name: /sort by rating/i });

    // Click the button to sort by rating (defaults to descending)
    fireEvent.click(sortByRatingButton);

    // After sorting, the rows should be in a specific order.
    // The mock data ratings are: null, 9.5, 7.5, 4.5
    // The sorted order should be Alice (9.5), Bob (7.5), Charlie (4.5), Shane (null)
    await waitFor(() => {
      const rows = screen.getAllByRole('row');
      // Note: This checks the rendered text content order.
      const rowContents = rows.map(row => row.textContent);
      expect(rowContents[1]).toContain('Alice Johnson'); // 9.5
      expect(rowContents[2]).toContain('Bob Williams'); // 7.5
      expect(rowContents[3]).toContain('Charlie Brown'); // 4.5
      expect(rowContents[4]).toContain('Shane Finkelstein'); // null
    });
  });
});
