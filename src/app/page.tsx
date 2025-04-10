'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import MainLayout from '@/components/layout/MainLayout';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { FiSearch, FiVolume2, FiGithub, FiLinkedin, FiBriefcase } from 'react-icons/fi';
import { searchWord, DictionaryEntry, getAudioUrl, extractDefinitions, extractPartOfSpeech, parseSuggestions } from '@/lib/dictionaryApi';
import { motion } from 'framer-motion';
import { SearchHistory } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<DictionaryEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Check if there's a word in the URL query
  useEffect(() => {
    const wordParam = searchParams.get('word');
    if (wordParam) {
      setSearchQuery(wordParam);
      handleSearch({ preventDefault: () => {} } as React.FormEvent);
    }
  }, [searchParams]);

  const saveToHistory = (word: string) => {
    // Only save search history for authenticated users
    if (!session) return;

    try {
      const historyItem: SearchHistory = {
        id: uuidv4(),
        word,
        timestamp: Date.now()
      };

      // Get existing history
      const existingHistory = localStorage.getItem('searchHistory');
      let history: SearchHistory[] = existingHistory ? JSON.parse(existingHistory) : [];
      
      // Add new item to the beginning
      history = [historyItem, ...history.slice(0, 19)]; // Keep only the 20 most recent searches
      
      // Save back to localStorage
      localStorage.setItem('searchHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Error saving search to history:', error);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSearchResults(null);
    setSuggestions([]);
    
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
        saveToHistory(searchQuery.trim());
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
                      
                      {getAudioUrl(entry) && (
                        <button
                          onClick={() => playAudio(entry)}
                          className="p-2 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
                          aria-label="Listen to pronunciation"
                        >
                          <FiVolume2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white mb-2">Definitions:</h3>
                      <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                        {extractDefinitions(entry).map((definition, idx) => (
                          <li key={idx} className="pl-2">{definition}</li>
                        ))}
                      </ol>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 w-full max-w-4xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Comprehensive</h3>
                <p className="text-gray-600 dark:text-gray-300">Access detailed definitions, pronunciations, and usage examples.</p>
              </div>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">User-Friendly</h3>
                <p className="text-gray-600 dark:text-gray-300">Simple, intuitive interface to help you find what you need quickly.</p>
              </div>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-gray-800">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Reliable</h3>
                <p className="text-gray-600 dark:text-gray-300">Powered by Merriam-Webster, a trusted name in dictionaries.</p>
              </div>
            </Card>
          </div>
        </motion.div>
        
        {/* Author Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 mb-8 w-full max-w-4xl"
        >
          <div className="border-t border-gray-200 dark:border-gray-700 pt-12">
            <Card className="overflow-hidden">
              <div className="sm:flex items-center gap-8 p-2">
                <div className="sm:w-1/3 mb-6 sm:mb-0 flex justify-center">
                  <div className="w-32 h-32 rounded-full bg-purple-100 dark:bg-purple-900/40 flex items-center justify-center overflow-hidden">
                    <span className="text-5xl font-bold text-purple-600 dark:text-purple-400">B</span>
                  </div>
                </div>
                
                <div className="sm:w-2/3 text-center sm:text-left">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Bennet Nkolele</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Developer and designer passionate about creating beautiful, functional web applications that deliver exceptional user experiences.
                  </p>
                  
                  <div className="flex justify-center sm:justify-start space-x-4">
                    <Link 
                      href="https://github.com/Benighter" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300"
                    >
                      <FiGithub className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
                      <span>GitHub</span>
                    </Link>
                    
                    <Link 
                      href="https://www.linkedin.com/in/bennet-nkolele-321285249/" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300"
                    >
                      <FiLinkedin className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
                      <span>LinkedIn</span>
                    </Link>
                    
                    <Link 
                      href="https://react-personal-portfolio-alpha.vercel.app/" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-300"
                    >
                      <FiBriefcase className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6" />
                      <span>Portfolio</span>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
