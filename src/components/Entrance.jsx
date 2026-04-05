import { useState, useEffect } from 'react';

const Entrance = ({ onComplete }) => {
    const [phase, setPhase] = useState('enter'); // 'enter' | 'exit' | 'done'

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        // Text slides in immediately, then exit after 800ms
        const exitTimer = setTimeout(() => setPhase('exit'), 800);
        // After exit animation completes (500ms), signal parent
        const doneTimer = setTimeout(() => {
            setPhase('done');
            document.body.style.overflow = '';
            onComplete();
        }, 1300);

        return () => {
            clearTimeout(exitTimer);
            clearTimeout(doneTimer);
            document.body.style.overflow = '';
        };
    }, [onComplete]);

    if (phase === 'done') return null;

    return (
        <div
            className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#111111]"
            style={{
                transform: phase === 'exit' ? 'translateY(-100%)' : 'translateY(0)',
                transition: phase === 'exit' ? 'transform 0.5s cubic-bezier(0.76, 0, 0.24, 1)' : 'none',
            }}
        >
            <div className="overflow-hidden flex items-baseline">
                <h1
                    className="font-2 text-[15vw] sm:text-[12vw] md:text-[10vw] text-[#F1F1F1] leading-none tracking-tighter entrance-text-slide"
                >
                    HNTRS
                </h1>
                <div
                    className="w-3 h-3 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-full bg-[#DE5127] ml-2 sm:ml-4 shadow-lg shadow-[#DE5127]/20 entrance-dot-pop"
                />
            </div>
        </div>
    );
};

export default Entrance;
