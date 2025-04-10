'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { FiBook, FiLogOut, FiUser } from 'react-icons/fi';

export default function Dashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  const handleLogout = async () => {
    setIsLoading(true);
    await signOut({ redirect: false });
    router.push('/auth/login');
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-300">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-12 bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 mb-4">
          <FiBook className="h-8 w-8 text-purple-600 dark:text-purple-300" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome to WordWise</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">Your personal dictionary</p>
      </div>
      
      <Card className="w-full max-w-md mb-6">
        <div className="p-2 flex items-center justify-center mb-4">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-purple-100 dark:bg-purple-900">
            <FiUser className="h-10 w-10 text-purple-600 dark:text-purple-300" />
          </div>
        </div>
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {session?.user?.name || 'User'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">{session?.user?.email}</p>
        </div>
        
        <Button onClick={handleLogout} isLoading={isLoading} className="w-full flex items-center justify-center">
          <FiLogOut className="mr-2" /> Sign Out
        </Button>
      </Card>
      
      <Card className="w-full max-w-md">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <div className="p-4 text-center bg-gray-100 dark:bg-gray-800 rounded-md">
          <p className="text-gray-600 dark:text-gray-400">You haven't looked up any words yet!</p>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Use the search box above to find words and their definitions.
          </p>
        </div>
      </Card>
    </div>
  );
} 