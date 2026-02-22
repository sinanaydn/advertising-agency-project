'use client';

import { useEffect } from 'react';

/**
 * Client component that checks sessionStorage for the scrollToTop flag
 * (set by LogoLink) and scrolls to top when found.
 * Placed inside app/page.tsx to trigger after home page renders.
 */
export function ScrollToTop() {
    useEffect(() => {
        try {
            if (sessionStorage.getItem('scrollToTop') === '1') {
                sessionStorage.removeItem('scrollToTop');

                const prefersReduced = window.matchMedia(
                    '(prefers-reduced-motion: reduce)'
                ).matches;

                // Small delay to ensure the DOM is fully painted
                requestAnimationFrame(() => {
                    window.scrollTo({
                        top: 0,
                        behavior: prefersReduced ? 'auto' : 'smooth',
                    });
                });
            }
        } catch {
            // sessionStorage unavailable
        }
    }, []);

    return null;
}
