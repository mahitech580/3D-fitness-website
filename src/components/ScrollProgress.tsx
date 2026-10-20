import { useEffect, useRef } from 'react';

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        frame = 0;
        const documentElement = document.documentElement;
        const available = Math.max(0, documentElement.scrollHeight - window.innerHeight);
        const position = Math.max(0, window.scrollY || documentElement.scrollTop);
        const progress = available > 0 ? position / available : 0;
        barRef.current?.style.setProperty('transform', 'scaleX(' + Math.min(1, progress) + ')');
      });
    };

    const observer = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(update);
    observer?.observe(document.documentElement);

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    window.addEventListener('pageshow', update);
    window.addEventListener('load', update);
    update();

    return () => {
      if (frame) cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      window.removeEventListener('pageshow', update);
      window.removeEventListener('load', update);
    };
  }, []);

  return <div ref={barRef} className="scroll-progress" aria-hidden="true" />;
}
