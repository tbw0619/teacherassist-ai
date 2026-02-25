import { useState } from 'react'
import Spinner from './Spinner'
import PatternResults from './PatternResults'

const STRONG_SUBJECTS = [
  '国語', '数学', '英語', '理科', '社会',
  '保健体育', '芸術', '情報', '専門科目', '全般的に意欲的',
]

const STUDY_ATTITUDE = [
  '授業に真剣に取り組んでいる',
  '予習・復習など自主的に学習している',
  '粘り強く課題に取り組む',
  '積極的に発言・質問する',
  '友人と協力して学ぶ姿勢がある',
  '実技・実習に意欲的に取り組む',
  '学期を通じて成長・向上が見られた',
]

const PERSONALITY = [
  '明るく元気がある',
  '責任感が強い',
  '思いやりがある',
  '穏やかで落ち着いている',
  '誠実で真面目',
  '粘り強い',
  '積極的・行動力がある',
  '素直で向上心がある',
]

const SCHOOL_LIFE = [
  '礼儀正しく言動が落ち着いている',
  '時間・規則をよく守る',
  '清掃・当番活動に真剣に取り組む',
  '友人関係が良好で信頼されている',
  '困っている人を自然に助けられる',
  '自分の役割を最後まで果たす',
  '異なる意見も尊重しながら行動できる',
]

const ACHIEVEMENTS = [
  '学校行事でリーダーとして活躍した',
  '縁の下の力持ちとしてチームを支えた',
  '資格・検定・コンクール等で成果を上げた',
  'ボランティアや地域活動に参加した',
  'クラスや学校の雰囲気づくりに貢献した',
  '部活動で顕著な成長・活躍があった',
]

const initialForm = {
  strong_subjects: [],
  study_attitude: [],
  study_note: '',
  personality: [],
  school_life: [],
  behavior_note: '',
  club: '',
  committee: '',
  achievements: [],
  activity_note: '',
  general_note: '',
}

function CheckboxGroup({ label, options, selected, onChange, color = 'blue' }) {
  const toggle = (item) => {
    onChange(
      selected.includes(item)
        ? selected.filter((s) => s !== item)
        : [...selected, item]
    )
  }

  const selectedStyle = {
    blue: 'bg-gradient-to-r from-blue-500 to-indigo-500 border-transparent text-white shadow-sm',
    emerald: 'bg-gradient-to-r from-emerald-500 to-teal-500 border-transparent text-white shadow-sm',
    amber: 'bg-gradient-to-r from-amber-400 to-orange-400 border-transparent text-white shadow-sm',
  }[color]

  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option}
            className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm border cursor-pointer transition-all duration-150 select-none ${
              selected.includes(option)
                ? selectedStyle
                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <input
              type="checkbox"
              checked={selected.includes(option)}
              onChange={() => toggle(option)}
              className="sr-only"
            />
            {selected.includes(option) && <span className="mr-1 text-xs">✓</span>}
            {option}
          </label>
        ))}
      </div>
    </div>
  )
}

export default function StudentRecord() {
  const [form, setForm] = useState(initialForm)
  const [patterns, setPatterns] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()
    setLoading(true)
    setError('')
    setPatterns(null)

    try {
      const res = await fetch('/api/student-record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.detail || 'エラーが発生しました')
      }
      const data = await res.json()
      setPatterns(data.patterns)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClass =
    'w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 text-sm transition-all placeholder-gray-400'

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 学習の記録 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-l-4 border-l-blue-500 px-5 pt-5 pb-5 space-y-4">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <span className="text-lg">📚</span>
              <span>学習の記録</span>
            </h3>
            <CheckboxGroup
              label="得意・頑張った教科"
              options={STRONG_SUBJECTS}
              selected={form.strong_subjects}
              onChange={(v) => updateField('strong_subjects', v)}
              color="blue"
            />
            <CheckboxGroup
              label="学習への取り組み姿勢"
              options={STUDY_ATTITUDE}
              selected={form.study_attitude}
              onChange={(v) => updateField('study_attitude', v)}
              color="blue"
            />
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">学習面の補足（任意）</p>
              <textarea
                value={form.study_note}
                onChange={(e) => updateField('study_note', e.target.value)}
                placeholder="具体的なエピソード・特記事項など"
                rows={2}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* 行動・生活の記録 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-l-4 border-l-emerald-500 px-5 pt-5 pb-5 space-y-4">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <span className="text-lg">🤝</span>
              <span>行動・生活の記録</span>
            </h3>
            <CheckboxGroup
              label="性格・人柄"
              options={PERSONALITY}
              selected={form.personality}
              onChange={(v) => updateField('personality', v)}
              color="emerald"
            />
            <CheckboxGroup
              label="学校生活での様子"
              options={SCHOOL_LIFE}
              selected={form.school_life}
              onChange={(v) => updateField('school_life', v)}
              color="emerald"
            />
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">行動・人柄の補足（任意）</p>
              <textarea
                value={form.behavior_note}
                onChange={(e) => updateField('behavior_note', e.target.value)}
                placeholder="印象的なエピソード・具体的な場面など"
                rows={2}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* 特別活動・その他 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-l-4 border-l-amber-400 px-5 pt-5 pb-5 space-y-4">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <span className="text-lg">🏃</span>
              <span>特別活動・その他</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">部活動（任意）</p>
                <input
                  value={form.club}
                  onChange={(e) => updateField('club', e.target.value)}
                  placeholder="例: 野球部・吹奏楽部"
                  className={inputClass}
                />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">委員会・学級での役割（任意）</p>
                <input
                  value={form.committee}
                  onChange={(e) => updateField('committee', e.target.value)}
                  placeholder="例: 学級委員・図書委員"
                  className={inputClass}
                />
              </div>
            </div>
            <CheckboxGroup
              label="特記すべき活躍"
              options={ACHIEVEMENTS}
              selected={form.achievements}
              onChange={(v) => updateField('achievements', v)}
              color="amber"
            />
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">特別活動の補足（任意）</p>
              <textarea
                value={form.activity_note}
                onChange={(e) => updateField('activity_note', e.target.value)}
                placeholder="大会結果・具体的なエピソードなど"
                rows={2}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* 総合的な特記事項 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="border-l-4 border-l-violet-500 px-5 pt-5 pb-5 space-y-3">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
              <span className="text-lg">✏️</span>
              <span>総合的な特記事項（任意）</span>
            </h3>
            <textarea
              value={form.general_note}
              onChange={(e) => updateField('general_note', e.target.value)}
              placeholder="上記全体を通じて伝えたいこと"
              rows={3}
              className={inputClass}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 cursor-pointer active:scale-[0.99] text-base"
        >
          {loading ? '生成中...' : '✨ 所見文を生成'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-start gap-2">
          <span className="mt-0.5 shrink-0">⚠️</span>
          {error}
        </div>
      )}

      {loading && <Spinner />}
      {patterns && (
        <PatternResults
          patterns={patterns}
          onRegenerate={handleSubmit}
          loading={loading}
        />
      )}
    </div>
  )
}
