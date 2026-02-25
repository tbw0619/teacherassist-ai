import { useState } from 'react'

const PATTERN_COLORS = [
  { badge: 'bg-gradient-to-r from-blue-500 to-indigo-500', border: 'border-l-blue-400' },
  { badge: 'bg-gradient-to-r from-emerald-500 to-teal-500', border: 'border-l-emerald-400' },
  { badge: 'bg-gradient-to-r from-violet-500 to-purple-500', border: 'border-l-violet-400' },
]

function PatternCard({ index, text }) {
  const [copied, setCopied] = useState(false)
  const color = PATTERN_COLORS[index % PATTERN_COLORS.length]

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden`}>
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50/20">
        <div className="flex items-center gap-2.5">
          <span className={`w-6 h-6 rounded-lg ${color.badge} text-white text-xs font-bold flex items-center justify-center shadow-sm`}>
            {index + 1}
          </span>
          <span className="text-sm font-semibold text-gray-700">パターン {index + 1}</span>
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
      <div className={`p-5 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap border-l-4 ${color.border}`}>
        {text}
      </div>
    </div>
  )
}

export default function PatternResults({ patterns, onRegenerate, loading }) {
  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
          <h3 className="text-sm font-bold text-gray-800">生成結果 ({patterns.length}パターン)</h3>
        </div>
        <button
          onClick={onRegenerate}
          disabled={loading}
          className="px-4 py-2 text-sm font-semibold bg-white border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer flex items-center gap-1.5"
        >
          <span className={loading ? 'animate-spin inline-block' : ''}>↻</span>
          再生成
        </button>
      </div>
      {patterns.map((text, i) => (
        <PatternCard key={i} index={i} text={text} />
      ))}
    </div>
  )
}
