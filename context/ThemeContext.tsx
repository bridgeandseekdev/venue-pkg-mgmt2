// import React, { createContext, useState, useContext, useEffect } from 'react';

// interface ThemeContextType {
//   theme: 'light' | 'dark';
//   toggleTheme: () => void;
// }

// const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// export const ThemeProvider: React.FC<{ children: React.ReactNode}> = ({ children }) => {
//   const [theme, setTheme] = useState<'light' | 'dark'>('light');

//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
//     if(savedTheme) {
//       setTheme(savedTheme);
//     } else if(window.matchMedia('(prefers-color-scheme: dark)').matches) {
//       setTheme('dark');
//     }
//   }, []);

//   useEffect(() => {
//     // Update DOM and localStorage when theme changes
//     document.documentElement.classList.remove('light', 'dark');
//     document.documentElement.classList.add(theme);
//     localStorage.setItem('theme', theme);
//   }, [theme]);

//   const toggleTheme = () => {
//     setTheme(prev => prev === 'light' ? 'dark' : 'light');
//   };

//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// }

// export const useTheme = () => {
//   const context = useContext(ThemeContext);
//   if(!context) {
//     throw new Error('useTheme must be used within a ThemeProvider');
//   }
//   return context;
// }