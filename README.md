# Flex Living - Reviews Dashboard

This project is a developer assessment to build a reviews dashboard for Flex Living. It includes a manager-facing dashboard to moderate reviews and a public-facing page to display approved reviews.

## Tech Stack

*   **Framework:** Next.js (v14)
*   **Language:** TypeScript
*   **UI Library:** React
*   **Styling:** Tailwind CSS

## Local Setup

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Run the Development Server:**
    ```bash
    npm run dev
    ```

    The application will be available at `http://localhost:3000`.
    *   The main dashboard is at `http://localhost:3000/dashboard`.
    *   The public display page is at `http://localhost:3000/property-display`.

## Key Design & Logic Decisions

*   **Project Scaffolding:** The project was manually scaffolded due to environmental constraints preventing the use of `create-next-app`. All configuration files (`package.json`, `tsconfig.json`, `tailwind.config.ts`, etc.) were created individually.
*   **Mock Data:** As the mock data was not provided, a `src/data/mock-reviews.json` file was created based on the schema in the assessment PDF. This allows for realistic UI development.
*   **Dashboard (`/dashboard`):**
    *   This is a client-side component (`'use client'`) to allow for state management and user interaction.
    *   State is managed with `useState` and `useMemo` hooks for efficient filtering, sorting, and selection of reviews.
    *   All data manipulation (sorting, filtering) is done on the client-side for immediate user feedback.
*   **Public Display Page (`/property-display`):**
    *   This is a server-side component for fast initial load times and SEO-friendliness.
    *   It directly imports the mock data, bypassing the API route for efficiency on the server.
    *   It simulates a database of "approved" reviews by filtering based on a hardcoded array of IDs (`[8003, 7453]`).
    *   The layout is a two-column design that replicates the structure and style of the provided URL (`theflex.global`).

## API Behaviors

*   **`GET /api/reviews/hostaway`**
    *   This endpoint reads the `src/data/mock-reviews.json` file and returns its full content.
    *   It serves as the single source of truth for the client-side dashboard application.

## Google Reviews Findings

This is the next exploratory task to be undertaken. The goal is to investigate the feasibility of integrating Google Reviews via the Places API or another method. Findings will be added here upon completion.
