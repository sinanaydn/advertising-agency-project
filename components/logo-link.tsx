'use client';

import { useCallback, type MouseEvent, type ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface LogoLinkProps {
    children: ReactNode;
    className?: string;
}

/**
 * Reusable logo link component.
 * - Same page ("/"): smooth scroll to top.
 * - Other pages: navigate to "/" and set a sessionStorage flag
 *   so the home page scrolls to top after render.
 *
 * sessionStorage is preferred over query params because:
 * - No URL pollution (no ?scroll=top in the address bar)
 * - Automatically cleared when the tab closes
 * - Does not create extra history entries
 */
export function LogoLink({ children, className }: LogoLinkProps) {
    const router = useRouter();
    const pathname = usePathname();

    const scrollToTop = useCallback(() => {
        const prefersReduced = window.matchMedia(
            '(prefers-reduced-motion: reduce)'
        ).matches;

        window.scrollTo({
            top: 0,
            behavior: prefersReduced ? 'auto' : 'smooth',
        });
    }, []);

    const handleClick = useCallback(
        (e: MouseEvent<HTMLAnchorElement>) => {
            // Allow modifier-key clicks (new tab, etc.) to behave normally
            if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) {
                return;
            }

            e.preventDefault();

            if (pathname === '/') {
                // Already on home — just scroll
                scrollToTop();
            } else {
                // Set flag, then navigate
                try {
                    sessionStorage.setItem('scrollToTop', '1');
                } catch {
                    // sessionStorage unavailable (e.g. private browsing quota)
                }
                router.push('/');
            }
        },
        [pathname, router, scrollToTop]
    );

    return (
        <a href="/" onClick={handleClick} className={className}>
            {children}
        </a>
    );
}
