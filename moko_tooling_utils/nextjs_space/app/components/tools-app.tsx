'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Star, Grid3x3, List, Sparkles } from 'lucide-react'
import type { ToolsData, Tool, Category } from '@/lib/types'
import ToolCard from './tool-card'
import SearchBar from './search-bar'

interface ToolsAppProps {
  initialData: ToolsData
}


export default function ToolsApp({ initialData }: ToolsAppProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [favorites, setFavorites] = useState<string[]>([])
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [activeView, setActiveView] = useState<'home' | 'category' | 'search'>('home')
  const [activeCategory, setActiveCategory] = useState<Category | null>(null)

  // Cargar favoritos del localStorage al montar
  useEffect(() => {
    const savedFavorites = localStorage?.getItem?.('moko-favorites')
    if (savedFavorites) {
      try {
        const parsed = JSON.parse(savedFavorites ?? '[]')
        setFavorites(parsed ?? [])
      } catch (error) {
        console.error('Error loading favorites:', error)
      }
    }
  }, [])
  
  // Guardar favoritos en localStorage
  useEffect(() => {
    if (favorites?.length >= 0) {
      localStorage?.setItem?.('moko-favorites', JSON.stringify(favorites ?? []))
    }
  }, [favorites])
  
  // Toggle favorito
  const toggleFavorite = (toolId: string) => {
    setFavorites((prev) => {
      const current = prev ?? []
      if (current?.includes?.(toolId)) {
        return current?.filter?.((id) => id !== toolId) ?? []
      } else {
        return [...current, toolId]
      }
    })
  }

  // Lógica de búsqueda mejorada
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    if (query.trim()?.length > 0) {
      setActiveView('search')
    } else {
      setActiveView('home')
    }
  }

  const handleCategorySelect = (category: Category) => {
    setActiveCategory(category)
    setActiveView('category')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  
  // Filtrar herramientas (Search o Favoritos)
  const filteredTools = useMemo(() => {
    const categories = initialData?.categories ?? []
    let allTools: Array<Tool & { categoryId: string; categoryName: string; categoryIcon: string }> = []
    
    categories.forEach((category) => {
      category?.tools?.forEach((tool) => {
        allTools.push({
          ...tool,
          categoryId: category?.id ?? '',
          categoryName: category?.name ?? '',
          categoryIcon: category?.icon ?? '',
        })
      })
    })
    
    if (searchQuery) {
      // Normalizar texto para búsqueda inteligente (eliminar acentos)
      const normalizeText = (text: string) => text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
      const query = normalizeText(searchQuery)
      
      allTools = allTools.filter((tool) => {
        const name = normalizeText(tool?.name ?? '')
        const description = normalizeText(tool?.description ?? '')
        const shortcut = normalizeText(tool?.shortcut ?? '')
        const categoryName = normalizeText(tool?.categoryName ?? '')
        
        return (
          name.includes(query) ||
          description.includes(query) ||
          shortcut.includes(query) ||
          categoryName.includes(query)
        )
      })
    }
    
    if (showFavoritesOnly) {
      allTools = allTools.filter((tool) => favorites.includes(tool?.id ?? ''))
    }
    
    return allTools
  }, [initialData, searchQuery, favorites, showFavoritesOnly])
  
  const totalTools = useMemo(() => {
    return initialData?.categories?.reduce((acc, cat) => acc + (cat?.tools?.length ?? 0), 0) ?? 0
  }, [initialData])
  
  return (
    <div className="min-h-screen w-full relative overflow-x-hidden pb-10">
      
      {/* Header Compacto (Aparece al hacer scroll o en vistas específicas) */}
      <AnimatePresence>
        {activeView !== 'home' && (
          <motion.header 
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="sticky top-0 z-50 w-full glass-header"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
              <motion.button 
                className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                onClick={() => {
                  setSearchQuery('')
                  setActiveView('home')
                }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-magenta)] flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-black" strokeWidth={2.5} />
                </div>
                <div className="hidden sm:block text-left">
                  <h1 className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-[var(--text-secondary)] leading-none">
                    Moko Tooling
                  </h1>
                </div>
              </motion.button>
              
              <div className="flex-1 max-w-xl">
                <SearchBar searchQuery={searchQuery} onSearchChange={handleSearchChange} />
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <AnimatePresence mode="popLayout">
          {/* VISTA: HOME (Hero & Menú) */}
          {activeView === 'home' && !showFavoritesOnly && (
            <motion.div
              key="view-home"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center justify-center pt-10 sm:pt-20"
            >
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-[var(--accent-cyan)] to-[var(--accent-magenta)] flex items-center justify-center shadow-[0_0_60px_rgba(0,242,255,0.3)] mb-8 animate-float">
                <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-black" strokeWidth={2.5} />
              </div>
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/50">
                Moko Tooling & Utils
              </h1>
              <p className="text-[var(--text-secondary)] text-center text-lg sm:text-xl font-medium mb-12 max-w-2xl">
                Buscador Inteligente de {totalTools} Herramientas Web
              </p>
              
              <div className="w-full max-w-3xl mb-16 relative z-20">
                <SearchBar searchQuery={searchQuery} onSearchChange={handleSearchChange} />
              </div>

              {/* Menú de Categorías (Bento Grid Interactivo) */}
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {initialData?.categories?.map((category, index) => (
                  <motion.button
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleCategorySelect(category)}
                    className="glass-card text-left p-6 group flex flex-col h-full overflow-hidden relative"
                  >
                    {/* Brillo de fondo estético */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-[var(--accent-cyan)] opacity-0 group-hover:opacity-10 blur-[50px] transition-smooth rounded-full pointer-events-none" />
                    
                    <div className="text-4xl mb-4 transform group-hover:scale-110 transition-smooth origin-left">
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[var(--accent-cyan)] transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-[var(--text-secondary)] text-sm mb-4 flex-1">
                      {category.description || 'Haz clic para explorar.'}
                    </p>
                    <div className="flex items-center gap-2 mt-auto">
                      <div className="h-px flex-1 bg-white/10" />
                      <span className="text-[10px] uppercase font-bold text-white/40 tracking-widest bg-white/5 px-3 py-1 rounded-full">
                        {category?.tools?.length || 0} items
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* VISTA: CATEGORÍA DETALLE */}
          {activeView === 'category' && activeCategory && !showFavoritesOnly && (
            <motion.div
              key="view-category"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full"
            >
              <div className="mb-10 flex flex-col items-start">
                <button 
                  onClick={() => setActiveView('home')}
                  className="mb-6 flex items-center gap-2 text-sm font-bold text-white/50 hover:text-white transition-colors glass-card px-4 py-2 rounded-full"
                >
                  ← Volver al Menú
                </button>
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{activeCategory.icon}</span>
                  <div>
                    <h2 className="text-3xl font-extrabold text-white">{activeCategory.name}</h2>
                    <p className="text-[var(--text-secondary)]">{activeCategory?.tools?.length} herramientas en esta colección</p>
                  </div>
                </div>
              </div>

              <div className="bento-grid">
                {activeCategory?.tools?.map((tool, index) => (
                  <ToolCard 
                    key={tool.id}
                    tool={{...tool, categoryId: activeCategory.id, categoryName: activeCategory.name, categoryIcon: activeCategory.icon}}
                    isFavorite={favorites.includes(tool.id)}
                    onToggleFavorite={toggleFavorite}
                    index={index}
                    viewMode="grid"
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* VISTA: BÚSQUEDA o FAVORITOS */}
          {(activeView === 'search' || showFavoritesOnly) && (
            <motion.div
              key="view-search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="w-full"
            >
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    {showFavoritesOnly ? (
                      <>
                        <div className="p-2 bg-yellow-500/20 rounded-xl">
                          <Star className="text-yellow-400 fill-yellow-400" size={24} />
                        </div>
                        Tus Favoritos
                      </>
                    ) : (
                      <>Resultados para "{searchQuery}"</>
                    )}
                  </h2>
                  <p className="text-[var(--text-secondary)] mt-2">
                    Encontradas <span className="text-white font-bold">{filteredTools.length}</span> coincidencias
                  </p>
                </div>
                {/* Controles de vista omitidos en Menú para limpieza, pero disponibles en Búsqueda */}
                <div className="hidden sm:flex items-center gap-2 bg-[var(--glass-bg)] p-1 rounded-full border border-[var(--glass-border)]">
                  <button onClick={() => setViewMode('grid')} className={`p-2 rounded-full transition-all ${viewMode === 'grid' ? 'bg-white text-black' : 'text-white/60 hover:bg-white/10'}`}>
                    <Grid3x3 size={18} />
                  </button>
                  <button onClick={() => setViewMode('list')} className={`p-2 rounded-full transition-all ${viewMode === 'list' ? 'bg-white text-black' : 'text-white/60 hover:bg-white/10'}`}>
                    <List size={18} />
                  </button>
                </div>
              </div>

              {filteredTools.length > 0 ? (
                <div className={viewMode === 'grid' ? 'bento-grid' : 'flex flex-col gap-4'}>
                  {filteredTools.map((tool, index) => (
                    <ToolCard 
                      key={tool.id}
                      tool={tool}
                      isFavorite={favorites.includes(tool.id)}
                      onToggleFavorite={toggleFavorite}
                      index={index}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-32 rounded-[2rem] border border-dashed border-[var(--glass-border)]">
                  <div className="w-20 h-20 mx-auto rounded-3xl glass-card flex items-center justify-center mb-6 animate-float">
                    <Search className="w-8 h-8 text-[var(--text-secondary)]" />
                  </div>
                  <h2 className="text-xl font-bold text-white mb-2">Sin resultados</h2>
                  <p className="text-[var(--text-secondary)] text-sm">Prueba ajustando el texto o quitando acentos</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Botón Flotante Favoritos (Global) */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => {
          setShowFavoritesOnly(!showFavoritesOnly)
          if (!showFavoritesOnly) setActiveView('search')
          else if (searchQuery) setActiveView('search')
          else setActiveView('home')
        }}
        className={`fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 ${
          showFavoritesOnly ? 'bg-yellow-400 text-black shadow-yellow-500/30' : 'glass-card text-white hover:border-white/20'
        }`}
      >
        <Star className={showFavoritesOnly ? 'fill-black' : ''} size={24} strokeWidth={2.5} />
        {favorites.length > 0 && (
          <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-black">
            {favorites.length}
          </span>
        )}
      </motion.button>
      
      {/* Footer Minimalista */}
      <footer className="w-full mt-10 py-8 border-t border-[var(--glass-border)]">
        <div className="max-w-7xl mx-auto px-4 flex justify-center">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/5">
            <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Alvarez Consult</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-cyan)] animate-pulse" />
          </div>
        </div>
      </footer>
    </div>
  )
}

