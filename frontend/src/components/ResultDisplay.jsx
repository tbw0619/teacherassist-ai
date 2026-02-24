import { useState } from 'react'

function markdownToHtml(text) {
  let html = text
    // Tables
    .replace(/\|(.+)\|\n\|[-| :]+\|\n/g, (match, header) => {
      const headers = header.split('|').map(h => h.trim()).filter(Boolean)
      return `<table><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>`
    })
    .replace(/\|(.+)\|/g, (match, row) => {
      const cells = row.split('|').map(c => c.trim()).filter(Boolean)
      return `<tr>${cells.map(c => `<td>${c}</td>`).join('')}</tr>`
    })
    // Close tables (before next heading or double newline after tbody)
    .replace(/(<\/tr>)\n\n/g, '$1</tbody></table>\n\n')
    .replace(/(<\/tr>)\n(##)/g, '$1</tbody></table>\n$2')
    // Headings
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Line breaks
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')

  // Close any unclosed tables
  if (html.includes('<tbody>') && !html.includes('</tbody>')) {
    html += '</tbody></table>'
  }

  return `<p>${html}</p>`
}

export default function ResultDisplay({ result }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="mt-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <span className="text-sm font-medium text-gray-700">生成結果</span>
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
        >
          {copied ? 'コピーしました!' : 'コピー'}
        </button>
      </div>
      <div
        className="result-content p-4 text-sm text-gray-800 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: markdownToHtml(result) }}
      />
    </div>
  )
}
