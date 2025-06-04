import React, { useContext } from 'react';
import { Moon, Sun } from 'lucide-react';
import { ThemeContext } from '../contexts/ThemeContext';

const DarkModeToggle = () => {
  const { darkMode, setDarkMode } = useContext(ThemeContext);

  return (
    <div className="flex justify-end p-4">
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-500 text-white hover:bg-indigo-400 transition-colors shadow-sm"
      >
        {darkMode ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </button>
    </div>
  );
};

export default DarkModeToggle;
