import { useState } from 'react'

function PatternCard({ index, text }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
        <span className="text-sm font-medium text-gray-700">
          パターン {index + 1}
        </span>
        <button
          onClick={handleCopy}
          className="px-3 py-1.5 text-xs font-medium bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
        >
          {copied ? 'コピーしました!' : 'コピー'}
        </button>
      </div>
      <div className="p-4 text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
        {text}
      </div>
    </div>
  )
}

export default function PatternResults({ patterns, onRegenerate, loading }) {
  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-gray-800">生成結果</h3>
        <button
          onClick={onRegenerate}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          再生成
        </button>
      </div>
      {patterns.map((text, i) => (
        <PatternCard key={i} index={i} text={text} />
      ))}
    </div>
  )
}
