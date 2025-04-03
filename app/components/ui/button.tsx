'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/app/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

export default function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled,
  ...props
}: ButtonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary hover:bg-primary-dark text-white shadow';
      case 'secondary':
        return 'bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white';
      case 'outline':
        return 'border border-gray-300 hover:bg-gray-100 text-gray-700 dark:border-gray-600 dark:hover:bg-gray-800 dark:text-white';
      case 'ghost':
        return 'hover:bg-gray-100 text-gray-700 dark:hover:bg-gray-800 dark:text-gray-300';
      case 'link':
        return 'text-primary hover:underline p-0 h-auto shadow-none';
      default:
        return 'bg-primary hover:bg-primary-dark text-white shadow';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2.5 py-1.5 rounded';
      case 'md':
        return 'text-sm px-4 py-2 rounded-md';
      case 'lg':
        return 'text-base px-5 py-2.5 rounded-md';
      default:
        return 'text-sm px-4 py-2 rounded-md';
    }
  };

  const baseClasses = 'font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-gray-900';
  
  const widthClasses = fullWidth ? 'w-full' : '';
  
  const disabledClasses = (disabled || isLoading) 
    ? 'opacity-60 cursor-not-allowed'
    : 'cursor-pointer';

  return (
    <button
      className={cn(
        baseClasses,
        getVariantClasses(),
        getSizeClasses(),
        widthClasses,
        disabledClasses,
        variant !== 'link' ? 'inline-flex items-center justify-center' : 'inline-flex items-center',
        className
      )}
      disabled={disabled || isLoading}
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
} 