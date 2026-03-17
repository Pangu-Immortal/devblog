"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import dynamic from "next/dynamic";

const MermaidDiagram = dynamic(() => import("./MermaidDiagram"), { ssr: false });

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        table: ({ children }) => (
          <div className="my-4 overflow-x-auto">
            <table className="w-full border-collapse text-sm">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-gray-50 border-b-2 border-gray-200">{children}</thead>
        ),
        th: ({ children }) => (
          <th className="px-4 py-2.5 text-left font-semibold text-gray-700 border-b border-gray-200">{children}</th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-2 text-gray-600 border-b border-gray-100">{children}</td>
        ),
        code: ({ className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || "");
          const lang = match?.[1];
          const codeStr = String(children).replace(/\n$/, "");
          if (lang === "mermaid") {
            return <MermaidDiagram chart={codeStr} />;
          }
          if (lang) {
            return (
              <div className="my-4 rounded-lg overflow-hidden bg-gray-900">
                <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
                  <span className="text-xs text-gray-400">{lang}</span>
                </div>
                <pre className="p-4 overflow-x-auto">
                  <code className="text-sm text-gray-100 font-mono">{codeStr}</code>
                </pre>
              </div>
            );
          }
          return (
            <code className="bg-gray-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
              {children}
            </code>
          );
        },
        h2: ({ children }) => (
          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b border-gray-100">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">{children}</h3>
        ),
        h4: ({ children }) => (
          <h4 className="text-base font-semibold text-gray-700 mt-4 mb-2">{children}</h4>
        ),
        p: ({ children }) => (
          <p className="text-[15px] text-gray-700 leading-7 mb-4">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="list-disc list-inside space-y-1 mb-4 text-gray-700 text-[15px]">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal list-inside space-y-1 mb-4 text-gray-700 text-[15px]">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="leading-7">{children}</li>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-blue-400 bg-blue-50 pl-4 py-2 my-4 text-gray-700 text-sm italic">
            {children}
          </blockquote>
        ),
        a: ({ href, children }) => (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            {children}
          </a>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-gray-900">{children}</strong>
        ),
        hr: () => <hr className="my-6 border-gray-200" />,
        img: ({ src, alt }) => (
          <figure className="my-6">
            <img src={src} alt={alt || ""} className="rounded-lg w-full" />
            {alt && <figcaption className="text-center text-xs text-gray-400 mt-2">{alt}</figcaption>}
          </figure>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
