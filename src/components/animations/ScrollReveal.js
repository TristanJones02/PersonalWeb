import React, { useEffect, useRef } from 'react';
import { useInView } from 'react-intersection-observer';
import './ScrollReveal.css';

const ScrollReveal = ({ 
  children, 
  direction = 'up', 
  delay = 0, 
  duration = 0.6, 
  distance = 60,
  once = true,
  threshold = 0.1,
  className = ''
}) => {
  const scrollSpeedRef = useRef(0);
  const lastScrollY = useRef(0);
  const lastScrollTime = useRef(Date.now());
  const animationSpeed = useRef(1); // Speed multiplier

  const [ref, inView] = useInView({
    threshold: threshold,
    triggerOnce: once,
  });

  useEffect(() => {
    const handleScroll = () => {
      const currentTime = Date.now();
      const currentScrollY = window.scrollY;
      
      // Calculate scroll speed (pixels per millisecond)
      const timeDiff = currentTime - lastScrollTime.current;
      const scrollDiff = Math.abs(currentScrollY - lastScrollY.current);
      
      if (timeDiff > 0) {
        const currentSpeed = scrollDiff / timeDiff;
        scrollSpeedRef.current = currentSpeed;
        
        // Adjust animation speed based on scroll velocity
        // Fast scroll (>2 px/ms) = 3x faster animations
        // Medium scroll (>1 px/ms) = 2x faster animations
        // Slow scroll (<1 px/ms) = normal speed
        if (currentSpeed > 2) {
          animationSpeed.current = 3;
        } else if (currentSpeed > 1) {
          animationSpeed.current = 2;
        } else {
          animationSpeed.current = 1;
        }
      }
      
      lastScrollY.current = currentScrollY;
      lastScrollTime.current = currentTime;
    };

    // Throttle scroll listener for better performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, []);

  const animationClass = `scroll-reveal scroll-reveal-${direction}`;
  const visibleClass = inView ? 'scroll-reveal-visible' : '';
  const fastScrollClass = animationSpeed.current > 1 ? 'fast-scroll' : '';

  // Dynamic timing based on scroll speed
  const adjustedDuration = duration / animationSpeed.current;
  const adjustedDelay = delay / animationSpeed.current;

  const style = {
    '--animation-delay': `${Math.max(adjustedDelay, 50)}ms`, // Minimum 50ms delay
    '--animation-duration': `${Math.max(adjustedDuration, 0.2)}s`, // Minimum 0.2s duration
    '--animation-distance': `${distance}px`
  };

  return (
    <div 
      ref={ref} 
      className={`${animationClass} ${visibleClass} ${fastScrollClass} ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default ScrollReveal; 