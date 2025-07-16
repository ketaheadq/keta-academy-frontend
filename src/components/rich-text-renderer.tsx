"use client"

import React from "react"
import { BlocksRenderer } from "@strapi/blocks-react-renderer"

interface RichTextRendererProps {
  content: any[] // Using any to avoid type conflicts with BlocksRenderer
  className?: string
}

const RichTextRenderer: React.FC<RichTextRendererProps> = ({ content, className = "" }) => {
  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      <BlocksRenderer
        content={content}
        blocks={{
          paragraph: ({ children }) => <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>,
          heading: ({ children, level }) => {
            const headingClasses = {
              1: "text-3xl font-bold text-gray-900 mb-6 mt-8",
              2: "text-2xl font-semibold text-gray-900 mb-4 mt-6",
              3: "text-xl font-semibold text-gray-900 mb-3 mt-5",
              4: "text-lg font-semibold text-gray-900 mb-2 mt-4",
              5: "text-base font-semibold text-gray-900 mb-2 mt-3",
              6: "text-sm font-semibold text-gray-900 mb-2 mt-2",
            }
            
            switch (level) {
              case 1:
                return <h1 className={headingClasses[level]}>{children}</h1>
              case 2:
                return <h2 className={headingClasses[level]}>{children}</h2>
              case 3:
                return <h3 className={headingClasses[level]}>{children}</h3>
              case 4:
                return <h4 className={headingClasses[level]}>{children}</h4>
              case 5:
                return <h5 className={headingClasses[level]}>{children}</h5>
              case 6:
                return <h6 className={headingClasses[level]}>{children}</h6>
              default:
                return <h2 className={headingClasses[2]}>{children}</h2>
            }
          },
          list: ({ children, format }) => {
            const Tag = format === "ordered" ? "ol" : "ul"
            const listClass =
              format === "ordered" ? "list-decimal list-inside mb-4 space-y-2" : "list-disc list-inside mb-4 space-y-2"
            return <Tag className={listClass}>{children}</Tag>
          },
          "list-item": ({ children }) => <li className="text-gray-700">{children}</li>,
          quote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-50 italic text-gray-700">
              {children}
            </blockquote>
          ),
          code: ({ children }) => (
            <pre className="bg-gray-900 text-white p-4 rounded-lg mb-4 overflow-x-auto">
              <code>{children}</code>
            </pre>
          ),
          link: ({ children, url }) => (
            <a href={url} className="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
        }}
        modifiers={{
          bold: ({ children }) => <strong>{children}</strong>,
          italic: ({ children }) => <em>{children}</em>,
          underline: ({ children }) => <u>{children}</u>,
          strikethrough: ({ children }) => <s>{children}</s>,
          code: ({ children }) => (
            <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{children}</code>
          ),
        }}
      />
    </div>
  )
}

export default RichTextRenderer
