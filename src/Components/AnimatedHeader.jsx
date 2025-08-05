import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import greyPawImage from '../assets/grey_paw.png';

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedHeader() {
    const containerRef = useRef(null);
    const line1Ref = useRef(null);
    const line2Ref = useRef(null);
    const flickingRef = useRef(null);
    const charsRef = useRef([]);
    const pawsRef = useRef([]);

    useEffect(() => {
        const container = containerRef.current;
        const line1 = line1Ref.current;
        const line2 = line2Ref.current;
        const flicking = flickingRef.current;

        // Split text into individual characters for curved effect
        if (flicking) {
            const text = "FLICKING TAILS";
            flicking.innerHTML = '';
            
            text.split('').forEach((char, index) => {
                const span = document.createElement('span');
                span.textContent = char === ' ' ? '\u00A0' : char; // Non-breaking space
                span.className = 'char';
                span.style.display = 'inline-block';
                
                // Add extra spacing around the space character
                if (char === ' ') {
                    span.style.width = '0.8em';
                    span.style.textAlign = 'center';
                }
                
                flicking.appendChild(span);
                charsRef.current[index] = span;
            });
        }

        // Set initial states
        gsap.set([line1, line2], {
            y: 200,
            opacity: 0
        });

        // Create scroll-triggered timeline
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start: "top 98%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
            }
        });

        // Animate first line
        tl.to(line1, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out"
        })
        // Animate second line and start arc animation immediately
        .to(line2, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power2.out",
            onComplete: () => {
                // Start the arc animation immediately when text appears
                charsRef.current.forEach((char, index) => {
                    if (char) {
                        char.style.animation = `char-arc-${index} 1s ease-in-out infinite`;
                    }
                });
            }
        }, "-=0.4");

        // Paw print animation - from bottom left toward "FLICKING TAILS"
        const pawTimeline = gsap.timeline({ repeat: -1, repeatDelay: 2 });
        
        pawTimeline.fromTo(pawsRef.current, 
            {
                opacity: 0,
                scale: 0,
                x: 0,
                y: 0
            },
            {
                opacity: 1,
                scale: 1,
                x: 0,
                y: 0,
                duration: 2,
                stagger: {
                    amount: 1.5,
                    from: "start"
                },
                ease: "power2.inOut"
            }
        )
        .to(pawsRef.current, {
            opacity: 0,
            scale: 0.5,
            duration: 0.8,
            stagger: {
                amount: 0.6,
                from: "start"
            }
        }, "-=0.5");

        // Cleanup
        return () => {
            ScrollTrigger.getAll().forEach(trigger => {
                if (trigger.trigger === container) {
                    trigger.kill();
                }
            });
        };
    }, []);

    return (
        <div 
            ref={containerRef}
            className="w-full bg-black py-8 lg:py-12 overflow-hidden relative"
        >
            <div className="container mx-auto px-2 sm:px-4 text-center">
                {/* First Line */}
                <div 
                    ref={line1Ref}
                    className="mb-2 lg:mb-4"
                >
                    <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white tracking-wider">
                        WHERE CARE MEETS
                        <span className="inline-block ml-2 sm:ml-4 lg:ml-8 w-12 sm:w-16 md:w-20 lg:w-24 xl:w-32 h-1 bg-white align-middle"></span>
                    </h2>
                </div>

                {/* Second Line with FLICKING TAILS - Arc Animation */}
                <div 
                    ref={line2Ref}
                    className="relative h-32 sm:h-40 flex items-center justify-end pr-4 sm:pr-8"
                >
                    <div className="arc-animation-container">
                        <span 
                            ref={flickingRef}
                            className="flicking-text"
                        >
                            FLICKING TAILS
                        </span>
                    </div>
                </div>

                {/* Decorative paw prints */}
                <div className="absolute left-8 top-1/2 transform -translate-y-1/2 opacity-30">
                    <div className="text-4xl text-white">🐾</div>
                </div>
                <div className="absolute right-8 bottom-1/4 opacity-30">
                    <div className="text-3xl text-white">🐾</div>
                </div>
            </div>

            {/* Animated paw prints from bottom left to FLICKING TAILS */}
            <div className="absolute bottom-4 left-4 sm:bottom-8 sm:left-8 w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl h-32 sm:h-48 pointer-events-none">
                {/* Paw print trail toward the text - realistic walking pattern with parallel tracks */}
                {/* Left foot step 1 */}
                <img
                    ref={el => pawsRef.current[0] = el}
                    src={greyPawImage}
                    alt="paw print"
                    className="absolute w-4 h-4 sm:w-6 sm:h-6 opacity-0 rotate-45"
                    style={{ left: '5%', bottom: '10%' }}
                />
                {/* Right foot step 1 */}
                <img
                    ref={el => pawsRef.current[1] = el}
                    src={greyPawImage}
                    alt="paw print"
                    className="absolute w-4 h-4 sm:w-6 sm:h-6 opacity-0 rotate-45"
                    style={{ left: '15%', bottom: '5%' }}
                />
                {/* Left foot step 2 */}
                <img
                    ref={el => pawsRef.current[2] = el}
                    src={greyPawImage}
                    alt="paw print"
                    className="absolute w-4 h-4 sm:w-6 sm:h-6 opacity-0 rotate-48"
                    style={{ left: '20%', bottom: '35%' }}
                />
                {/* Right foot step 2 */}
                <img
                    ref={el => pawsRef.current[3] = el}
                    src={greyPawImage}
                    alt="paw print"
                    className="absolute w-4 h-4 sm:w-6 sm:h-6 opacity-0 rotate-48"
                    style={{ left: '30%', bottom: '20%' }}
                />
                {/* Left foot step 3 */}
                <img
                    ref={el => pawsRef.current[4] = el}
                    src={greyPawImage}
                    alt="paw print"
                    className="absolute w-4 h-4 sm:w-6 sm:h-6 opacity-0 rotate-55"
                    style={{ left: '38%', bottom: '50%' }}
                />
                {/* Right foot step 3 */}
                <img
                    ref={el => pawsRef.current[5] = el}
                    src={greyPawImage}
                    alt="paw print"
                    className="absolute w-4 h-4 sm:w-6 sm:h-6 opacity-0 rotate-57"
                    style={{ left: '50%', bottom: '34%' }}
                />
                {/* Left foot step 4 */}
                <img
                    ref={el => pawsRef.current[6] = el}
                    src={greyPawImage}
                    alt="paw print"
                    className="absolute w-4 h-4 sm:w-6 sm:h-6 opacity-0 rotate-58"
                    style={{ left: '55%', bottom: '65%' }}
                />
                {/* Right foot step 4 */}
                <img
                    ref={el => pawsRef.current[7] = el}
                    src={greyPawImage}
                    alt="paw print"
                    className="absolute w-4 h-4 sm:w-6 sm:h-6 opacity-0 rotate-54"
                    style={{ left: '67%', bottom: '42%' }}
                />
            </div>

            <style>{`
                .arc-animation-container {
                    position: relative;
                    width: auto;
                    height: 140px;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    perspective: 1000px;
                }
                
                .flicking-text {
                    font-size: clamp(1.75rem, 4.5vw, 3.5rem);
                    font-weight: bold;
                    color: #fbbf24;
                    transform-origin: center center;
                    display: inline-block;
                    letter-spacing: 0.2em;
                    position: relative;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                    white-space: nowrap;
                }
                
                .char {
                    display: inline-block;
                    transition: transform 0.3s ease;
                    color: #fbbf24;
                    text-shadow: 0 0 8px rgba(251, 191, 36, 0.4);
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                    backface-visibility: hidden;
                    transform-style: preserve-3d;
                    margin: 0 0.05em;
                    font-feature-settings: "kern" 1;
                }
                
                /* Perfect parabolic arc keyframes - mathematically calculated */
                @keyframes char-arc-0 {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    25% { transform: translateY(-64px) rotate(-25deg); }
                    50% { transform: translateY(0) rotate(0deg); }
                    75% { transform: translateY(64px) rotate(25deg); }
                }
                @keyframes char-arc-1 {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    25% { transform: translateY(-56px) rotate(-20deg); }
                    50% { transform: translateY(0) rotate(0deg); }
                    75% { transform: translateY(56px) rotate(20deg); }
                }
                @keyframes char-arc-2 {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    25% { transform: translateY(-48px) rotate(-15deg); }
                    50% { transform: translateY(0) rotate(0deg); }
                    75% { transform: translateY(48px) rotate(15deg); }
                }
                @keyframes char-arc-3 {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    25% { transform: translateY(-40px) rotate(-10deg); }
                    50% { transform: translateY(0) rotate(0deg); }
                    75% { transform: translateY(40px) rotate(10deg); }
                }
                @keyframes char-arc-4 {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    25% { transform: translateY(-32px) rotate(-7deg); }
                    50% { transform: translateY(0) rotate(0deg); }
                    75% { transform: translateY(32px) rotate(7deg); }
                }
                @keyframes char-arc-5 {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    25% { transform: translateY(-24px) rotate(-4deg); }
                    50% { transform: translateY(0) rotate(0deg); }
                    75% { transform: translateY(24px) rotate(4deg); }
                }
                @keyframes char-arc-6 {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    25% { transform: translateY(-16px) rotate(-2deg); }
                    50% { transform: translateY(0) rotate(0deg); }
                    75% { transform: translateY(16px) rotate(2deg); }
                }
                @keyframes char-arc-7 {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    25% { transform: translateY(-8px) rotate(0deg); }
                    50% { transform: translateY(0) rotate(0deg); }
                    75% { transform: translateY(8px) rotate(0deg); }
                }
                @keyframes char-arc-8 {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    25% { transform: translateY(-16px) rotate(2deg); }
                    50% { transform: translateY(0) rotate(0deg); }
                    75% { transform: translateY(16px) rotate(-2deg); }
                }
                @keyframes char-arc-9 {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    25% { transform: translateY(-24px) rotate(4deg); }
                    50% { transform: translateY(0) rotate(0deg); }
                    75% { transform: translateY(24px) rotate(-4deg); }
                }
                @keyframes char-arc-10 {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    25% { transform: translateY(-32px) rotate(7deg); }
                    50% { transform: translateY(0) rotate(0deg); }
                    75% { transform: translateY(32px) rotate(-7deg); }
                }
                @keyframes char-arc-11 {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    25% { transform: translateY(-40px) rotate(10deg); }
                    50% { transform: translateY(0) rotate(0deg); }
                    75% { transform: translateY(40px) rotate(-10deg); }
                }
                @keyframes char-arc-12 {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    25% { transform: translateY(-48px) rotate(15deg); }
                    50% { transform: translateY(0) rotate(0deg); }
                    75% { transform: translateY(48px) rotate(-15deg); }
                }
                @keyframes char-arc-13 {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    25% { transform: translateY(-56px) rotate(20deg); }
                    50% { transform: translateY(0) rotate(0deg); }
                    75% { transform: translateY(56px) rotate(-20deg); }
                }
                @keyframes char-arc-14 {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    25% { transform: translateY(-64px) rotate(25deg); }
                    50% { transform: translateY(0) rotate(0deg); }
                    75% { transform: translateY(64px) rotate(-25deg); }
                }
                
                @keyframes gradient-shift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
            `}</style>
        </div>
    );
}
