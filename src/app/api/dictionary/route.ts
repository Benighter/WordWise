import { NextResponse } from 'next/server';

// Sample data for demonstration when API key is not available
const sampleData = [
  {
    "meta": {
      "id": "example",
      "uuid": "sample-uuid-123",
      "src": "sample",
      "stems": ["example", "examples"],
      "offensive": false
    },
    "hwi": {
      "hw": "ex·am·ple",
      "prs": [
        {
          "mw": "ig-ˈzam-pəl",
          "sound": {
            "audio": "example01"
          }
        }
      ]
    },
    "fl": "noun",
    "def": [
      {
        "sseq": [[["text", "a representative instance"]]]
      }
    ],
    "shortdef": [
      "a representative instance", 
      "a pattern or model", 
      "an instance serving to illustrate a rule"
    ]
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const word = searchParams.get('word');
  
  if (!word) {
    return NextResponse.json({ error: 'Word parameter is required' }, { status: 400 });
  }

  const apiKey = process.env.DICTIONARY_API_KEY;
  const apiUrl = process.env.NEXT_PUBLIC_DICTIONARY_API_URL || 'https://dictionaryapi.com/api/v3/references/sd3/json';

  // If API key is missing, return sample data for testing/development
  if (!apiKey) {
    console.warn('Dictionary API key is missing. Using sample data.');
    
    // Return a modified sample with the requested word
    const modifiedSample = JSON.parse(JSON.stringify(sampleData));
    modifiedSample[0].meta.id = word;
    modifiedSample[0].meta.stems = [word];
    modifiedSample[0].hwi.hw = word;
    
    return NextResponse.json(modifiedSample);
  }

  try {
    const response = await fetch(`${apiUrl}/${encodeURIComponent(word)}?key=${apiKey}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Dictionary API error (${response.status}):`, errorText);
      return NextResponse.json({ error: `API error: ${response.status}` }, { status: response.status });
    }
    
    const data = await response.json();
    
    // Handle suggestions case (when the API returns an array of strings instead of definitions)
    if (data.length > 0 && typeof data[0] === 'string') {
      return NextResponse.json(data); // Return suggestions as is
    }
    
    // Return definitions
    return NextResponse.json(data);
  } catch (error) {
    console.error('Dictionary API error:', error);
    return NextResponse.json({ error: 'Failed to fetch dictionary data' }, { status: 500 });
  }
} 