import React, { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import betterindia from '../assets/collaborators/betterindia.webp';
import petspoint from '../assets/collaborators/petspoint.png';
import missionrabies from '../assets/collaborators/missionrabies.webp';
import peepalfarm from '../assets/collaborators/peoplefarm.webp'
import peopleforanimal from '../assets/collaborators/peopleforanimal.webp';
import wvs from '../assets/collaborators/wvs.webp';
import toi from '../assets/collaborators/toi.webp';
import hachik from '../assets/collaborators/hachik.png';
import petforce from '../assets/collaborators/petforce.png';
import urbanpawz from '../assets/collaborators/urbanpawz.png';
import sheeshah from '../assets/collaborators/sheeshaskennelfoundation.png';
import pawtech from '../assets/collaborators/pawtechshield.png';
import waggingtails from '../assets/collaborators/waggingtails.png';
import guruprasad from '../assets/collaborators/guruprasad.png';
import bezubaansathi from '../assets/collaborators/bezubaansathi.png';
import petsneed from '../assets/collaborators/petsneed.png';
import peoplesgroup from '../assets/collaborators/peoplesgroup.png';

const Collaborators = () => {
  const sliderRef = useRef(null);
  const controls = useAnimation();
  const [currentX, setCurrentX] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  // Real collaborator data - using Better India logo for all for now
  const collaborators = [
    { id: 1, name: 'PetsPoint', logo: petspoint },
    { id: 2, name: 'The Better India', logo: betterindia },
    { id: 3, name: 'Mission Rabies', logo: missionrabies },
    { id: 4, name: 'Peepal Farm', logo: peepalfarm },
    { id: 5, name: 'People for Animal', logo: peopleforanimal },
    { id: 6, name: 'WVS', logo: wvs },
    { id: 7, name: 'Times Of India', logo: toi },
    { id: 8, name: 'Hachik Animal Rescue', logo: hachik },
    { id: 9, name: 'Pet Force', logo: petforce },
    { id: 10, name: 'Urban Pawz', logo: urbanpawz },
    { id: 11, name: 'The Sheeshah\'s Kennel Foundation', logo: sheeshah },
    { id: 12, name: 'Pawtech Shield', logo: pawtech },
    { id: 13, name: 'Wagging Tails', logo: waggingtails },
    { id: 14, name: 'Guru Prasad Agency', logo: guruprasad },
    { id: 15, name: 'Bezubaan Sathi', logo: bezubaansathi },
    { id: 16, name: 'Pets Need', logo: petsneed },
    { id: 17, name: 'The People\'s Group', logo: peoplesgroup },
  ];

  // Duplicate the array to create seamless infinite scroll
  const duplicatedCollaborators = [...collaborators, ...collaborators];

  useEffect(() => {
    // Calculate the width needed to show all logos
    // Each logo card is approximately 200px (w-48) + 32px spacing (space-x-8) = 232px per item
    // For 22 items: 22 * 232 = 5104px
    const totalWidth = 22 * 232; // Approximate width for all 22 logos
    
    // Start the continuous animation
    const startAnimation = () => {
      controls.start({
        x: [currentX, -totalWidth],
        transition: {
          repeat: Infinity,
          repeatType: "loop",
          duration: 60 * (totalWidth + Math.abs(currentX)) / totalWidth, // Slower for more logos
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
    <section className="py-8 sm:py-12 md:py-16 bg-gradient-to-br from-orange-50 via-pink-50 to-orange-100 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-8 sm:mb-10 md:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-600 via-pink-600 to-orange-700 bg-clip-text text-transparent mb-2 sm:mb-3 md:mb-4">
            Our Trusted Partners
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-700 max-w-2xl mx-auto px-2">
            We're proud to collaborate with these amazing companies who share our passion for making a difference in the lives of pets and their families.
          </p>
        </motion.div>

        {/* Infinite Scroll Slider */}
        <div className="relative mb-8 sm:mb-12 md:mb-16">
          <motion.div
            ref={sliderRef}
            className="flex space-x-4 sm:space-x-6 md:space-x-8"
            animate={controls}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {duplicatedCollaborators.map((collaborator, index) => (
              <motion.div
                key={`${collaborator.id}-${index}`}
                className="flex-shrink-0 bg-white/80 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-3 sm:p-4 md:p-6 border border-orange-100 hover:border-orange-200"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.2 }}
              >
                <img
                  src={collaborator.logo}
                  alt={`${collaborator.name} logo`}
                  className="w-32 h-16 sm:w-40 sm:h-20 md:w-48 md:h-24 object-contain mx-auto filter grayscale hover:grayscale-0 transition-all duration-300"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/200x100/F97316/white?text=${collaborator.name.replace(/\s+/g, '+')}`;
                  }}
                />
                <p className="text-center mt-2 sm:mt-3 text-xs sm:text-sm font-medium text-gray-700">
                  {collaborator.name}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>


        {/* Call to Action - Compact for mobile */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center bg-gradient-to-r from-orange-500 via-pink-500 to-orange-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 text-white shadow-xl mx-2 sm:mx-0"
        >
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 md:mb-4">
            Want to Partner With Us?
          </h3>
          <p className="mb-4 sm:mb-5 md:mb-6 max-w-xl mx-auto opacity-90 text-sm sm:text-base md:text-lg px-2">
            Join our growing network of partners and help us create a better world for pets everywhere.
          </p>
          <motion.button
            className="bg-white text-orange-600 px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 rounded-full font-bold text-sm sm:text-base md:text-lg hover:bg-orange-50 transition-colors duration-300 shadow-lg"
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
