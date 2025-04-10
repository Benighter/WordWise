'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  ...props
}: ButtonProps) => {
  const baseClasses = "rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center transition-all";
  
  const variantClasses = {
    primary: "bg-purple-600 text-white hover:bg-purple-700 focus:ring-purple-500 border border-transparent",
    secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-500 border border-transparent dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600",
    outline: "bg-transparent text-purple-600 hover:bg-purple-50 border border-purple-600 focus:ring-purple-500 dark:text-purple-400 dark:hover:bg-gray-800"
  };
  
  const sizeClasses = {
    sm: "text-xs px-2.5 py-1.5",
    md: "text-sm px-4 py-2",
    lg: "text-base px-6 py-3"
  };
  
  const widthClass = fullWidth ? "w-full" : "";
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${
        isLoading ? "opacity-70 cursor-not-allowed" : ""
      } ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button; 