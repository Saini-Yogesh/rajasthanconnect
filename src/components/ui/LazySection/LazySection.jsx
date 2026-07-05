import React, { useState, useEffect, useRef } from "react";

/**
 * LazySection defers child rendering until it is within 250px of the viewport.
 * Helps optimize Initial Page Load, Speed Index, and layout shift.
 *
 * @param {React.ReactNode} children
 * @param {string} [placeholderHeight="200px"] - Placeholder min-height before load to prevent cumulative layout shift (CLS).
 * @param {string} [className=""]
 */
export default function LazySection({
  children,
  placeholderHeight = "200px",
  className = "",
}) {
  const [isIntersected, setIsIntersected] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (isIntersected) return;

    if (typeof window === "undefined" || !window.IntersectionObserver) {
      setIsIntersected(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersected(true);
        }
      },
      {
        rootMargin: "250px 0px", // Trigger loading 250px before entering viewport
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isIntersected]);

  return (
    <div
      ref={ref}
      className={className}
      style={!isIntersected ? { minHeight: placeholderHeight } : undefined}
    >
      {isIntersected ? children : null}
    </div>
  );
}
