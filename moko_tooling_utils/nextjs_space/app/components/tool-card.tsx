'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Star, Share2, Copy, Check } from 'lucide-react'
import { useState } from 'react'

interface ToolCardProps {
  tool: {
    id: string
    name: string
    url: string
    description: string
    shortcut?: string
    categoryId: string
    categoryName: string
    categoryIcon: string
  }
  isFavorite: boolean
  onToggleFavorite: (toolId: string) => void
  index: number
  viewMode: 'grid' | 'list'
}

const neonColors = [
  'var(--neon-cyan)',
  'var(--neon-magenta)',
  'var(--neon-yellow)',
  'var(--neon-green)',
  'var(--neon-blue)',
  'var(--neon-orange)',
]

export default function ToolCard({ tool, isFavorite, onToggleFavorite, index, viewMode }: ToolCardProps) {
  const [copied, setCopied] = useState(false)
  const accentColor = neonColors[index % neonColors.length]
  
  const handleShare = async () => {
    const shareData = {
      title: tool?.name ?? '',
      text: tool?.description ?? '',
      url: tool?.url ?? '',
    }
    
    if (navigator?.share && navigator?.canShare?.(shareData)) {
      try {
        await navigator?.share?.(shareData)
      } catch (error) {
        console.error('Error sharing:', error)
        handleCopy()
      }
    } else {
      handleCopy()
    }
  }
  
  const handleCopy = () => {
    navigator?.clipboard?.writeText?.(tool?.url ?? '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  const handleCardClick = () => {
    if (tool?.url) {
      window?.open?.(tool?.url, '_blank', 'noopener,noreferrer')
    }
  }
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
      className={`group relative glass-card p-6 transition-smooth hover:scale-[1.01] ${
        viewMode === 'list' ? 'flex flex-col sm:flex-row sm:items-center gap-6' : ''
      }`}
      onClick={handleCardClick}
    >
      {/* Indicador de categoría sutil */}
      <div 
        className="absolute top-4 left-4 px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 border border-white/10 backdrop-blur-md"
        style={{
          backgroundColor: `${accentColor}15`,
          color: accentColor,
        }}
      >
        <span>{tool?.categoryIcon ?? ''}</span>
        <span className="uppercase tracking-wider opacity-80">{tool?.categoryName ?? ''}</span>
      </div>
      
      {/* Contenido */}
      <div className={`flex-1 ${viewMode === 'list' ? '' : 'pt-8'}`}>
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-lg font-bold text-white group-hover:text-[var(--accent-cyan)] transition-smooth leading-tight">
            {tool?.name ?? ''}
          </h3>
          <div className="p-2 rounded-full bg-white/5 opacity-0 group-hover:opacity-100 transition-smooth">
            <ExternalLink className="text-[var(--accent-cyan)]" size={16} strokeWidth={2.5} />
          </div>
        </div>
        
        <p className="text-[var(--text-secondary)] text-xs font-medium mb-4 line-clamp-2 leading-relaxed">
          {tool?.description ?? ''}
        </p>
        
        {tool?.shortcut && (
          <div className="inline-block px-2.5 py-1 rounded-md bg-white/5 border border-white/5 text-[var(--accent-yellow)] text-[10px] font-bold mb-4 tracking-wide uppercase">
            {tool?.shortcut}
          </div>
        )}
        
        {/* Acciones */}
        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              onToggleFavorite(tool?.id ?? '')
            }}
            className={`p-2 rounded-xl transition-smooth ${
              isFavorite
                ? 'bg-[var(--accent-yellow)] shadow-lg shadow-yellow-500/20'
                : 'bg-white/5 hover:bg-white/10 border border-white/5'
            }`}
          >
            <Star 
              className={isFavorite ? 'fill-black text-black' : 'text-white/40'} 
              size={14} 
              strokeWidth={3} 
            />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation()
              handleShare()
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 transition-smooth"
          >
            {copied ? (
              <Check className="text-green-400" size={14} strokeWidth={3} />
            ) : (
              <Share2 className="text-white/40" size={14} strokeWidth={3} />
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>

  )
}
