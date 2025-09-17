// Accessibility Improvement Component

import React from 'react';

// Skip to main content for screen readers
export const SkipToMain = () => (
  <a 
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-blue-600 text-white px-4 py-2 rounded z-50"
  >
    Skip to main content
  </a>
);

// Improved focus management
export const FocusManager = ({ children }) => (
  <div 
    className="focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
    onKeyDown={(e) => {
      // Enhanced keyboard navigation
      if (e.key === 'Escape') {
        e.target.blur();
      }
    }}
  >
    {children}
  </div>
);

// Screen reader announcements
export const ScreenReaderAnnouncement = ({ message, priority = 'polite' }) => (
  <div 
    aria-live={priority}
    aria-atomic="true"
    className="sr-only"
  >
    {message}
  </div>
);

// Enhanced button with proper ARIA
export const AccessibleButton = ({ 
  children, 
  onClick, 
  ariaLabel, 
  disabled = false,
  variant = 'primary',
  ...props 
}) => (
  <button
    onClick={onClick}
    aria-label={ariaLabel}
    disabled={disabled}
    role="button"
    tabIndex={disabled ? -1 : 0}
    className={`
      px-4 py-2 rounded-lg font-medium transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
      disabled:opacity-50 disabled:cursor-not-allowed
      ${variant === 'primary' ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
      ${variant === 'secondary' ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' : ''}
    `}
    {...props}
  >
    {children}
  </button>
);

// Form validation with screen reader support
export const AccessibleInput = ({ 
  label, 
  error, 
  required = false, 
  type = 'text',
  ...props 
}) => {
  const inputId = `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `error-${inputId}` : undefined;

  return (
    <div className="space-y-1">
      <label 
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
        {required && <span aria-label="required" className="text-red-500 ml-1">*</span>}
      </label>
      
      <input
        id={inputId}
        type={type}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={errorId}
        className={`
          w-full px-3 py-2 border rounded-md
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${error ? 'border-red-500' : 'border-gray-300'}
        `}
        {...props}
      />
      
      {error && (
        <div 
          id={errorId}
          role="alert"
          className="text-sm text-red-600"
        >
          {error}
        </div>
      )}
    </div>
  );
};

export default {
  SkipToMain,
  FocusManager,
  ScreenReaderAnnouncement,
  AccessibleButton,
  AccessibleInput
};