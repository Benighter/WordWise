'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { 
  FiBook, FiLogOut, FiUser, FiCalendar, FiClock, 
  FiBarChart2, FiHeart, FiBookmark, FiTrendingUp, 
  FiSearch, FiCheck, FiPlus, FiTrash2
} from 'react-icons/fi';
import MainLayout from '@/components/layout/MainLayout';
import Link from 'next/link';
import { userDataService, SearchItem, FavoriteWord, WordCategory } from '@/lib/userDataService';

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
  // State for real data
  const [searchHistory, setSearchHistory] = useState<SearchItem[]>([]);
  const [favorites, setFavorites] = useState<FavoriteWord[]>([]);
  const [categories, setCategories] = useState<{name: string; count: number; color: string}[]>([]);
  const [stats, setStats] = useState({
    totalSearches: 0,
    uniqueWords: 0,
    streak: 0,
    wordsPerDay: 0,
    mostActiveDay: 'Sunday'
  });
  const [wordOfTheDay, setWordOfTheDay] = useState({
    word: '',
    partOfSpeech: '',
    definition: ''
  });

  // Initialize user data when session is available
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
    
    if (session?.user?.id) {
      // Initialize the user data service
      userDataService.initialize(session.user.id);
      
      // Load data
      loadUserData();
    }
  }, [status, router, session]);

  // Load all user data from the service
  const loadUserData = () => {
    // Load search history
    setSearchHistory(userDataService.getSearchHistory());
    
    // Load favorites
    setFavorites(userDataService.getFavorites());
    
    // Load categories
    setCategories(userDataService.getCategoryStats());
    
    // Load stats
    setStats(userDataService.getStats());
    
    // Load word of the day
    setWordOfTheDay(userDataService.getWordOfTheDay());
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await signOut({ redirect: false });
    router.push('/auth/login');
  };

  const handleSearch = (word: string) => {
    router.push(`/?word=${encodeURIComponent(word)}`);
  };

  const handleRemoveFromHistory = (id: string) => {
    userDataService.removeSearchItem(id);
    setSearchHistory(userDataService.getSearchHistory());
  };

  const handleClearHistory = () => {
    userDataService.clearSearchHistory();
    setSearchHistory([]);
    // Reload stats after clearing history
    setStats(userDataService.getStats());
  };

  const handleRemoveFavorite = (id: string) => {
    userDataService.removeFavorite(id);
    setFavorites(userDataService.getFavorites());
  };

  const handleAddToFavorites = (item: SearchItem) => {
    userDataService.addFavorite(item.word, '', 'Added from search history');
    setFavorites(userDataService.getFavorites());
  };

  const handleAddCategory = () => {
    const name = prompt('Enter category name:');
    if (name) {
      const colors = [
        'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300',
        'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300',
        'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300',
        'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300',
        'bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-300',
        'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300'
      ];
      
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      userDataService.addCategory(name, randomColor);
      setCategories(userDataService.getCategoryStats());
    }
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
      <div className="w-full max-w-7xl mx-auto px-4">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Welcome back, <span className="font-medium text-purple-600 dark:text-purple-400">{session?.user?.name || 'User'}</span>! Track your vocabulary journey.
            </p>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => router.push('/')}
              className="flex items-center"
            >
              <FiSearch className="mr-2" />
              Search Words
            </Button>
            
            <Button
              onClick={handleLogout}
              isLoading={isLoading}
              variant="secondary"
              className="flex items-center"
            >
              <FiLogOut className="mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
        
        {/* Navigation tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'overview'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'history'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Search History
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`py-4 px-1 font-medium text-sm border-b-2 ${
                activeTab === 'favorites'
                  ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Favorites
            </button>
          </nav>
        </div>
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-4 border-l-4 border-purple-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Searches</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.totalSearches}</p>
                  </div>
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                    <FiSearch className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <div className="mt-3 flex items-center text-sm">
                  <FiTrendingUp className="text-green-500 mr-1" />
                  <span className="text-gray-500 dark:text-gray-400">Track your learning</span>
                </div>
              </Card>
              
              <Card className="p-4 border-l-4 border-blue-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Unique Words</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.uniqueWords}</p>
                  </div>
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <FiBook className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <div className="mt-3 flex items-center text-sm">
                  <FiTrendingUp className="text-green-500 mr-1" />
                  <span className="text-gray-500 dark:text-gray-400">Growing vocabulary</span>
                </div>
              </Card>
              
              <Card className="p-4 border-l-4 border-green-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Streak</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.streak} days</p>
                  </div>
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <FiCalendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="mt-3 flex items-center text-sm">
                  <FiCheck className="text-green-500 mr-1" />
                  <span className="text-gray-500 dark:text-gray-400">Keep learning daily!</span>
                </div>
              </Card>
              
              <Card className="p-4 border-l-4 border-orange-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Words Per Day</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stats.wordsPerDay}</p>
                  </div>
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <FiBarChart2 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                <div className="mt-3 flex items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Most active on {stats.mostActiveDay}s</span>
                </div>
              </Card>
            </div>
            
            {/* Word of the Day */}
            <Card className="overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/3 p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Word of the Day</h3>
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">{wordOfTheDay.word}</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2 text-sm italic">{wordOfTheDay.partOfSpeech}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{wordOfTheDay.definition}</p>
                  <div className="mt-4 flex space-x-2">
                    <Button size="sm" onClick={() => handleSearch(wordOfTheDay.word)}>
                      <FiSearch className="mr-2" /> Look Up
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => {
                      userDataService.addFavorite(wordOfTheDay.word, wordOfTheDay.partOfSpeech, wordOfTheDay.definition);
                      setFavorites(userDataService.getFavorites());
                    }}>
                      <FiHeart className="mr-2" /> Add to Favorites
                    </Button>
                  </div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 md:w-1/3 p-6 flex items-center justify-center">
                  <div className="text-center">
                    <FiBook className="h-16 w-16 text-purple-500 dark:text-purple-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Expand your vocabulary daily!</p>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Recent searches and categories */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent searches */}
              <div className="lg:col-span-2">
                <Card title="Recent Searches">
                  {searchHistory.length === 0 ? (
                    <div className="p-6 text-center">
                      <p className="text-gray-500 dark:text-gray-400">You haven't looked up any words yet.</p>
                      <Button variant="outline" className="mt-4" onClick={() => router.push('/')}>
                        <FiSearch className="mr-2" /> Search Dictionary
                      </Button>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {searchHistory.slice(0, 5).map((item) => (
                        <div key={item.id} className="p-4 flex justify-between items-center">
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
                          <div className="flex space-x-2">
                            <button
                              className="p-1 text-gray-400 hover:text-purple-500 dark:hover:text-purple-400"
                              title="Add to favorites"
                              onClick={() => handleAddToFavorites(item)}
                            >
                              <FiHeart />
                            </button>
                            <button
                              className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                              title="Remove from history"
                              onClick={() => handleRemoveFromHistory(item.id)}
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {searchHistory.length > 0 && (
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-center">
                      <button
                        onClick={() => setActiveTab('history')}
                        className="text-sm text-purple-600 dark:text-purple-400 hover:underline font-medium"
                      >
                        View All History
                      </button>
                    </div>
                  )}
                </Card>
              </div>
              
              {/* Categories */}
              <Card title="Word Categories">
                <div className="p-4">
                  <div className="space-y-3">
                    {categories.length === 0 ? (
                      <p className="text-center text-gray-500 dark:text-gray-400">No categories yet</p>
                    ) : (
                      categories.map((category, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className={`w-3 h-3 rounded-full mr-2 ${category.color.split(' ')[0]}`}></span>
                            <span className="text-gray-700 dark:text-gray-300">{category.name}</span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${category.color}`}>
                            {category.count}
                          </span>
                        </div>
                      ))
                    )}
                    <button 
                      className="mt-2 text-sm flex items-center text-purple-600 dark:text-purple-400 hover:underline"
                      onClick={handleAddCategory}
                    >
                      <FiPlus className="mr-1" /> Add New Category
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
        
        {/* History Tab */}
        {activeTab === 'history' && (
          <Card>
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Search History</h3>
                {searchHistory.length > 0 && (
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={handleClearHistory}
                  >
                    Clear All
                  </Button>
                )}
              </div>
              
              {searchHistory.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-500 dark:text-gray-400">Your search history is empty.</p>
                  <Button variant="outline" className="mt-4" onClick={() => router.push('/')}>
                    <FiSearch className="mr-2" /> Search Dictionary
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {searchHistory.map((item) => (
                    <div key={item.id} className="py-3 flex justify-between items-center">
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
                      <div className="flex space-x-2">
                        <button 
                          className="p-1 text-gray-400 hover:text-purple-500 dark:hover:text-purple-400"
                          onClick={() => handleAddToFavorites(item)}
                        >
                          <FiHeart />
                        </button>
                        <button 
                          className="p-1 text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                          onClick={() => handleRemoveFromHistory(item.id)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        )}
        
        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <Card>
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Favorite Words</h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => router.push('/')}
                >
                  <FiPlus className="mr-1" /> Add Word
                </Button>
              </div>
              
              {favorites.length === 0 ? (
                <div className="p-6 text-center">
                  <p className="text-gray-500 dark:text-gray-400">You haven't added any favorites yet.</p>
                  <Button variant="outline" className="mt-4" onClick={() => router.push('/')}>
                    <FiSearch className="mr-2" /> Search and Add Favorites
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {favorites.map((favorite) => (
                    <div key={favorite.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="font-medium text-purple-600 dark:text-purple-400">{favorite.word}</h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{favorite.partOfSpeech}</p>
                        </div>
                        <button 
                          className="text-red-500"
                          onClick={() => handleRemoveFavorite(favorite.id)}
                        >
                          <FiHeart className="h-5 w-5 fill-current" />
                        </button>
                      </div>
                      {favorite.definition && (
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {favorite.definition}
                        </p>
                      )}
                      <div className="mt-3 flex justify-between">
                        <button 
                          onClick={() => handleSearch(favorite.word)}
                          className="text-xs text-purple-600 dark:text-purple-400 hover:underline flex items-center"
                        >
                          <FiSearch className="mr-1" /> Look Up
                        </button>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(favorite.added).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </MainLayout>
  );
} 