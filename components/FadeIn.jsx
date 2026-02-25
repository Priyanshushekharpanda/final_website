import React, { useEffect, useRef, useState } from 'react';

export default function FadeIn({
    children,
    delay = 0,
    duration = 0.6,
    className = "",
    yOffset = 20,
    threshold = 0.1,
    onComplete
}) {
    const [isVisible, setIsVisible] = useState(false);
    const domRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    if (domRef.current) observer.unobserve(domRef.current);
                }
            });
        }, { threshold, rootMargin: "0px 0px -50px 0px" });

        const currentRef = domRef.current;
        if (currentRef) observer.observe(currentRef);

        return () => {
            if (currentRef) observer.unobserve(currentRef);
        };
    }, [threshold]);

    useEffect(() => {
        if (isVisible && onComplete) {
            const timer = setTimeout(onComplete, (delay + duration) * 1000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, delay, duration, onComplete]);

    return (
        <div
            ref={domRef}
            className={className}
            style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0)' : `translateY(${yOffset}px)`,
                transitionProperty: 'opacity, transform',
                transitionDuration: `${duration}s`,
                transitionDelay: `${delay}s`,
                transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)'
            }}
        >
            {children}
        </div>
    );
}