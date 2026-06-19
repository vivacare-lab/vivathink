import { NextRequest, NextResponse } from 'next/server';
import { creativityFeedback } from '@/features/ai/feedback';

export async function POST(req: NextRequest) {
  const body = await req.json();

  const result = await creativityFeedback(body.question, body.words);

  return NextResponse.json(result);
}
