import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import betterIndiaLogo from '../assets/collaborators/better india logo.webp';

const Collaborators = () => {
  const sliderRef = useRef(null);
  const controls = useAnimation();
  const [currentX, setCurrentX] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  // Real collaborator data - using Better India logo for all for now
  const collaborators = [
    { id: 1, name: 'PetSmart', logo: betterIndiaLogo },
    { id: 2, name: 'Petco', logo: betterIndiaLogo },
    { id: 3, name: 'Blue Buffalo', logo: betterIndiaLogo },
    { id: 4, name: 'Hill\'s Pet Nutrition', logo: betterIndiaLogo },
    { id: 5, name: 'Royal Canin', logo: betterIndiaLogo },
    { id: 6, name: 'Purina', logo: betterIndiaLogo },
    { id: 7, name: 'ASPCA', logo: betterIndiaLogo },
    { id: 8, name: 'Banfield', logo: betterIndiaLogo },
    { id: 9, name: 'VCA Hospitals', logo: betterIndiaLogo },
    { id: 10, name: 'Chewy', logo: betterIndiaLogo },
    { id: 11, name: 'Mars Petcare', logo: betterIndiaLogo },
    { id: 12, name: 'Nestlé Purina', logo: betterIndiaLogo },
    { id: 13, name: 'Iams', logo: betterIndiaLogo },
    { id: 14, name: 'Eukanuba', logo: betterIndiaLogo },
    { id: 15, name: 'Wellness Pet Food', logo: betterIndiaLogo },
    { id: 16, name: 'Orijen', logo: betterIndiaLogo },
    { id: 17, name: 'Acana', logo: betterIndiaLogo },
    { id: 18, name: 'Taste of the Wild', logo: betterIndiaLogo },
    { id: 19, name: 'Natural Balance', logo: betterIndiaLogo },
    { id: 20, name: 'Merrick Pet Care', logo: betterIndiaLogo },
    { id: 21, name: 'Zuke\'s', logo: betterIndiaLogo },
    { id: 22, name: 'Freshpet', logo: betterIndiaLogo },
  ];

  // Duplicate the array to create seamless infinite scroll
  const duplicatedCollaborators = [...collaborators, ...collaborators];

  useEffect(() => {
    // Start the continuous animation
    const startAnimation = () => {
      controls.start({
        x: [currentX, -1760],
        transition: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 30 * (1760 + currentX) / 1760, // Adjust duration based on remaining distance
          ease: "linear",
        },
      });
    };

    if (isAnimating) {
      startAnimation();
    }
  }, [controls, currentX, isAnimating]);

  const handleMouseEnter = async () => {
    setIsAnimating(false);
    // Get current transform value
    if (sliderRef.current) {
      const transform = window.getComputedStyle(sliderRef.current).transform;
      if (transform && transform !== 'none') {
        const matrix = new DOMMatrix(transform);
        setCurrentX(matrix.m41);
      }
    }
    controls.stop();
  };

  const handleMouseLeave = () => {
    setIsAnimating(true);
  };

  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 via-pink-50 to-orange-100 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-orange-700 bg-clip-text text-transparent mb-4">
            Our Trusted Partners
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            We're proud to collaborate with these amazing companies who share our passion for making a difference in the lives of pets and their families.
          </p>
        </motion.div>

        {/* Infinite Scroll Slider */}
        <div className="relative mb-16">
          <motion.div
            ref={sliderRef}
            className="flex space-x-8"
            animate={controls}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {duplicatedCollaborators.map((collaborator, index) => (
              <motion.div
                key={`${collaborator.id}-${index}`}
                className="flex-shrink-0 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-orange-100 hover:border-orange-200"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src={collaborator.logo}
                  alt={`${collaborator.name} logo`}
                  className="w-48 h-24 object-contain mx-auto filter grayscale hover:grayscale-0 transition-all duration-300"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/200x100/F97316/white?text=${collaborator.name.replace(/\s+/g, '+')}`;
                  }}
                />
                <p className="text-center mt-3 text-sm font-medium text-gray-700">
                  {collaborator.name}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>


        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-orange-500 via-pink-500 to-orange-600 rounded-2xl p-8 text-white shadow-xl"
        >
          <h3 className="text-3xl font-bold mb-4">
            Want to Partner With Us?
          </h3>
          <p className="mb-6 max-w-xl mx-auto opacity-90 text-lg">
            Join our growing network of partners and help us create a better world for pets everywhere.
          </p>
          <motion.button
            className="bg-white text-orange-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-50 transition-colors duration-300 shadow-lg"
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
            whileTap={{ scale: 0.95 }}
          >
            Become a Partner
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default Collaborators;
