import React, { useState, useEffect, useCallback } from 'react';

// --- SLIDER DATA ---
// Aap yahan apne offers, images, aur links ko easily change kar sakte hain
const slides = [
    {
        imageUrl: 'https://i.imgur.com/gK9p2tK.png', // Image of a happy dog wearing a reflective collar
        title: 'Monsoon Sale!',
        subtitle: 'Flat 25% Off on All Reflective Collars',
        buttonText: 'Shop Now',
        buttonLink: '/shop',
        bgColor: 'bg-blue-500',
    },
    {
        imageUrl: 'https://i.imgur.com/xV3AnpD.png', // Image of a woman handcrafting a Pawsitivity collar
        title: 'Support a Cause',
        subtitle: 'Every Purchase Empowers a Woman',
        buttonText: 'Learn More',
        buttonLink: '/about',
        bgColor: 'bg-pink-500',
    },
    {
        imageUrl: 'https://i.imgur.com/wY5fJ0Q.png', // Image of a cow with a reflective collar at night
        title: 'Safety for All Animals',
        subtitle: 'Bulk Discount on Cattle Collars',
        buttonText: 'View Offers',
        buttonLink: '/shop',
        bgColor: 'bg-green-500',
    },
];

const OfferSlider = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd, setTouchEnd] = useState(null);

    // Minimum swipe distance for touch gestures
    const minSwipeDistance = 50;

    const nextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
    }, []);

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
    };
    
    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    // Touch handlers for mobile swipe
    const onTouchStart = (e) => {
        setTouchEnd(null);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return;
        
        const distance = touchStart - touchEnd;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe) nextSlide();
        if (isRightSwipe) prevSlide();
    };

    useEffect(() => {
        const autoPlay = setInterval(nextSlide, 5000); // Har 5 seconds mein slide change hogi
        return () => clearInterval(autoPlay);
    }, [nextSlide]);

    return (
        // Slider ko full-width karne ke liye `max-w-7xl mx-auto` hata dein aur `w-full` use karein
        <div className="w-full font-sans">
            <div 
                className="relative overflow-hidden"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                {/* --- Slides Container --- */}
                <div 
                    className="flex transition-transform duration-700 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                    {slides.map((slide, index) => (
                        <div key={index} className={`flex-shrink-0 w-full h-[160px] flex items-center justify-between px-6 sm:px-10 text-white ${slide.bgColor}`}>
                            {/* --- Text Content --- */}
                            <div className="z-10 w-1/2">
                                <h2 className="text-xl sm:text-2xl font-extrabold mb-1">{slide.title}</h2>
                                <p className="text-xs sm:text-sm mb-3">{slide.subtitle}</p>
                                <a 
                                    href={slide.buttonLink}
                                    className="bg-white text-gray-900 font-bold py-1 px-4 rounded-md text-xs sm:text-sm hover:bg-gray-200 transition-colors"
                                >
                                    {slide.buttonText}
                                </a>
                            </div>
                            {/* --- Image Content --- */}
                            <div className="w-1/2 flex items-center justify-center">
                               <img src={slide.imageUrl} alt={slide.title} className="max-h-[120px] object-contain"/>
                            </div>
                        </div>
                    ))}
                </div>

                {/* --- Navigation Arrows --- */}
                <button 
                    onClick={prevSlide}
                    className="absolute top-1/2 left-3 transform -translate-y-1/2 bg-black/20 text-white p-2 rounded-full hover:bg-black/40 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button 
                    onClick={nextSlide}
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 bg-black/20 text-white p-2 rounded-full hover:bg-black/40 transition-colors"
                >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>

                {/* --- Navigation Dots --- */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
                    {slides.map((_, index) => (
                        <button 
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2 h-2 rounded-full transition-colors ${currentIndex === index ? 'bg-white' : 'bg-white/50'}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default OfferSlider;