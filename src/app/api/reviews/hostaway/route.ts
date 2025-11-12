import { NextResponse } from "next/server";
import reviewsData from "@/data/mock-reviews.json";

export async function GET() {
  // Return the content of the mock JSON file
  return NextResponse.json(reviewsData);
}
