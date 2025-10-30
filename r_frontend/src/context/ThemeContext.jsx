// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { storage } from '../utils';

// const ThemeContext = createContext(null);

// export const ThemeProvider = ({ children }) => {
//   const [theme, setTheme] = useState(() => {
//     // Get theme from localStorage or default to 'light'
//     return storage.get('theme', 'light');
//   });
  
//   const [fontSize, setFontSize] = useState(() => {
//     return storage.get('fontSize', 'medium');
//   });

//   // Apply theme to document
//   useEffect(() => {
//     const root = window.document.documentElement;
    
//     // Remove old theme classes
//     root.classList.remove('light', 'dark');
    
//     // Add new theme class
//     root.classList.add(theme);
    
//     // Store in localStorage
//     storage.set('theme', theme);
//   }, [theme]);

//   // Apply font size to document
//   useEffect(() => {
//     const root = window.document.documentElement;
    
//     // Remove old font size classes
//     root.classList.remove('text-sm', 'text-base', 'text-lg');
    
//     // Add new font size class
//     const fontSizeClass = {
//       small: 'text-sm',
//       medium: 'text-base',
//       large: 'text-lg',
//     }[fontSize];
    
//     root.classList.add(fontSizeClass);
    
//     // Store in localStorage
//     storage.set('fontSize', fontSize);
//   }, [fontSize]);

//   // Toggle theme
//   const toggleTheme = () => {
//     setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
//   };

//   // Set specific theme
//   const setLightTheme = () => setTheme('light');
//   const setDarkTheme = () => setTheme('dark');

//   // Increase font size
//   const increaseFontSize = () => {
//     if (fontSize === 'small') setFontSize('medium');
//     else if (fontSize === 'medium') setFontSize('large');
//   };

//   // Decrease font size
//   const decreaseFontSize = () => {
//     if (fontSize === 'large') setFontSize('medium');
//     else if (fontSize === 'medium') setFontSize('small');
//   };

//   // Reset font size
//   const resetFontSize = () => setFontSize('medium');

//   const value = {
//     theme,
//     fontSize,
//     isDarkMode: theme === 'dark',
//     toggleTheme,
//     setLightTheme,
//     setDarkTheme,
//     increaseFontSize,
//     decreaseFontSize,
//     resetFontSize,
//   };

//   return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
// };

// // Custom hook to use theme context
// export const useTheme = () => {
//   const context = useContext(ThemeContext);
//   if (!context) {
//     throw new Error('useTheme must be used within a ThemeProvider');
//   }
//   return context;
// };