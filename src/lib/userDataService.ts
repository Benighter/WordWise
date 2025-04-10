import { v4 as uuidv4 } from 'uuid';

// Data Models
export interface SearchItem {
  id: string;
  word: string;
  timestamp: number;
  category?: string;
}

export interface FavoriteWord {
  id: string;
  word: string;
  partOfSpeech: string;
  definition: string;
  added: number;
  category?: string; 
}

export interface WordCategory {
  id: string;
  name: string;
  color: string;
}

export interface UserStats {
  totalSearches: number;
  uniqueWords: Set<string>;
  lastSearchDate: number | null;
  consecutiveDays: number;
  searchDates: Record<string, number>;
}

// Default categories with colors
const DEFAULT_CATEGORIES: WordCategory[] = [
  { id: '1', name: 'Business', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300' },
  { id: '2', name: 'Science', color: 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300' },
  { id: '3', name: 'Literature', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300' },
  { id: '4', name: 'Technology', color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-300' },
];

// Service class to manage user data
class UserDataService {
  private userId: string | null = null;
  private searchHistory: SearchItem[] = [];
  private favorites: FavoriteWord[] = [];
  private categories: WordCategory[] = [];
  private stats: UserStats = {
    totalSearches: 0,
    uniqueWords: new Set<string>(),
    lastSearchDate: null,
    consecutiveDays: 0,
    searchDates: {}
  };
  private wordOfTheDay: { word: string; partOfSpeech: string; definition: string; date: string } | null = null;

  constructor() {
    // Initialize with default categories
    this.categories = [...DEFAULT_CATEGORIES];
  }

  // Initialize user data
  initialize(userId: string): void {
    this.userId = userId;
    this.loadDataFromStorage();
    this.checkAndUpdateStreak();
    this.checkAndUpdateWordOfTheDay();
  }

  // SEARCH HISTORY METHODS

  addSearch(word: string, category?: string): void {
    if (!word.trim() || !this.userId) return;

    // Add to history
    const searchItem: SearchItem = {
      id: uuidv4(),
      word: word.toLowerCase().trim(),
      timestamp: Date.now(),
      category
    };
    this.searchHistory = [searchItem, ...this.searchHistory];

    // Update statistics
    this.stats.totalSearches++;
    this.stats.uniqueWords.add(word.toLowerCase().trim());
    
    // Update search dates for streak calculation
    const today = new Date().toISOString().split('T')[0];
    this.stats.searchDates[today] = (this.stats.searchDates[today] || 0) + 1;
    this.stats.lastSearchDate = Date.now();
    
    // Recalculate streak
    this.checkAndUpdateStreak();
    
    // Save changes
    this.saveDataToStorage();
  }

  getSearchHistory(): SearchItem[] {
    return this.searchHistory;
  }

  clearSearchHistory(): void {
    this.searchHistory = [];
    this.saveDataToStorage();
  }

  removeSearchItem(id: string): void {
    this.searchHistory = this.searchHistory.filter(item => item.id !== id);
    this.saveDataToStorage();
  }

  // FAVORITES METHODS

  addFavorite(word: string, partOfSpeech: string, definition: string, category?: string): void {
    if (!word.trim() || !this.userId) return;

    // Check if already exists
    const exists = this.favorites.some(fav => fav.word.toLowerCase() === word.toLowerCase());
    if (exists) return;

    const favoriteWord: FavoriteWord = {
      id: uuidv4(),
      word: word.toLowerCase().trim(),
      partOfSpeech,
      definition,
      added: Date.now(),
      category
    };
    this.favorites = [favoriteWord, ...this.favorites];
    this.saveDataToStorage();
  }

  removeFavorite(id: string): void {
    this.favorites = this.favorites.filter(fav => fav.id !== id);
    this.saveDataToStorage();
  }

  getFavorites(): FavoriteWord[] {
    return this.favorites;
  }

  isFavorite(word: string): boolean {
    return this.favorites.some(fav => fav.word.toLowerCase() === word.toLowerCase());
  }

  // CATEGORIES METHODS

  getCategories(): WordCategory[] {
    return this.categories;
  }

  addCategory(name: string, color: string): void {
    if (!name.trim() || !this.userId) return;

    // Check if already exists
    const exists = this.categories.some(cat => cat.name.toLowerCase() === name.toLowerCase());
    if (exists) return;

    const category: WordCategory = {
      id: uuidv4(),
      name: name.trim(),
      color
    };
    this.categories = [...this.categories, category];
    this.saveDataToStorage();
  }

  removeCategory(id: string): void {
    this.categories = this.categories.filter(cat => cat.id !== id);
    this.saveDataToStorage();
  }

  getCategoryStats(): { name: string; count: number; color: string }[] {
    const stats = this.categories.map(category => {
      const searchCount = this.searchHistory.filter(item => item.category === category.id).length;
      const favoriteCount = this.favorites.filter(item => item.category === category.id).length;
      return {
        name: category.name,
        count: searchCount + favoriteCount,
        color: category.color
      };
    });
    return stats.sort((a, b) => b.count - a.count);
  }

  // STATISTICS METHODS

  getStats(): {
    totalSearches: number;
    uniqueWords: number;
    streak: number;
    wordsPerDay: number;
    mostActiveDay: string;
  } {
    const uniqueWordsCount = this.stats.uniqueWords.size;
    
    // Calculate words per day
    const dates = Object.keys(this.stats.searchDates);
    const totalDays = Math.max(dates.length, 1);
    const wordsPerDay = this.stats.totalSearches / totalDays;
    
    // Find most active day
    let mostActiveDay = 'Sunday';
    let maxCount = 0;
    
    const dayCountMap: Record<string, number> = {
      'Sunday': 0, 'Monday': 0, 'Tuesday': 0, 'Wednesday': 0, 
      'Thursday': 0, 'Friday': 0, 'Saturday': 0
    };
    
    // Count searches by day of week
    for (const dateStr of dates) {
      const date = new Date(dateStr);
      const day = date.toLocaleDateString('en-US', { weekday: 'long' });
      const count = this.stats.searchDates[dateStr];
      dayCountMap[day] = (dayCountMap[day] || 0) + count;
      
      if (dayCountMap[day] > maxCount) {
        maxCount = dayCountMap[day];
        mostActiveDay = day;
      }
    }
    
    return {
      totalSearches: this.stats.totalSearches,
      uniqueWords: uniqueWordsCount,
      streak: this.stats.consecutiveDays,
      wordsPerDay: parseFloat(wordsPerDay.toFixed(1)),
      mostActiveDay
    };
  }

  // WORD OF THE DAY METHODS

  getWordOfTheDay(): { word: string; partOfSpeech: string; definition: string } {
    if (!this.wordOfTheDay) {
      this.checkAndUpdateWordOfTheDay();
    }
    
    return {
      word: this.wordOfTheDay?.word || 'perspicacious',
      partOfSpeech: this.wordOfTheDay?.partOfSpeech || 'adjective',
      definition: this.wordOfTheDay?.definition || 
        'having or showing an ability to notice and understand things that are difficult or not obvious'
    };
  }

  // PRIVATE HELPER METHODS

  private loadDataFromStorage(): void {
    if (!this.userId) return;
    
    try {
      // Load search history
      const historyStr = localStorage.getItem(`searchHistory_${this.userId}`);
      if (historyStr) {
        this.searchHistory = JSON.parse(historyStr);
      }
      
      // Load favorites
      const favoritesStr = localStorage.getItem(`favorites_${this.userId}`);
      if (favoritesStr) {
        this.favorites = JSON.parse(favoritesStr);
      }
      
      // Load categories
      const categoriesStr = localStorage.getItem(`categories_${this.userId}`);
      if (categoriesStr) {
        this.categories = JSON.parse(categoriesStr);
      }
      
      // Load stats
      const statsStr = localStorage.getItem(`stats_${this.userId}`);
      if (statsStr) {
        const parsedStats = JSON.parse(statsStr);
        this.stats = {
          ...parsedStats,
          uniqueWords: new Set(parsedStats.uniqueWords || [])
        };
      } else {
        // Initialize stats with unique words from history
        const uniqueWords = new Set(this.searchHistory.map(item => item.word));
        this.stats.uniqueWords = uniqueWords;
        this.stats.totalSearches = this.searchHistory.length;
        
        // Initialize search dates
        const dateCounts: Record<string, number> = {};
        for (const item of this.searchHistory) {
          const dateStr = new Date(item.timestamp).toISOString().split('T')[0];
          dateCounts[dateStr] = (dateCounts[dateStr] || 0) + 1;
        }
        this.stats.searchDates = dateCounts;
      }
      
      // Load word of the day
      const wordOfTheDayStr = localStorage.getItem('wordOfTheDay');
      if (wordOfTheDayStr) {
        this.wordOfTheDay = JSON.parse(wordOfTheDayStr);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  private saveDataToStorage(): void {
    if (!this.userId) return;
    
    try {
      // Save search history
      localStorage.setItem(`searchHistory_${this.userId}`, JSON.stringify(this.searchHistory));
      
      // Save favorites
      localStorage.setItem(`favorites_${this.userId}`, JSON.stringify(this.favorites));
      
      // Save categories
      localStorage.setItem(`categories_${this.userId}`, JSON.stringify(this.categories));
      
      // Save stats
      const serializableStats = {
        ...this.stats,
        uniqueWords: Array.from(this.stats.uniqueWords)
      };
      localStorage.setItem(`stats_${this.userId}`, JSON.stringify(serializableStats));
      
      // Save word of the day
      if (this.wordOfTheDay) {
        localStorage.setItem('wordOfTheDay', JSON.stringify(this.wordOfTheDay));
      }
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  }

  private checkAndUpdateStreak(): void {
    if (!this.stats.lastSearchDate) return;
    
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Check if already searched today
    if (this.stats.searchDates[todayStr]) {
      // Already searched today, streak is current
      return;
    }
    
    // Check if searched yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (this.stats.searchDates[yesterdayStr]) {
      // Searched yesterday, streak continues
      this.stats.consecutiveDays = (this.stats.consecutiveDays || 0) + 1;
    } else {
      // Didn't search yesterday, streak resets
      this.stats.consecutiveDays = 1;
    }
    
    this.saveDataToStorage();
  }

  private checkAndUpdateWordOfTheDay(): void {
    const today = new Date().toISOString().split('T')[0];
    
    // If we already have a word for today, use it
    if (this.wordOfTheDay && this.wordOfTheDay.date === today) {
      return;
    }
    
    // Otherwise, pick a new word of the day
    // In a real app, you might fetch this from an API
    const wordList = [
      { word: 'perspicacious', partOfSpeech: 'adjective', definition: 'having or showing an ability to notice and understand things that are difficult or not obvious' },
      { word: 'ephemeral', partOfSpeech: 'adjective', definition: 'lasting for a very short time' },
      { word: 'serendipity', partOfSpeech: 'noun', definition: 'the occurrence and development of events by chance in a happy or beneficial way' },
      { word: 'eloquent', partOfSpeech: 'adjective', definition: 'fluent or persuasive in speaking or writing' },
      { word: 'ubiquitous', partOfSpeech: 'adjective', definition: 'present, appearing, or found everywhere' },
      { word: 'pernicious', partOfSpeech: 'adjective', definition: 'having a harmful effect, especially in a gradual or subtle way' },
      { word: 'mellifluous', partOfSpeech: 'adjective', definition: 'sweet or musical; pleasant to hear' }
    ];
    
    // Get a word based on the date to ensure consistency
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const wordIndex = dayOfYear % wordList.length;
    
    this.wordOfTheDay = {
      ...wordList[wordIndex],
      date: today
    };
    
    this.saveDataToStorage();
  }
}

// Export a singleton instance
export const userDataService = new UserDataService(); 