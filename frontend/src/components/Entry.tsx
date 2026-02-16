import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SpiralAnimation } from './ui/spiral-animation';

export default function Entry() {
    const navigate = useNavigate();
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowButton(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="fixed inset-0 w-full h-full overflow-hidden bg-black">
            {/* Spiral Animation from Frontend.md */}
            <div className="absolute inset-0">
                <SpiralAnimation />
            </div>

            {/* Codevengers Multiverse Entry */}
            <div
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 transition-all duration-1000 ease-out text-center ${showButton ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            >
                <h1 className="text-white text-4xl md:text-5xl font-bold tracking-wider mb-4 glow-text">
                    CODEVENGERS
                </h1>
                <p className="text-white/60 text-lg mb-8 tracking-widest">
                    Enter the Multiverse
                </p>
                <button
                    onClick={() => navigate('/login')}
                    className="px-8 py-3 text-white text-lg tracking-widest uppercase font-light border border-white/30 rounded-lg transition-all duration-500 hover:bg-white/10 hover:border-white/50 hover:tracking-[0.3em] animate-pulse"
                >
                    Begin Journey
                </button>
            </div>
        </div>
    );
}
