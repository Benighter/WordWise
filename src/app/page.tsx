'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import MainLayout from '@/components/layout/MainLayout';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { FiSearch, FiVolume2, FiHeart } from 'react-icons/fi';
import { searchWord, DictionaryEntry, getAudioUrl, extractDefinitions, extractPartOfSpeech, parseSuggestions } from '@/lib/dictionaryApi';
import { motion } from 'framer-motion';
import { userDataService } from '@/lib/userDataService';
import Link from 'next/link';

// Wrapper component with Suspense
export default function HomePage() {
  return (
    <Suspense fallback={<Loading />}>
      <Home />
    </Suspense>
  );
}

// Loading component
function Loading() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    </MainLayout>
  );
}

// Main Home component
function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<DictionaryEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);

  // Initialize user data service when session is available
  useEffect(() => {
    if (session?.user?.id) {
      userDataService.initialize(session.user.id);
    }
  }, [session]);

  // Check if there's a word in the URL query
  useEffect(() => {
    const wordParam = searchParams.get('word');
    if (wordParam) {
      setSearchQuery(wordParam);
      handleSearch({ preventDefault: () => {} } as React.FormEvent);
    }
  }, [searchParams]);

  // Check if the current word is a favorite
  useEffect(() => {
    if (session?.user?.id && searchResults && searchResults.length > 0) {
      const wordToCheck = searchResults[0].meta?.id?.split(':')[0] || searchQuery;
      setIsFavorite(userDataService.isFavorite(wordToCheck));
    }
  }, [searchResults, searchQuery, session]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSearchResults(null);
    setSuggestions([]);
    setIsFavorite(false);
    
    try {
      const results = await searchWord(searchQuery.trim());
      
      if (results.length === 0) {
        setError('No results found for this word.');
      } else if (typeof results[0] === 'string') {
        // We got suggestions instead of definitions
        setSuggestions(parseSuggestions(results as string[]));
        setError(`No exact match found for "${searchQuery}". Did you mean:`);
      } else {
        setSearchResults(results as DictionaryEntry[]);
        
        // Save search to history if user is logged in
        if (session?.user?.id) {
          userDataService.addSearch(searchQuery.trim());
        }
        
        // Check if this word is a favorite
        if (session?.user?.id) {
          const wordToCheck = results[0].meta?.id?.split(':')[0] || searchQuery;
          setIsFavorite(userDataService.isFavorite(wordToCheck));
        }
      }
    } catch (error) {
      setError('An error occurred while searching. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const playAudio = (entry: DictionaryEntry) => {
    const audioUrl = getAudioUrl(entry);
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(e => console.error('Error playing audio:', e));
    }
  };

  const toggleFavorite = (entry: DictionaryEntry) => {
    if (!session?.user?.id) {
      router.push('/auth/login');
      return;
    }

    const word = entry.meta?.id?.split(':')[0] || searchQuery;
    const partOfSpeech = extractPartOfSpeech(entry);
    const definitions = extractDefinitions(entry);
    const definition = definitions.length > 0 ? definitions[0] : '';

    if (isFavorite) {
      // Find the ID and remove it
      const favorites = userDataService.getFavorites();
      const favorite = favorites.find(fav => fav.word.toLowerCase() === word.toLowerCase());
      if (favorite) {
        userDataService.removeFavorite(favorite.id);
      }
    } else {
      // Add to favorites
      userDataService.addFavorite(word, partOfSpeech, definition);
    }

    setIsFavorite(!isFavorite);
  };

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Expand Your <span className="text-purple-600">Vocabulary</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover definitions, pronunciations, and more with our comprehensive dictionary powered by Merriam-Webster.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-2xl"
        >
          <Card className="mb-8">
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-grow">
                <Input
                  placeholder="Search for a word..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                  icon={<FiSearch className="text-gray-400" />}
                />
              </div>
              <Button 
                type="submit" 
                isLoading={isLoading}
                className="h-12 px-6"
              >
                Search
              </Button>
            </form>
          </Card>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="mb-6">
                <div className={suggestions.length > 0 ? "mb-4" : ""}>
                  <p className="text-gray-800 dark:text-gray-200">{error}</p>
                </div>
                
                {suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSearchQuery(suggestion);
                          handleSearch({ preventDefault: () => {} } as React.FormEvent);
                        }}
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          )}

          {searchResults && searchResults.length > 0 && (
            <div className="space-y-6">
              {searchResults.map((entry, index) => (
                <motion.div
                  key={entry.meta?.uuid || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {entry.meta?.id?.split(':')[0] || searchQuery}
                        </h2>
                        <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">
                          {extractPartOfSpeech(entry)}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {getAudioUrl(entry) && (
                          <button
                            onClick={() => playAudio(entry)}
                            className="p-2 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
                            aria-label="Play pronunciation"
                          >
                            <FiVolume2 className="h-5 w-5" />
                          </button>
                        )}
                        
                        {status === 'authenticated' && (
                          <button
                            onClick={() => toggleFavorite(entry)}
                            className={`p-2 rounded-full ${
                              isFavorite
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400'
                            } transition-colors`}
                            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                          >
                            <FiHeart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      {entry.hwi?.prs && entry.hwi.prs.length > 0 && (
                        <p className="text-gray-600 dark:text-gray-400 text-sm">
                          Pronunciation: <span className="font-medium">{entry.hwi.prs[0].mw}</span>
                        </p>
                      )}
                    </div>
                    
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">Definitions:</h3>
                      <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                        {extractDefinitions(entry).map((def, idx) => (
                          <li key={idx} className="pl-2">{def}</li>
                        ))}
                      </ul>
                    </div>
                    
                    {status !== 'authenticated' && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-center">
                        <Link href="/auth/login" className="text-sm text-purple-600 dark:text-purple-400 hover:underline">
                          Sign in to save words to your favorites
                        </Link>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
}
