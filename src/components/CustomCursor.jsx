import { useEffect, useState } from 'react';
import { motion, useSpring } from 'motion/react';

const CustomCursor = () => {
    const [isHovering, setIsHovering] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false);

    const cursorX = useSpring(0, { damping: 20, stiffness: 250 });
    const cursorY = useSpring(0, { damping: 20, stiffness: 250 });


    useEffect(() => {
        const pointerMedia = window.matchMedia('(pointer: fine)');
        const reduceMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');

        const updateEnabled = () => {
            setIsEnabled(pointerMedia.matches && !reduceMotionMedia.matches);
        };

        updateEnabled();
        pointerMedia.addEventListener('change', updateEnabled);
        reduceMotionMedia.addEventListener('change', updateEnabled);

        return () => {
            pointerMedia.removeEventListener('change', updateEnabled);
            reduceMotionMedia.removeEventListener('change', updateEnabled);
        };
    }, []);

    useEffect(() => {
        if (!isEnabled) return;

        const rafRef = { current: null };
        const latestRef = { current: { x: 0, y: 0 } };
        const hoveringRef = { current: false };

        const applyPosition = () => {
            rafRef.current = null;
            cursorX.set(latestRef.current.x);
            cursorY.set(latestRef.current.y);
        };

        const moveMouse = (e) => {
            latestRef.current = { x: e.clientX - 10, y: e.clientY - 10 };
            if (rafRef.current) return;
            rafRef.current = requestAnimationFrame(applyPosition);
        };

        const handleHover = (e) => {
            const isNowHovering = !!e.target.closest('a, button, .cursor-pointer');
            if (hoveringRef.current === isNowHovering) return;
            hoveringRef.current = isNowHovering;
            setIsHovering(isNowHovering);
        };

        window.addEventListener('pointermove', moveMouse, { passive: true });
        window.addEventListener('pointerover', handleHover, { passive: true });
        window.addEventListener('pointerout', handleHover, { passive: true });

        return () => {
            window.removeEventListener('pointermove', moveMouse);
            window.removeEventListener('pointerover', handleHover);
            window.removeEventListener('pointerout', handleHover);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [cursorX, cursorY, isEnabled]);

    if (!isEnabled) return null;

    return (
        <motion.div
            className="custom-cursor hidden lg:block"
            style={{
                x: cursorX,
                y: cursorY,
                scale: isHovering ? 2.5 : 1,
                willChange: 'transform',
            }}
        />
    );
};

export default CustomCursor;
