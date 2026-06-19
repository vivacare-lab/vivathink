import { NextResponse } from 'next/server';
import { generateQuestions } from '@/features/ai/question';

export async function POST() {
  const result = await generateQuestions();

  return NextResponse.json({
    success: true,
    data: result,
  });
}

export async function GET() {
  const result = await generateQuestions();

  return NextResponse.json(result);
}
