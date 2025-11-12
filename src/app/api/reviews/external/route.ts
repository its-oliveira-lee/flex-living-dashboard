import { NextResponse } from 'next/server';

// Define the structure of the incoming data from JSONPlaceholder
interface JsonPlaceholderComment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

// Define our app's internal review structure
interface AppReview {
  id: number;
  guestName: string;
  publicReview: string;
  rating: number;
  source: string;
}

export async function GET() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/comments?_limit=5');
    if (!response.ok) {
      throw new Error('Failed to fetch comments from JSONPlaceholder');
    }
    const comments: JsonPlaceholderComment[] = await response.json();

    // Transform the data into our desired format
    const transformedReviews: AppReview[] = comments.map(comment => ({
      id: comment.id,
      guestName: comment.email.split('@')[0], // Use the part of the email before the @ as a name
      publicReview: comment.body,
      rating: parseFloat((Math.random() * (9.8 - 6.5) + 6.5).toFixed(1)), // Generate a random rating between 6.5 and 9.8
      source: 'External API',
    }));

    return NextResponse.json(transformedReviews);

  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
