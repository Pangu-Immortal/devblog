"use client";

import { useEffect, useRef, useState } from "react";
import DOMPurify from "isomorphic-dompurify";

export default function MermaidDiagram({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const id = `mermaid-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    import("mermaid")
      .then(({ default: mermaid }) => {
        if (cancelled || !ref.current) return;
        mermaid.initialize({
          startOnLoad: false,
          theme: "neutral",
          fontFamily: "system-ui, sans-serif",
          securityLevel: "loose", // 允许 <br/> 等 HTML 标签
        });
        return mermaid.render(id, chart);
      })
      .then((result) => {
        if (!result || cancelled || !ref.current) return;
        // 使用 DOMPurify 清理 SVG 防止 XSS，再安全写入
        const sanitizedSvg = DOMPurify.sanitize(result.svg, {
          USE_PROFILES: { svg: true, svgFilters: true },
          ADD_TAGS: ["foreignObject"], // mermaid 使用 foreignObject 渲染文本
        });
        ref.current.innerHTML = sanitizedSvg;
      })
      .catch((err) => {
        console.warn("Mermaid render failed:", err);
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
      // 清理 mermaid 创建的临时 DOM 节点
      const tmpEl = document.getElementById(id);
      if (tmpEl) tmpEl.remove();
    };
  }, [chart]);

  if (error) {
    return (
      <div className="my-6 bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto">
        <pre className="text-xs text-gray-500 font-mono whitespace-pre-wrap">{chart}</pre>
      </div>
    );
  }

  return (
    <div ref={ref} className="my-6 flex justify-center overflow-x-auto">
      <div className="text-sm text-gray-400 py-4">图表加载中...</div>
    </div>
  );
}
