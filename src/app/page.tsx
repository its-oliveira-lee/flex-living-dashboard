import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          Flex Living Reviews Dashboard
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Welcome to the reviews management portal.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/dashboard"
            className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition"
          >
            Go to Manager Dashboard
          </Link>
          <Link
            href="/property-display"
            className="px-6 py-3 bg-white text-indigo-600 font-semibold rounded-lg shadow-md border border-indigo-200 hover:bg-gray-100 transition"
          >
            View Public Reviews
          </Link>
        </div>
      </div>
    </main>
  );
}
