import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useApp();

  return (
    <div className="fixed z-[100] bottom-6 right-6">
      <button
        type="button"
        onClick={toggleTheme}
        aria-pressed={theme === 'dark'}
        title={theme === 'dark' ? 'Bật light mode' : 'Bật dark mode'}
        className="w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-colors bg-white/95 dark:bg-[#1F1A17] border border-[#EDE0D0] dark:border-[#333] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#D4A853]"
      >
        {theme === 'dark' ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-[#6B5135]" />}
      </button>
    </div>
  );
}
