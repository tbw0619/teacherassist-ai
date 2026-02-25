import { useState } from 'react'
import Spinner from './Spinner'
import ResultDisplay from './ResultDisplay'

const PLAN_TYPES = [
  {
    id: '略案',
    label: '略案',
    desc: '本時案のみのシンプルバージョン',
    icon: '📄',
  },
  {
    id: '細案',
    label: '細案',
    desc: '単元計画まで含むフルバージョン',
    icon: '📋',
  },
]

export default function LessonPlan() {
  const [form, setForm] = useState({
    subject: '',
    unit: '',
    grade: '',
    hours: 1,
    objective: '',
    plan_type: '略案',
    material_note: '',
    student_note: '',
    teaching_note: '',
    content_points: '',
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
    'w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 text-sm transition-all placeholder-gray-400'
  const labelClass = 'block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5'

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* 指導案の種類 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-l-4 border-l-indigo-500 px-5 pt-5 pb-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">指導案の種類</p>
            <div className="grid grid-cols-2 gap-3">
              {PLAN_TYPES.map((type) => (
                <label
                  key={type.id}
                  className={`relative flex flex-col gap-1 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    form.plan_type === type.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="plan_type"
                    value={type.id}
                    checked={form.plan_type === type.id}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{type.icon}</span>
                    <span className={`text-sm font-bold ${form.plan_type === type.id ? 'text-indigo-700' : 'text-gray-700'}`}>
                      {type.label}
                    </span>
                    {form.plan_type === type.id && (
                      <span className="ml-auto w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center">
                        <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 pl-7">{type.desc}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* 基本情報 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-l-4 border-l-blue-500 px-5 pt-5 pb-5 space-y-4">
            <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <span className="text-lg">📝</span> 基本情報
            </p>
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
          </div>
        </div>

        {/* 単元設定の理由 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-l-4 border-l-emerald-500 px-5 pt-5 pb-5 space-y-4">
            <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <span className="text-lg">💡</span>
              <span>単元設定の理由</span>
              <span className="text-xs font-normal text-gray-400 ml-1">（任意）</span>
            </p>
            <div>
              <label className={labelClass}>教材について</label>
              <textarea
                name="material_note"
                value={form.material_note}
                onChange={handleChange}
                placeholder="何を学ぶか、何ができるようになるか"
                rows={2}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>生徒・児童について</label>
              <textarea
                name="student_note"
                value={form.student_note}
                onChange={handleChange}
                placeholder="実態・学習履歴・既習事項など"
                rows={2}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>指導について</label>
              <textarea
                name="teaching_note"
                value={form.teaching_note}
                onChange={handleChange}
                placeholder="どのように学ばせるか・指導の工夫など"
                rows={2}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* 学習内容のポイント */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-l-4 border-l-amber-400 px-5 pt-5 pb-5 space-y-3">
            <p className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <span className="text-lg">⭐</span>
              <span>学習内容のポイント</span>
              <span className="text-xs font-normal text-gray-400 ml-1">（任意）</span>
            </p>
            <textarea
              name="content_points"
              value={form.content_points}
              onChange={handleChange}
              placeholder="特に重視したい内容・強調したいポイントなど"
              rows={3}
              className={inputClass}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 cursor-pointer active:scale-[0.99]"
        >
          {loading ? '生成中...' : `✨ ${form.plan_type}を生成`}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-start gap-2">
          <span className="mt-0.5 shrink-0">⚠️</span>
          {error}
        </div>
      )}

      {loading && <Spinner />}
      {result && <ResultDisplay result={result} />}
    </div>
  )
}
