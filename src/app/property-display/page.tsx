"use client";

import { useState, useEffect } from "react";
import reviewsData from "@/data/mock-reviews.json";

// Define types for the review structures
interface InternalReview {
  id: number;
  publicReview: string;
  guestName: string;
  rating: number | null;
  submittedAt: string;
}

interface ExternalReview {
  id: number;
  guestName: string;
  publicReview: string;
  rating: number;
  source: string;
}

export default function PropertyDisplayPage() {
  // For internal reviews, we can still get them statically
  const allInternalReviews: InternalReview[] = reviewsData.result;
  const approvedReviewIds = [8003, 7453];
  const approvedReviews = allInternalReviews.filter((review) =>
    approvedReviewIds.includes(review.id),
  );

  // State for external reviews
  const [externalReviews, setExternalReviews] = useState<ExternalReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchExternalReviews() {
      try {
        const response = await fetch("/api/reviews/external");
        if (!response.ok) {
          throw new Error("Failed to fetch external reviews");
        }
        const data: ExternalReview[] = await response.json();
        setExternalReviews(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        setLoading(false);
      }
    }
    fetchExternalReviews();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      {/* Header Placeholder */}
      <header className="bg-white border-b py-4">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="text-2xl font-bold text-gray-800">Flex Living</div>
          <nav className="space-x-4">
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Properties
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              About
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900">
              Login
            </a>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-6">
        {/* Image Gallery Placeholder */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-8">
          <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Image Gallery Placeholder</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Property Details */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h1 className="text-3xl font-bold text-gray-900">
                Modern Downtown Loft
              </h1>
              <p className="text-gray-600 mt-1">Shoreditch, London</p>
              <div className="border-t border-gray-200 my-6"></div>
              <h2 className="text-2xl font-semibold mb-4">
                About this property
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
                lacinia odio vitae vestibulum vestibulum. Cras venenatis euismod
                malesuada. Nullam ac erat ante. Vivamus ut quam nec elit sommodo
                interdum. Duis autem vel eum iriure dolor in hendrerit in
                vulputate velit esse molestie consequat.
              </p>
            </div>

            {/* Reviews Section */}
            <section id="reviews" className="mt-8">
              <h2 className="text-2xl font-bold mb-4">
                Guest Reviews ({approvedReviews.length})
              </h2>

              {approvedReviews.length > 0 ? (
                <div className="space-y-6">
                  {approvedReviews.map((review) => (
                    <article
                      key={review.id}
                      className="bg-white p-6 rounded-lg shadow-md"
                    >
                      <div className="flex items-center mb-3">
                        <div className="font-bold text-gray-800">
                          {review.guestName}
                        </div>
                        <div className="ml-auto text-sm text-gray-500">
                          {new Date(review.submittedAt).toLocaleDateString(
                            "en-CA",
                          )}
                        </div>
                      </div>
                      {review.rating && (
                        <div className="flex items-center mb-3">
                          <span className="text-yellow-400">
                            {"★".repeat(Math.round(review.rating / 2))}
                          </span>
                          <span className="text-gray-300">
                            {"★".repeat(5 - Math.round(review.rating / 2))}
                          </span>
                          <span className="ml-3 text-sm font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            {review.rating.toFixed(1)}
                          </span>
                        </div>
                      )}
                      <p className="text-gray-800 leading-relaxed">
                        {review.publicReview}
                      </p>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <p className="text-gray-500">
                    No approved reviews to display for this property yet.
                  </p>
                </div>
              )}
            </section>

            {/* External Reviews Section */}
            <section id="external-reviews" className="mt-8">
              <h2 className="text-2xl font-bold mb-4">External Reviews</h2>
              {loading && <p>Loading external reviews...</p>}
              {error && <p className="text-red-500">Error: {error}</p>}
              {!loading && !error && (
                <div className="space-y-6">
                  {externalReviews.map((review) => (
                    <article
                      key={`external-${review.id}`}
                      className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-400"
                    >
                      <div className="flex items-center mb-3">
                        <div className="font-bold text-gray-800">
                          {review.guestName}
                        </div>
                        <div className="ml-auto text-sm font-semibold text-purple-600">
                          {review.source}
                        </div>
                      </div>
                      <div className="flex items-center mb-3">
                        <span className="text-yellow-400">
                          {"★".repeat(Math.round(review.rating / 2))}
                        </span>
                        <span className="text-gray-300">
                          {"★".repeat(5 - Math.round(review.rating / 2))}
                        </span>
                        <span className="ml-3 text-sm font-semibold bg-purple-100 text-purple-800 px-2 py-0.5 rounded">
                          {review.rating.toFixed(1)}
                        </span>
                      </div>
                      <p className="text-gray-800 leading-relaxed">
                        {review.publicReview}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </div>
          <aside className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-900">
                Booking
              </h3>
              <p className="text-gray-600">Booking widget placeholder.</p>
              <button className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
                Book Now
              </button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
