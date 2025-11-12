"use client";

import { useState, useEffect, useMemo } from "react";

// Define a type for the review structure for better type safety
interface Review {
  id: number;
  type: string;
  status: string;
  rating: number | null;
  publicReview: string;
  guestName: string;
  listingName: string;
  submittedAt: string;
}

interface ApiResponse {
  status: string;
  result: Review[];
}

type SortKey = "rating" | "submittedAt";

export default function DashboardPage() {
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for filters and sorting
  const [filterListing, setFilterListing] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("submittedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [showUnpublished, setShowUnpublished] = useState<boolean>(true);

  // State for review selection
  const [selectedReviews, setSelectedReviews] = useState<Set<number>>(
    new Set(),
  );

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch("/api/reviews/hostaway");
        if (!response.ok) {
          throw new Error("Failed to fetch reviews");
        }
        const data: ApiResponse = await response.json();
        setAllReviews(data.result);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchReviews();
  }, []);

  const uniqueListings = useMemo(() => {
    const listings = new Set(allReviews.map((review) => review.listingName));
    return ["all", ...Array.from(listings)];
  }, [allReviews]);

  const sortedAndFilteredReviews = useMemo(() => {
    let reviews = [...allReviews];

    if (filterListing !== "all") {
      reviews = reviews.filter(
        (review) => review.listingName === filterListing,
      );
    }

    if (!showUnpublished) {
      reviews = reviews.filter((review) => review.status === "published");
    }

    reviews.sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue === null) return 1;
      if (bValue === null) return -1;

      if (aValue < bValue) {
        return sortDirection === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortDirection === "asc" ? 1 : -1;
      }
      return 0;
    });

    return reviews;
  }, [allReviews, filterListing, showUnpublished, sortKey, sortDirection]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("desc");
    }
  };

  const handleSelect = (reviewId: number) => {
    const newSelection = new Set(selectedReviews);
    if (newSelection.has(reviewId)) {
      newSelection.delete(reviewId);
    } else {
      newSelection.add(reviewId);
    }
    setSelectedReviews(newSelection);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allVisibleIds = new Set(sortedAndFilteredReviews.map((r) => r.id));
      setSelectedReviews(allVisibleIds);
    } else {
      setSelectedReviews(new Set());
    }
  };

  const handleSaveSelection = () => {
    console.log("Selected review IDs:", Array.from(selectedReviews));
    alert(
      `Saved ${selectedReviews.size} selected reviews! (Check console for IDs)`,
    );
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-6">Reviews Dashboard</h1>

      <div className="flex flex-wrap items-center gap-4 mb-6 bg-gray-50 p-4 rounded-lg justify-between">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label
              htmlFor="listing-filter"
              className="block text-sm font-medium text-gray-700"
            >
              Filter by Listing
            </label>
            <select
              id="listing-filter"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={filterListing}
              onChange={(e) => setFilterListing(e.target.value)}
            >
              {uniqueListings.map((listing) => (
                <option key={listing} value={listing}>
                  {listing}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={() => handleSort("rating")}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Sort by Rating{" "}
              {sortKey === "rating" && (sortDirection === "desc" ? "↓" : "↑")}
            </button>
            <button
              onClick={() => handleSort("submittedAt")}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Sort by Date{" "}
              {sortKey === "submittedAt" &&
                (sortDirection === "desc" ? "↓" : "↑")}
            </button>
          </div>
          <div className="flex items-center pt-1">
            <input
              id="show-unpublished"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              checked={showUnpublished}
              onChange={(e) => setShowUnpublished(e.target.checked)}
            />
            <label
              htmlFor="show-unpublished"
              className="ml-2 block text-sm text-gray-900"
            >
              Show Unpublished
            </label>
          </div>
        </div>
        <div className="flex items-end">
          <button
            onClick={handleSaveSelection}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save Selection ({selectedReviews.size})
          </button>
        </div>
      </div>

      {loading && <p>Loading reviews...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="p-4">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    onChange={handleSelectAll}
                  />
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Guest
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Listing
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Review
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Rating
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedAndFilteredReviews.map((review) => (
                <tr
                  key={review.id}
                  className={`${review.status === "unpublished" ? "bg-gray-50" : "bg-white"} ${selectedReviews.has(review.id) ? "bg-indigo-50" : ""}`}
                >
                  <td className="p-4">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      checked={selectedReviews.has(review.id)}
                      onChange={() => handleSelect(review.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {review.guestName}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {review.listingName}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div
                      className="text-sm text-gray-700 max-w-xs truncate"
                      title={review.publicReview}
                    >
                      {review.publicReview}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${review.rating === null ? "bg-gray-100 text-gray-800" : review.rating > 8 ? "bg-green-100 text-green-800" : review.rating > 5 ? "bg-yellow-100 text-yellow-800" : "bg-red-100 text-red-800"}`}
                    >
                      {review.rating ? review.rating.toFixed(1) : "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(review.submittedAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
