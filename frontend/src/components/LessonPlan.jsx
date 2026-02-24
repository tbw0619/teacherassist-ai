import { useState } from 'react'
import Spinner from './Spinner'
import ResultDisplay from './ResultDisplay'

export default function LessonPlan() {
  const [form, setForm] = useState({
    subject: '',
    unit: '',
    grade: '',
    hours: 1,
    objective: '',
  })
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: name === 'hours' ? Number(value) : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResult('')
    try {
      const res = await fetch('/api/lesson-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || 'エラーが発生しました')
      }
      const data = await res.json()
      setResult(data.result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>教科</label>
            <input
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="例: 算数"
              required
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>学年</label>
            <input
              name="grade"
              value={form.grade}
              onChange={handleChange}
              placeholder="例: 小学5年"
              required
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>単元名</label>
          <input
            name="unit"
            value={form.unit}
            onChange={handleChange}
            placeholder="例: 分数のたし算とひき算"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>時間数</label>
          <input
            name="hours"
            type="number"
            min="1"
            max="30"
            value={form.hours}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>学習目標</label>
          <textarea
            name="objective"
            value={form.objective}
            onChange={handleChange}
            placeholder="例: 分母が異なる分数のたし算・ひき算の計算方法を理解し、正しく計算できる。"
            required
            rows={3}
            className={inputClass}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          指導案を生成
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      {loading && <Spinner />}
      {result && <ResultDisplay result={result} />}
    </div>
  )
}
