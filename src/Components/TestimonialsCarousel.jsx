import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const testimonials = [
  {
    id: 1,
    name: "Derick D'souza",
    title: "Good and value for money",
    text: "Nice colours and the quality is also good. Bought it for pups specially as they are black and that they are safe and visible. It was Apt as they are 5 black pups now easy to identify with colour of their collar.",
    rating: 4
  },
  {
    id: 2,
    name: "Manish",
    title: "Reflective collars",
    text: "I would recommend people to buy this reflective collars for their Pets, as well as for street dogs, it's of good quality and what makes it more unique is they come QR Scanners which helps us to keep track of our dogs.",
    rating: 5
  },
  {
    id: 3,
    name: "AJAY PARMAR",
    title: "Quality",
    text: "I have ordered so many belts for stray dogs, but this one is amazingly built. These are very high-quality reflective belts and do not tear.",
    rating: 5
  },
  {
    id: 4,
    name: "Riya B.",
    title: "Recommend",
    text: "I bought it for my streeties and it's been over 2 months and the collars are going strong. No tear, no peeling. Highly recommended.",
    rating: 4
  },
  {
    id: 5,
    name: "Padma",
    title: "Highly recommended",
    text: "One of the best purchases for pets. I have bought it thrice and all dogs in my street including my own wear it. It's reflects light and great for night use. Quality is good for the price. Do get it, you won't regret it",
    rating: 5
  }
];

