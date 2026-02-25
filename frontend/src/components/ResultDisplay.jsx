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
    <div className="mt-6 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50/30">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
          <span className="text-sm font-semibold text-gray-700">生成結果</span>
        </div>
        <button
          onClick={handleCopy}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
            copied
              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
          }`}
        >
          {copied ? '✓ コピー完了' : 'コピー'}
        </button>
      </div>
      <div
        className="result-content p-5 text-sm text-gray-700 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: markdownToHtml(result) }}
      />
    </div>
  )
}
