import React, { useState, useRef, useEffect } from 'react'

interface ScrollableContentProps {
  children: React.ReactNode
  className?: string
  maxHeight?: string
}

const ScrollableContent: React.FC<ScrollableContentProps> = ({
  children,
  className = "",
  maxHeight = "400px"
}) => {
  const [showScrollButtons, setShowScrollButtons] = useState(false)
  const [canScrollUp, setCanScrollUp] = useState(false)
  const [canScrollDown, setCanScrollDown] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const checkScrollPosition = () => {
    if (!containerRef.current) return
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    setCanScrollUp(scrollTop > 0)
    setCanScrollDown(scrollTop < scrollHeight - clientHeight - 1)
  }

  const scrollUp = () => {
    if (!containerRef.current) return
    containerRef.current.scrollBy({ top: -20, behavior: 'smooth' })
  }

  const scrollDown = () => {
    if (!containerRef.current) return
    containerRef.current.scrollBy({ top: 20, behavior: 'smooth' })
  }

  const startScrolling = (direction: 'up' | 'down') => {
    setIsScrolling(true)
    const scrollFunction = direction === 'up' ? scrollUp : scrollDown
    
    // Initial scroll
    scrollFunction()
    
    // Continue scrolling while hovering
    scrollIntervalRef.current = setInterval(() => {
      scrollFunction()
    }, 100)
  }

  const stopScrolling = () => {
    setIsScrolling(false)
    if (scrollIntervalRef.current) {
      clearInterval(scrollIntervalRef.current)
      scrollIntervalRef.current = null
    }
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      checkScrollPosition()
    }

    const handleResize = () => {
      checkScrollPosition()
    }

    container.addEventListener('scroll', handleScroll)
    window.addEventListener('resize', handleResize)
    
    // Initial check
    checkScrollPosition()

    return () => {
      container.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    // Check if content is scrollable
    if (containerRef.current) {
      const { scrollHeight, clientHeight } = containerRef.current
      setShowScrollButtons(scrollHeight > clientHeight)
    }
  }, [children])

  return (
    <div className={`relative ${className}`}>
      <div
        ref={containerRef}
        className="overflow-y-auto"
        style={{ maxHeight }}
        onScroll={checkScrollPosition}
      >
        {children}
      </div>
      
      {/* Scroll Buttons */}
      {showScrollButtons && (
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col gap-1">
          {/* Up Button */}
          <button
            className={`w-8 h-8 rounded-full bg-black/80 hover:bg-black/90 text-white/80 hover:text-white transition-all duration-200 flex items-center justify-center ${
              canScrollUp ? 'opacity-100' : 'opacity-50 cursor-not-allowed'
            } ${isScrolling ? 'scale-95' : 'scale-100'}`}
            onClick={canScrollUp ? scrollUp : undefined}
            onMouseEnter={canScrollUp ? () => startScrolling('up') : undefined}
            onMouseLeave={stopScrolling}
            disabled={!canScrollUp}
            title="Scroll up"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m18 15-6-6-6 6"/>
            </svg>
          </button>
          
          {/* Down Button */}
          <button
            className={`w-8 h-8 rounded-full bg-black/80 hover:bg-black/90 text-white/80 hover:text-white transition-all duration-200 flex items-center justify-center ${
              canScrollDown ? 'opacity-100' : 'opacity-50 cursor-not-allowed'
            } ${isScrolling ? 'scale-95' : 'scale-100'}`}
            onClick={canScrollDown ? scrollDown : undefined}
            onMouseEnter={canScrollDown ? () => startScrolling('down') : undefined}
            onMouseLeave={stopScrolling}
            disabled={!canScrollDown}
            title="Scroll down"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}

export default ScrollableContent 