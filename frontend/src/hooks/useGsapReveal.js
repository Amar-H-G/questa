import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

export const useGsapReveal = () => {
  const scope = useRef(null);

  useLayoutEffect(() => {
    const context = gsap.context(() => {
      gsap.from('[data-reveal]', {
        y: 18,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out',
      });
    }, scope);

    return () => context.revert();
  }, []);

  return scope;
};
