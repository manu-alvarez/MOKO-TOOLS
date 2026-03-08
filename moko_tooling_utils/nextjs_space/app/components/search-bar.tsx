'use client'

import { Search, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface SearchBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  size?: 'default' | 'large'
}

export default function SearchBar({ searchQuery, onSearchChange, size = 'default' }: SearchBarProps) {
  const isLarge = size === 'large'

  return (
    <div className="relative w-full max-w-3xl mx-auto group">
      <div className={`absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-transform duration-300 ${isLarge ? 'scale-125 ml-2' : ''}`}>
        <Search className={`text-[var(--text-secondary)] group-focus-within:text-[var(--accent-cyan)] transition-colors duration-300 ${isLarge ? 'w-6 h-6' : 'w-5 h-5'}`} />
      </div>
      
      <input
        type="text"
        placeholder={isLarge ? "¿Qué herramienta necesitas hoy?" : "Buscar herramienta o atajo..."}
        className={`w-full bg-[var(--glass-bg)] border border-[var(--glass-border)] text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[var(--accent-cyan)] focus:border-transparent transition-all duration-300 glass-card
          ${isLarge ? 'py-5 pl-16 pr-14 text-lg sm:text-2xl font-medium rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_40px_rgba(0,242,255,0.15)] focus:shadow-[0_0_60px_rgba(0,242,255,0.2)]' : 'py-3 pl-12 pr-10 text-base rounded-full'}
        `}
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      
      <AnimatePresence>
        {searchQuery && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => onSearchChange('')}
            className={`absolute inset-y-0 right-0 flex items-center justify-center text-[var(--text-secondary)] hover:text-white transition-colors
              ${isLarge ? 'pr-6' : 'pr-4'}
            `}
          >
            <div className={`bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors ${isLarge ? 'p-2' : 'p-1'}`}>
              <X className={isLarge ? 'w-5 h-5' : 'w-4 h-4'} />
            </div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}
