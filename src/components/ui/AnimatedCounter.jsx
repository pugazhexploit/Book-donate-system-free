import React, { useEffect, useState } from 'react';

export function AnimatedCounter({ value, duration = 1.5, suffix = '' }) {
  // Extract number from string like '1,250+'
  const numericValue = typeof value === 'number' ? value : parseInt(String(value).replace(/[^0-9]/g, ''), 10) || 0;
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = numericValue;
    if (start === end) return;

    const totalSteps = 45;
    const stepDuration = (duration * 1000) / totalSteps;
    const increment = Math.ceil(end / totalSteps);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [numericValue, duration]);

  const hasPlus = String(value).includes('+');

  return (
    <span>
      {count.toLocaleString()}
      {hasPlus ? '+' : ''}
      {suffix}
    </span>
  );
}
