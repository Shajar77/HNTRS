import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'motion/react';

const CustomCursor = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);

    const cursorX = useSpring(0, { damping: 20, stiffness: 250 });
    const cursorY = useSpring(0, { damping: 20, stiffness: 250 });

    useEffect(() => {
        const moveMouse = (e) => {
            cursorX.set(e.clientX - 10);
            cursorY.set(e.clientY - 10);
        };

        const handleHover = (e) => {
            if (e.target.closest('a, button, .cursor-pointer')) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', moveMouse);
        window.addEventListener('mouseover', handleHover);

        return () => {
            window.removeEventListener('mousemove', moveMouse);
            window.removeEventListener('mouseover', handleHover);
        };
    }, []);

    return (
        <motion.div
            className="custom-cursor hidden lg:block"
            style={{
                x: cursorX,
                y: cursorY,
                scale: isHovering ? 2.5 : 1,
            }}
        />
    );
};

export default CustomCursor;
