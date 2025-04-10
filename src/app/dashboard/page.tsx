'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { FiSearch, FiClock, FiTrash2 } from 'react-icons/fi';
import { SearchHistory } from '@/lib/types';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([]);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  // Simulate loading search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error parsing search history:', error);
      }
    }
  }, []);

  const handleClearHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

  const handleRemoveItem = (id: string) => {
    const updatedHistory = searchHistory.filter(item => item.id !== id);
    setSearchHistory(updatedHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
  };

  const handleSearch = (word: string) => {
    router.push(`/?word=${encodeURIComponent(word)}`);
  };

  if (status === 'loading') {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="w-full max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">
            Welcome back, {session?.user?.name || 'User'}! Manage your word searches and learning progress.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card title="Recent Searches">
              {searchHistory.length === 0 ? (
                <div className="py-6 text-center">
                  <p className="text-gray-500 dark:text-gray-400">
                    You haven't searched for any words yet.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => router.push('/')}
                  >
                    <FiSearch className="mr-2" />
                    Search Dictionary
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="flex justify-end mb-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={handleClearHistory}
                    >
                      <FiTrash2 className="mr-2" />
                      Clear History
                    </Button>
                  </div>
                  <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {searchHistory.map((item) => (
                      <div
                        key={item.id}
                        className="py-3 flex justify-between items-center"
                      >
                        <div>
                          <button
                            onClick={() => handleSearch(item.word)}
                            className="text-purple-600 dark:text-purple-400 font-medium hover:underline"
                          >
                            {item.word}
                          </button>
                          <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                            <FiClock className="mr-1" />
                            {new Date(item.timestamp).toLocaleString()}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                          aria-label="Remove item"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card title="Stats">
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Searches</h3>
                  <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{searchHistory.length}</p>
                </div>
                
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unique Words</h3>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {new Set(searchHistory.map(item => item.word)).size}
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account Status</h3>
                  <p className="text-lg font-medium text-green-600 dark:text-green-400">Active</p>
                </div>
              </div>
              
              <div className="mt-6">
                <Button
                  fullWidth
                  onClick={() => router.push('/')}
                >
                  <FiSearch className="mr-2" />
                  Search New Words
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
} 