"use client";

import { useEffect, useRef } from "react";
import DOMPurify from "isomorphic-dompurify";

export default function MermaidDiagram({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    import("mermaid").then(({ default: mermaid }) => {
      if (cancelled || !ref.current) return;
      mermaid.initialize({ startOnLoad: false, theme: "neutral", fontFamily: "system-ui" });
      const id = `mermaid-${Math.random().toString(36).slice(2, 8)}`;
      mermaid.render(id, chart).then(({ svg }) => {
        if (!cancelled && ref.current) {
          ref.current.innerHTML = DOMPurify.sanitize(svg, { USE_PROFILES: { svg: true } });
        }
      }).catch(() => {
        if (ref.current) ref.current.textContent = chart;
      });
    });
    return () => { cancelled = true; };
  }, [chart]);

  return <div ref={ref} className="my-6 flex justify-center overflow-x-auto" />;
}
