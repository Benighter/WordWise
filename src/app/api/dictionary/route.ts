import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const word = searchParams.get('word');
  
  if (!word) {
    return NextResponse.json({ error: 'Word parameter is required' }, { status: 400 });
  }

  const apiKey = process.env.DICTIONARY_API_KEY;
  const apiUrl = process.env.NEXT_PUBLIC_DICTIONARY_API_URL || 'https://dictionaryapi.com/api/v3/references/sd3/json';

  try {
    const response = await fetch(`${apiUrl}/${word}?key=${apiKey}`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Dictionary API error:', error);
    return NextResponse.json({ error: 'Failed to fetch dictionary data' }, { status: 500 });
  }
} 