export default function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const containerRef = useRef(null);
  const autoPlayRef = useRef(null);

  // Create infinite array by cycling through testimonials
  const getVisibleTestimonials = useCallback(() => {
    const visibleCount = 3; // Only show center and immediate neighbors to prevent background movement
    const result = [];
    
    for (let i = -1; i <= 1; i++) { // Only positions -1, 0, 1
      const index = (currentIndex + i + testimonials.length) % testimonials.length;
      result.push({
        ...testimonials[index],
        position: i, // -1, 0, 1
        originalIndex: index
      });
    }
    
    return result;
  }, [currentIndex]);

  const nextSlide = useCallback(() => {
    if (isAnimating) return;
    setDirection(1);
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 1000);
  }, [isAnimating]);

  const prevSlide = useCallback(() => {
    if (isAnimating) return;
    setDirection(-1);
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 1000);
  }, [isAnimating]);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayRef.current = setInterval(nextSlide, 4000);
    } else {
      clearInterval(autoPlayRef.current);
    }

    return () => clearInterval(autoPlayRef.current);
  }, [isAutoPlaying, nextSlide]);

  // Pause auto-play on card hover
  const handleCardMouseEnter = () => setIsAutoPlaying(false);
  const handleCardMouseLeave = () => setIsAutoPlaying(true);

  // Touch handlers for swipe functionality
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
    
    setTouchStart(0);
    setTouchEnd(0);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  const visibleTestimonials = getVisibleTestimonials();

  return (
    <div 
      className="bg-orange-200 py-6 sm:py-8 px-4 text-[#003333] font-sans relative overflow-hidden rounded-b-xl"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-yellow-200 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-8xl mx-auto relative">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-6 sm:mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
            What Our <span className="text-green-600">Happy Pet Parents</span> Say
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            Real reviews from customers who trust our quality pet products
          </p>
        </motion.div>

        {/* Carousel Container */}
        <div className="relative flex items-center justify-center min-h-[240px] sm:min-h-[280px] md:min-h-[300px]">
          <div className="flex items-center justify-center w-full relative">
            <motion.div 
              className="flex items-center justify-center relative w-full"
              style={{ perspective: '1200px' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {visibleTestimonials.map((testimonial, index) => {
                const { position } = testimonial;
                const isCenter = position === 0;
                const isVisible = Math.abs(position) <= 1; // Only show center and immediate neighbors
                
                // Enhanced responsive positioning with smooth sliding
                const getTransform = (pos) => {
                  const isMobile = window.innerWidth < 640;
                  const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
                  
                  let baseOffset;
                  if (isMobile) {
                    baseOffset = 280;
                  } else if (isTablet) {
                    baseOffset = 340;
                  } else {
                    baseOffset = 400;
                  }
                  
                  // Smooth positioning without extra sliding offset
                  const x = pos * baseOffset;
                  
                  // Enhanced scale with more visible transitions
                  const scale = pos === 0 ? 1.1 : pos === -1 || pos === 1 ? 0.75 : 0.6;
                  const z = pos === 0 ? 0 : pos === -1 || pos === 1 ? -80 : -160;
                  const rotateY = pos * 5; // Increased rotation for more dramatic effect
                  const blur = Math.abs(pos) > 1 ? 0.3 : 0;
                  
                  return { x, scale, z, rotateY, blur };
                };
                
                const transform = getTransform(position);
                
                // Don't render cards that are too far from center to prevent background movement
                if (Math.abs(position) > 1) {
                  return null;
                }
                
                return (
                  <motion.div
                    key={`testimonial-${testimonial.originalIndex}`}
                    className={`absolute flex-shrink-0 ${
                      isCenter ? 'z-50' : Math.abs(position) === 1 ? 'z-30' : 'z-10'
                    }`}
                    animate={{
                      x: transform.x,
                      scale: transform.scale,
                      z: transform.z,
                      rotateY: transform.rotateY,
                      opacity: isVisible ? (isCenter ? 1 : 0.7) : 0,
                      filter: `blur(${transform.blur}px)`
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 180, // Reduced for more visible animation
                      damping: 15, // Reduced for more bounce
                      mass: 1.0, // Increased for more dramatic scaling
                      duration: 1.0 // Extended for more visible transition
                    }}
                    style={{
                      transformOrigin: 'center center',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    <motion.div className={`
                      relative rounded-2xl md:rounded-3xl overflow-hidden 
                      w-56 sm:w-64 md:w-72 
                      h-[200px] sm:h-[240px] md:h-[280px]
                      ${isCenter 
                        ? 'bg-white shadow-2xl ring-1 ring-gray-200' 
                        : 'bg-white/90 backdrop-blur-sm shadow-lg'
                      }
                      transition-all duration-500 cursor-pointer group
                      ${!isCenter ? 'hover:scale-95 hover:shadow-xl' : ''}
                    `}
                    onClick={() => !isCenter && setCurrentIndex(testimonial.originalIndex)}
                    onMouseEnter={handleCardMouseEnter}
                    onMouseLeave={handleCardMouseLeave}
                    whileHover={!isCenter ? { 
                      scale: 0.9, 
                      rotateY: position > 0 ? -5 : 5,
                      transition: { duration: 0.3 }
                    } : {}}
                    whileTap={!isCenter ? { 
                      scale: 0.85,
                      transition: { duration: 0.1 }
                    } : {}}
                    >
                      {/* Compact Card Header */}
                      <div className="relative h-12 sm:h-14 md:h-16 bg-gradient-to-br from-green-400 via-green-500 to-emerald-600">
                        {/* Decorative Elements */}
                        <div className="absolute top-2 right-2 w-8 sm:w-10 h-8 sm:h-10 bg-white/10 rounded-full blur-lg"></div>
                        <div className="absolute bottom-2 left-2 w-6 sm:w-8 h-6 sm:h-8 bg-white/10 rounded-full blur-md"></div>
                        
                        {/* Customer Icon */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      
                      {/* Content */}
                      <div className="pt-3 sm:pt-4 px-3 sm:px-4 md:px-5 pb-3 sm:pb-4 flex flex-col h-[calc(100%-3rem)] sm:h-[calc(100%-3.5rem)] md:h-[calc(100%-4rem)]">
                        <div className="text-center mb-2 sm:mb-3">
                          <motion.h3 
                            className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                          >
                            {testimonial.name}
                          </motion.h3>
                          
                          {/* Dynamic Rating */}
                          <div className="flex justify-center items-center gap-0.5 mb-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <motion.svg
                                key={i}
                                className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                  i < testimonial.rating ? 'text-amber-400' : 'text-gray-300'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 + i * 0.1 }}
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </motion.svg>
                            ))}
                            <span className="ml-1 text-xs text-gray-500 font-medium">{testimonial.rating}.0</span>
                          </div>
                          
                          <motion.div
                            className="inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                          >
                            {testimonial.title}
                          </motion.div>
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-center">
                          <motion.p 
                            className="text-gray-700 text-xs sm:text-sm leading-relaxed text-center line-clamp-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                          >
                            "{testimonial.text}"
                          </motion.p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>

        {/* Modern Navigation Controls */}
        <motion.button
          onClick={prevSlide}
          disabled={isAnimating}
          className={`absolute left-2 sm:left-4 md:left-8 top-1/2 transform -translate-y-1/2 bg-white/95 backdrop-blur-md hover:bg-white text-gray-700 hover:text-green-600 border border-gray-200 hover:border-green-300 rounded-xl sm:rounded-2xl w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center z-50 shadow-lg group transition-all duration-300 ${
            isAnimating ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label="Previous testimonial"
          whileHover={!isAnimating ? { scale: 1.05, x: -3 } : {}}
          whileTap={!isAnimating ? { scale: 0.95 } : {}}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <motion.svg 
            className="w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            initial={{ x: 0 }}
            whileHover={{ x: -2 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </motion.svg>
        </motion.button>
        
        <motion.button
          onClick={nextSlide}
          disabled={isAnimating}
          className={`absolute right-2 sm:right-4 md:right-8 top-1/2 transform -translate-y-1/2 bg-white/95 backdrop-blur-md hover:bg-white text-gray-700 hover:text-green-600 border border-gray-200 hover:border-green-300 rounded-xl sm:rounded-2xl w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center z-50 shadow-lg group transition-all duration-300 ${
            isAnimating ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label="Next testimonial"
          whileHover={!isAnimating ? { scale: 1.05, x: 3 } : {}}
          whileTap={!isAnimating ? { scale: 0.95 } : {}}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <motion.svg 
            className="w-4 h-4 sm:w-6 sm:h-6 md:w-7 md:h-7" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            initial={{ x: 0 }}
            whileHover={{ x: 2 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </motion.svg>
        </motion.button>

        {/* Modern Pagination */}
        <div className="flex justify-center items-center gap-1.5 sm:gap-2 mt-4 sm:mt-6 mb-4 sm:mb-6">
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                if (!isAnimating) {
                  setDirection(index > currentIndex ? 1 : -1);
                  setIsAnimating(true);
                  setCurrentIndex(index);
                  setTimeout(() => setIsAnimating(false), 1000);
                }
              }}
              className={`relative transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-6 sm:w-10 h-1.5 sm:h-2 bg-green-600 rounded-full' 
                  : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-gray-300 hover:bg-green-400 rounded-full'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              disabled={isAnimating}
            >
              {index === currentIndex && (
                <motion.div
                  className="absolute inset-0 bg-green-400 rounded-full"
                  layoutId="activeIndicator"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
            </motion.button>
          ))}
        </div>

        {/* Modern Control Panel - Positioned below pagination */}
        <motion.div 
          className="flex justify-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <div className="flex items-center gap-3 bg-white/95 backdrop-blur-md border border-gray-200 rounded-xl px-4 py-2 shadow-lg">
            {/* Timer Display */}
            <div className="text-xs text-gray-600 font-medium">
              {currentIndex + 1} / {testimonials.length}
            </div>
            
            {/* Auto-play Toggle */}
            <motion.button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`relative overflow-hidden rounded-lg p-2 transition-all duration-300 ${
                isAutoPlaying 
                  ? 'bg-green-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              aria-label={isAutoPlaying ? 'Pause auto-play' : 'Resume auto-play'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                initial={false}
                animate={{ rotate: isAutoPlaying ? 0 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isAutoPlaying ? (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </motion.div>
            </motion.button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
