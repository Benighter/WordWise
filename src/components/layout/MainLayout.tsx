import Header from './Header';
import { ReactNode } from 'react';
import { FiGithub, FiLinkedin, FiBriefcase } from 'react-icons/fi';
import Link from 'next/link';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        {children}
      </main>
      <footer className="bg-gradient-to-r from-purple-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 shadow-inner py-8">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left order-2 md:order-1">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                © {new Date().getFullYear()} WordWise Dictionary. All rights reserved.
              </p>
            </div>
            
            <div className="flex items-center space-x-5 order-1 md:order-2">
              <Link 
                href="https://github.com/Benighter" 
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-gray-700 shadow-sm hover:shadow-md hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-300 transform hover:-translate-y-1"
                aria-label="GitHub Profile"
              >
                <FiGithub className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-transform duration-300 group-hover:scale-110" />
              </Link>
              
              <Link 
                href="https://www.linkedin.com/in/bennet-nkolele-321285249/" 
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-gray-700 shadow-sm hover:shadow-md hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-300 transform hover:-translate-y-1"
                aria-label="LinkedIn Profile"
              >
                <FiLinkedin className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-transform duration-300 group-hover:scale-110" />
              </Link>
              
              <Link 
                href="https://react-personal-portfolio-alpha.vercel.app/" 
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-center w-12 h-12 rounded-full bg-white dark:bg-gray-700 shadow-sm hover:shadow-md hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all duration-300 transform hover:-translate-y-1"
                aria-label="Portfolio Website"
              >
                <FiBriefcase className="h-5 w-5 text-gray-600 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-transform duration-300 group-hover:scale-110" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 