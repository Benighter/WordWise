import axios from 'axios';

// Use the public URL for the API that's accessible from the client
const API_URL = '/api/dictionary';

export interface DictionaryEntry {
  meta: {
    id: string;
    uuid: string;
    src: string;
    stems: string[];
    offensive: boolean;
  };
  hwi: {
    hw: string;
    prs?: Array<{
      mw: string;
      sound?: {
        audio: string;
      };
    }>;
  };
  fl: string; // Part of speech (noun, verb, etc.)
  def: Array<{
    sseq: Array<Array<Array<any>>>;
  }>;
  shortdef: string[];
}

export interface DictionaryError {
  message: string;
  suggestions?: string[];
}

export const searchWord = async (word: string): Promise<DictionaryEntry[] | string[]> => {
  try {
    // Use our secure API route instead of directly calling the Merriam-Webster API
    const response = await axios.get(`${API_URL}?word=${encodeURIComponent(word)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dictionary data:', error);
    throw new Error('Failed to fetch word information');
  }
};

export const getAudioUrl = (entry: DictionaryEntry): string | null => {
  if (!entry.hwi.prs || !entry.hwi.prs[0].sound) {
    return null;
  }

  const { audio } = entry.hwi.prs[0].sound;
  let subdirectory = '';

  // Determine subdirectory based on Merriam-Webster API rules
  if (audio.startsWith('bix')) {
    subdirectory = 'bix';
  } else if (audio.startsWith('gg')) {
    subdirectory = 'gg';
  } else if (/^\d/.test(audio)) {
    subdirectory = 'number';
  } else {
    subdirectory = audio.substring(0, 1);
  }

  return `https://media.merriam-webster.com/audio/prons/en/us/mp3/${subdirectory}/${audio}.mp3`;
};

export const extractDefinitions = (entry: DictionaryEntry): string[] => {
  return entry.shortdef || [];
};

export const extractPartOfSpeech = (entry: DictionaryEntry): string => {
  return entry.fl || '';
};

export const parseSuggestions = (data: string[]): string[] => {
  if (!data || !Array.isArray(data)) return [];
  return data.slice(0, 5); // Return top 5 suggestions
}; 