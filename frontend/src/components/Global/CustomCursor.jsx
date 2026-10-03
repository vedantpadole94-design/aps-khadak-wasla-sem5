import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const cursorXSpring = useSpring(cursorX, { damping: 25, stiffness: 700 });
  const cursorYSpring = useSpring(cursorY, { damping: 25, stiffness: 700 });

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return undefined;

    const moveCursor = (event) => {
      cursorX.set(event.clientX - 16);
      cursorY.set(event.clientY - 16);
      setIsVisible(true);
    };
    const handleMouseOver = (event) => {
      setIsHovering(Boolean(event.target.closest('a, button, input, textarea, select, [role="button"], .clickable')));
    };
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [cursorX, cursorY]);

  return (
    <>
      <motion.div
        className="custom-cursor-dot"
        style={{ x: cursorXSpring, y: cursorYSpring, opacity: isVisible ? 1 : 0 }}
        animate={{ scale: isHovering ? 2.5 : 1, backgroundColor: isHovering ? '#D4AF37' : '#1B2D4E' }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className="custom-cursor-ring"
        style={{ x: cursorXSpring, y: cursorYSpring, opacity: isVisible ? 1 : 0 }}
        animate={{ scale: isHovering ? 1.5 : 1, borderColor: isHovering ? '#D4AF37' : '#4A5D23' }}
        transition={{ duration: 0.3 }}
      />
    </>
  );
};

export default CustomCursor;
