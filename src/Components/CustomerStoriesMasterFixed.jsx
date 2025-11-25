import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaHeart } from "react-icons/fa";

import IMG1 from "../assets/CustomerStories/Dog.JPG";
import IMG2 from "../assets/CustomerStories/dog3.JPG";
import IMG3 from "../assets/CustomerStories/Cow.JPG";
import IMG4 from "../assets/CustomerStories/dog2.JPG";
import pinkStar from "../assets/pinkstar.png";

gsap.registerPlugin(ScrollTrigger);

const CustomerStoriesMasterFixed = () => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardsRef = useRef([]);
  const starsRef = useRef([]);

  const stories = [
    { image: IMG1 },
    { image: IMG2 },
    { image: IMG3 },
    { image: IMG4 }
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const section = sectionRef.current;
      const title = titleRef.current;
      const subtitle = subtitleRef.current;
      const cards = cardsRef.current.filter(Boolean);

      if (!section) return;

      // Start with visible elements
      gsap.set([title, subtitle], { opacity: 1, y: 0 });
      gsap.set(cards, { opacity: 1, y: 0, scale: 1 });

      // Scroll-triggered animation
      ScrollTrigger.create({
        trigger: section,
        start: "top 90%",
        once: true,
        onEnter: () => {
          // Title with rotation and scale
          gsap.fromTo(title, 
            { y: -30, opacity: 0, scale: 0.9, rotation: -5 },
            { y: 0, opacity: 1, scale: 1, rotation: 0, duration: 2, ease: "back.out(1.7)" }
          );

          // Subtitle with slide and fade
          gsap.fromTo(subtitle, 
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.2 }
          );

          // Cards entrance animation with rotation
          gsap.fromTo(cards, 
            { 
              y: 20, 
              opacity: 0, 
              scale: 0.9,
              rotation: (i) => [3, -2, 4, -3][i] || 2
            },
            { 
              y: 0, 
              opacity: 1, 
              scale: 1,
              rotation: (i) => [1, -0.5, 1.5, -1][i] || 0,
              duration: 0.5, 
              ease: "power2.out",
              delay: 0.3,
              stagger: 0.1
            }
          );

          // Continuous subtle rotation
          gsap.to(cards, {
            rotation: (i) => [2, -1, 2.5, -1.5][i] || 0,
            duration: 6,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            delay: 1
          });

          // Pink star rotation animation
          const stars = starsRef.current.filter(Boolean);
          gsap.to(stars, {
            rotation: 360,
            duration: 8,
            ease: "none",
            repeat: -1,
            stagger: 0.2
          });
        },
      });

      // Card hover effects
      cards.forEach((card, index) => {
        if (!card) return;
        
        card.addEventListener('mouseenter', () => {
          gsap.to(card, {
            scale: 1.05,
            y: -4,
            rotation: (index % 2 === 0) ? 3 : -3,
            duration: 0.3,
            ease: "power2.out"
          });
        });

        card.addEventListener('mouseleave', () => {
          gsap.to(card, {
            scale: 1,
            y: 0,
            rotation: [1, -0.5, 1.5, -1][index] || 0,
            duration: 0.3,
            ease: "power2.out"
          });
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sectionRef} className="relative py-8 overflow-hidden bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 rounded-t-xl mt-5">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-5 left-5 w-20 h-20 bg-teal-200/20 rounded-full blur-2xl"></div>
        <div className="absolute bottom-5 right-5 w-24 h-24 bg-blue-200/20 rounded-full blur-2xl"></div>
        
        {/* Rotating Pink Stars */}
        <img
          ref={el => starsRef.current[0] = el}
          src={pinkStar}
          alt="decorative star"
          className="absolute top-4 right-4 sm:top-8 sm:right-8 md:top-12 md:right-16 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 opacity-50 sm:opacity-60 md:opacity-70"
        />
        <img
          ref={el => starsRef.current[1] = el}
          src={pinkStar}
          alt="decorative star"
          className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 md:bottom-12 md:left-16 w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 opacity-40 sm:opacity-50 md:opacity-60"
        />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block mb-2">
            <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-semibold tracking-wide uppercase">
              Success Stories
            </span>
          </div>
          <h2 
            ref={titleRef}
            className="text-3xl sm:text-4xl lg:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 mb-3 leading-tight"
          >
            Customer Stories
          </h2>
          <p 
            ref={subtitleRef}
            className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed"
          >
            Real stories from pet parents who trust us with their beloved companions.
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 max-w-4xl mx-auto">
          {stories.map((story, index) => (
            <div
              key={index}
              ref={el => cardsRef.current[index] = el}
              className="group relative cursor-pointer transition-all duration-300 aspect-square"
            >
              {/* Modern card */}
              <div className="relative w-full h-full bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500">
                {/* Image */}
                <div className="relative w-full h-full overflow-hidden">
                  <img
                    src={story.image}
                    alt={`Customer story ${index + 1}`}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                  />
                  
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Color overlay */}
                  <div className={`absolute inset-0 ${['bg-pink-500/15', 'bg-blue-500/15', 'bg-green-500/15', 'bg-purple-500/15'][index]} opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay`}></div>
                </div>

                {/* Story number */}
                <div className="absolute top-2 left-2 w-6 h-6 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md text-gray-800 font-bold text-xs z-10 group-hover:bg-teal-500 group-hover:text-white transition-all duration-300">
                  <span>{index + 1}</span>
                </div>
                
                {/* Heart icon */}
                <div className="absolute top-2 right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transform scale-0 group-hover:scale-100 transition-all duration-300 z-10">
                  <FaHeart className="text-white text-xs" />
                </div>
                
                {/* Hover text */}
                <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white font-semibold text-xs mb-1 drop-shadow-lg">
                      Story #{index + 1}
                    </h3>
                    <p className="text-white/90 text-xs drop-shadow">
                      Love & joy
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Call to action */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/50">
            <span className="text-lg">🐾</span>
            <span className="text-gray-700 font-medium text-sm">Share your pet's story!</span>
            <span className="text-lg">✨</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerStoriesMasterFixed;
